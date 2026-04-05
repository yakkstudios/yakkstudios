'use client';
import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

// ── Token addresses for trusted list ─────────────────────────────────────────
const TRUSTED_MINTS: { symbol: string; name: string; mint: string }[] = [
  { symbol: '$LOCK', name: 'Streamlock',  mint: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump' },
  { symbol: '$SPT',  name: 'StakePoint',  mint: 'A1d4sAmgi4Njnodmc289HP7TaPxw54n4Ey3LRDfrBvo5' },
];

function fmtSol(n: number) { return n.toFixed(4) + ' SOL'; }
function fmtUsd(sol: number, price: number) { return '$' + (sol * price).toFixed(2); }

export default function Portfolio({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [ystPrice, setYstPrice] = useState<number | null>(null);
  const [trustedBalances, setTrustedBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch SOL balance + trusted token balances on-chain
  useEffect(() => {
    if (!walletConnected || !publicKey || !hasAccess) return;
    setLoading(true);

    async function load() {
      try {
        // SOL balance
        const lamports = await connection.getBalance(publicKey!);
        setSolBalance(lamports / LAMPORTS_PER_SOL);

        // Trusted token balances
        const balances: Record<string, number> = {};
        for (const t of TRUSTED_MINTS) {
          try {
            const mint = new PublicKey(t.mint);
            const accounts = await connection.getParsedTokenAccountsByOwner(publicKey!, { mint });
            const ui = accounts.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
            balances[t.symbol] = ui;
          } catch {
            balances[t.symbol] = 0;
          }
        }
        setTrustedBalances(balances);
      } catch {
        // silently handle RPC errors
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [walletConnected, publicKey, connection, hasAccess, refreshKey]);

  // Fetch prices from /api/price and /api/ticker
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch('/api/price');
        if (res.ok) {
          const d = await res.json();
          if (d.price) setYstPrice(parseFloat(d.price));
        }
      } catch { /* ignore */ }
      try {
        const res = await fetch('/api/ticker');
        if (res.ok) {
          const items: { symbol: string; price: number }[] = await res.json();
          const sol = items.find(i => i.symbol === 'SOL');
          if (sol?.price) setSolPrice(sol.price);
        }
      } catch { /* ignore */ }
    }
    fetchPrices();
  }, []);

  // ── Gate ──────────────────────────────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div className="sec-pad">
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Connect your wallet and hold <strong>10,000,000 $YST</strong> to access the portfolio tracker.
          </div>
          {walletConnected && (
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 14 }}>
              You hold: {ystBalance.toLocaleString()} $YST
            </div>
          )}
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST on Meteora
          </a>
        </div>
      </div>
    );
  }

  // ── Portfolio values ───────────────────────────────────────────────────────
  const ystVal  = ystPrice  != null ? ystBalance  * ystPrice  : null;
  const solVal  = solPrice  != null && solBalance != null ? solBalance * solPrice : null;
  const totalVal = ystVal != null && solVal != null ? ystVal + solVal : null;

  const holdings = [
    {
      symbol: '$YST',
      name: 'YAKK Studios',
      balance: ystBalance.toLocaleString(),
      price: ystPrice != null ? '$' + ystPrice.toFixed(10).replace(/\.?0+$/, '') : '—',
      value: ystVal != null ? '$' + ystVal.toFixed(2) : 'Fetching…',
    },
    {
      symbol: '$SOL',
      name: 'Solana',
      balance: solBalance != null ? fmtSol(solBalance) : loading ? 'Loading…' : '—',
      price: solPrice != null ? '$' + solPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—',
      value: solVal != null ? fmtUsd(solBalance!, solPrice!) : 'Fetching…',
    },
    ...TRUSTED_MINTS.map(t => ({
      symbol: t.symbol,
      name: t.name,
      balance: trustedBalances[t.symbol] != null ? trustedBalances[t.symbol].toLocaleString() : loading ? 'Loading…' : '—',
      price: '—',
      value: '—',
    })),
  ];

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">YOUR HOLDINGS</div>
      <div className="sec-title">Portfolio Tracker</div>
      <div className="sec-bar" />
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Holdings pulled live from the blockchain. No data leaves your browser. Prices via DexScreener.
      </p>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'TOTAL VALUE (USD)', val: totalVal != null ? '$' + totalVal.toFixed(2) : '…', c: 'var(--pink)' },
          { label: 'SOL BALANCE',        val: solBalance != null ? fmtSol(solBalance) : '…',       c: 'var(--gold)' },
          { label: '$YST HELD',          val: ystBalance.toLocaleString(),                          c: 'var(--text)' },
        ].map(s => (
          <div key={s.label} className="card-sm" style={{ textAlign: 'center', padding: '14px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.c }}>{s.val}</div>
            <div style={{ fontSize: 8, color: 'var(--dim)', marginTop: 3, letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Holdings table */}
      <div className="card-sm" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em' }}>HOLDINGS</div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--dim)', padding: '4px 10px', cursor: 'pointer', fontSize: 9, fontFamily: 'Space Mono,monospace' }}
          >
            {loading ? '…' : '↻ REFRESH'}
          </button>
        </div>

        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 4, padding: '5px 0', borderBottom: '1px solid var(--border)', color: 'var(--dim)', letterSpacing: '0.1em', marginBottom: 4 }}>
          <div>TOKEN</div><div>BALANCE</div><div>PRICE</div><div>VALUE</div>
        </div>

        {holdings.map((h, i) => (
          <div key={h.symbol} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 4, padding: '9px 0', borderBottom: i < holdings.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{h.symbol}</span>
              <span style={{ color: 'var(--dim)', fontSize: 9, marginLeft: 6 }}>{h.name}</span>
            </div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{h.balance}</div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--dim)' }}>{h.price}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11 }}>{h.value}</div>
          </div>
        ))}
      </div>

      {/* Transactions placeholder */}
      <div className="card-sm" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>RECENT TRANSACTIONS</div>
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--dim)', fontSize: 11 }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>⏳</div>
          Live transaction history — coming in the next release.
          <div style={{ marginTop: 6, fontSize: 9, fontFamily: 'Space Mono,monospace' }}>
            View on Solscan or Birdeye in the meantime ↓
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <a href={`https://birdeye.so/profile/${publicKey?.toBase58() ?? ''}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Birdeye ↗</a>
        <a href={`https://solscan.io/account/${publicKey?.toBase58() ?? ''}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Solscan ↗</a>
      </div>
    </div>
  );
}
