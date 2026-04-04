'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const MOCK_HOLDINGS = [
  { sym: '$SOL',  name: 'Solana',       bal: '12.4', price: '$168.00',    val: '$2,083',  chg: '+1.2%',  pos: true  },
  { sym: '$YST',  name: 'YAKK Studios', bal: '',     price: '$0.0000018', val: '',        chg: '+1.44%', pos: true  },
  { sym: '$BONK', name: 'BONK',         bal: '4.2M', price: '$0.0000218', val: '$91.56',  chg: '+3.21%', pos: true  },
  { sym: '$WIF',  name: 'dogwifhat',    bal: '42',   price: '$1.42',      val: '$59.64',  chg: '-2.1%',  pos: false },
];

const MOCK_TXNS = [
  { type: 'BUY',  token: '$YST', amount: '500,000', date: '2d ago', val: '+$0.90',  pos: true  },
  { type: 'SELL', token: '$WIF', amount: '10',       date: '4d ago', val: '-$14.20', pos: false },
  { type: 'BUY',  token: '$SOL', amount: '2.5',      date: '7d ago', val: '+$420.00', pos: true },
];

export default function Portfolio({ walletConnected, ystBalance, onNavigate }: Props) {
  // Single hasAccess declaration — whale gate (10M+)
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const [refreshing, setRefreshing] = useState(false);
  const ystVal = (ystBalance * 0.0000018).toFixed(2);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // ── Hard gate ─────────────────────────────────────────────────────────────
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
          <a className="btn btn-gold" href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer">
            Get $YST on Jupiter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">YOUR HOLDINGS</div>
      <div className="sec-title">Portfolio Tracker</div>
      <div className="sec-bar" />
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Your holdings pulled live from the blockchain. No data leaves your browser.
      </p>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'TOTAL VALUE',  val: '$8,214',  c: 'var(--pink)' },
          { label: 'SOL BALANCE',  val: '12.4 SOL', c: 'var(--gold)' },
          { label: 'TOKENS HELD', val: '4',        c: 'var(--text)' },
          { label: '24H CHANGE',   val: '+3.2%',   c: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="card-sm" style={{ textAlign: 'center', padding: '14px 8px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.val}</div>
            <div style={{ fontSize: 8, color: 'var(--dim)', marginTop: 3, letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Holdings table */}
      <div className="card-sm" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em' }}>HOLDINGS</div>
          <button
            onClick={handleRefresh}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--dim)', padding: '4px 10px', cursor: 'pointer', fontSize: 9, fontFamily: 'Space Mono,monospace' }}
          >
            {refreshing ? '…' : '↻ REFRESH'}
          </button>
        </div>
        <div>
          {MOCK_HOLDINGS.map((h, i) => {
            const bal = h.sym === '$YST' ? ystBalance.toLocaleString() : h.bal;
            const val = h.sym === '$YST' ? '$' + ystVal : h.val;
            return (
              <div key={h.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < MOCK_HOLDINGS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ flex: 2 }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{h.sym}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 6 }}>{h.name}</span>
                </div>
                <div style={{ flex: 1, fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{bal}</div>
                <div style={{ flex: 1, fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{h.price}</div>
                <div style={{ flex: 1, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{val}</div>
                <div style={{ flex: 1, fontFamily: 'Space Mono,monospace', fontSize: 10, color: h.pos ? 'var(--green)' : 'var(--red)', textAlign: 'right' }}>{h.chg}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card-sm">
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>RECENT TRANSACTIONS</div>
        {MOCK_TXNS.map((tx, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < MOCK_TXNS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className={`badge ${tx.pos ? 'b-green' : 'b-red'}`} style={{ minWidth: 36, textAlign: 'center', fontSize: 8 }}>{tx.type}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{tx.token}</span>
              <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginLeft: 8 }}>{tx.amount}</span>
            </div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>{tx.date}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, color: tx.pos ? 'var(--green)' : 'var(--red)' }}>{tx.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Birdeye ↗</a>
        <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Solscan ↗</a>
      </div>
    </div>
  );
}
