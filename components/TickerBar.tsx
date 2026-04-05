'use client';
import { useEffect, useState, useCallback } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// ── Types ──────────────────────────────────────────────────────────────────────
interface TickerItem {
  symbol: string;
  price: string;
  change24h: number;
}

interface TickerBarProps {
  onConnectWallet?: () => void; // kept for API compat — wallet modal handled internally
  walletConnected: boolean;
  walletLabel: string;
  onDisconnect?: () => void;
}

// ── Formatters ─────────────────────────────────────────────────────────────────
function fmtPrice(p: string): string {
  const n = parseFloat(p);
  if (!n || isNaN(n)) return '$—';
  if (n < 0.000001) return '$' + n.toExponential(2);
  if (n < 0.0001)   return '$' + n.toFixed(7);
  if (n < 0.01)     return '$' + n.toFixed(5);
  if (n < 1)        return '$' + n.toFixed(4);
  if (n < 1000)     return '$' + n.toFixed(2);
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Single ticker chip ─────────────────────────────────────────────────────────
function TickerChip({ item }: { item: TickerItem }) {
  const up = item.change24h >= 0;
  const changeColor = up ? '#4ade80' : '#f87171';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '0 18px',
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      <span style={{ fontWeight: 700, color: '#f5f5f7', fontSize: 10, fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em' }}>
        ${item.symbol}
      </span>
      <span style={{ color: '#999', fontSize: 10, fontFamily: 'Space Mono, monospace' }}>
        {fmtPrice(item.price)}
      </span>
      <span style={{ color: changeColor, fontSize: 9, fontFamily: 'Space Mono, monospace' }}>
        {up ? '▲' : '▼'}{Math.abs(item.change24h).toFixed(2)}%
      </span>
    </span>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function TickerBar({
  walletConnected,
  walletLabel,
  onDisconnect,
}: TickerBarProps) {
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  // useWalletModal from @solana/wallet-adapter-react-ui — opens the Phantom/Solflare picker
  const { setVisible } = useWalletModal();

  const fetchTickers = useCallback(async () => {
    try {
      const res = await fetch('/api/ticker');
      if (!res.ok) throw new Error('bad status');
      const data: TickerItem[] = await res.json();
      if (Array.isArray(data) && data.length > 0) setTickers(data);
    } catch {
      // silent — UI degrades gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickers();
    const id = setInterval(fetchTickers, 30_000);
    return () => clearInterval(id);
  }, [fetchTickers]);

  // Triplicate for seamless 33.333% scroll loop
  const items = tickers.length > 0
    ? [...tickers, ...tickers, ...tickers]
    : [];

  return (
    <>
      {/* CSS keyframe injected inline — no globals.css edit required */}
      <style>{`
        @keyframes yakk-ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3334%); }
        }
        #ticker-bar { position: relative; }
        #ticker-bar:hover .yakk-ticker-inner { animation-play-state: paused; }
      `}</style>

      <div id="ticker-bar" style={{ display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>

        {/* ── Scrolling section ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', minWidth: 0 }}>
          {loading || tickers.length === 0 ? (
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#444', padding: '0 14px' }}>
              {loading ? 'LOADING MARKET DATA...' : 'MARKET DATA UNAVAILABLE'}
            </span>
          ) : (
            <div
              className="yakk-ticker-inner"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                animation: 'yakk-ticker-scroll 45s linear infinite',
                willChange: 'transform',
              }}
            >
              {items.map((t, i) => (
                <TickerChip key={`${t.symbol}-${i}`} item={t} />
              ))}
            </div>
          )}
        </div>

        {/* ── Wallet button — fixed right ───────────────────────────────────── */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', paddingLeft: 10, paddingRight: 8, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          {walletConnected ? (
            <button
              className="btn btn-ghost btn-sm"
              onClick={onDisconnect}
              style={{ fontSize: 10, whiteSpace: 'nowrap' }}
            >
              {walletLabel}
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setVisible(true)}
              style={{ fontSize: 10, whiteSpace: 'nowrap' }}
            >
              CONNECT WALLET
            </button>
          )}
        </div>

      </div>
    </>
  );
}
