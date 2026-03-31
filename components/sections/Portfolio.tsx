'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const MOCK_HOLDINGS = [
  { sym: '$SOL', name: 'Solana', bal: '12.4', price: '$168.00', val: '$2,083', chg: '+1.2%', pos: true },
  { sym: '$YST', name: 'YAKK Studios', bal: '', price: '$0.0000018', val: '', chg: '+1.44%', pos: true },
  { sym: '$BONK', name: 'BONK', bal: '4.2M', price: '$0.0000218', val: '$91.56', chg: '+3.21%', pos: true },
  { sym: '$WIF', name: 'dogwifhat', bal: '42', price: '$1.42', val: '$59.64', chg: '-2.1%', pos: false },
];

const MOCK_TXNS = [
  { type: 'BUY', token: '$YST', amount: '500,000', date: '2d ago', val: '+$0.90', pos: true },
  { type: 'SELL', token: '$WIF', amount: '10', date: '4d ago', val: '-$14.20', pos: false },
  { type: 'BUY', token: '$SOL', amount: '2.5', date: '7d ago', val: '+$420.00', pos: true },
];

export default function Portfolio({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const ystVal = (ystBalance * 0.0000018).toFixed(2);

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">YOUR HOLDINGS</div>
      <div className="sec-title">Portfolio Tracker</div>
      <div className="sec-bar"></div>

      {/* Token gate row */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5, marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>250,000+ $YST 🪙 Held</span>
        <span className={`badge ${walletConnected ? (hasAccess ? 'b-green' : 'b-red') : 'b-dim'}`}>
          {walletConnected ? (hasAccess ? '✓ ACCESS GRANTED' : '✗ NEED MORE YST') : 'NOT CHECKED'}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Connect your Phantom wallet to see your full holdings, P&amp;L, and on-chain history. No data leaves your browser.
      </p>

      {/* Connect notice — shown when not connected */}
      {!walletConnected && (
        <div style={{ background: 'rgba(224,96,126,0.08)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: 10, padding: 24, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>👛</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Connect Wallet to View Portfolio</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginBottom: 14 }}>Your holdings are pulled live from the blockchain. Nothing is stored on our servers.</div>
          <button className="btn btn-pink">CONNECT PHANTOM</button>
        </div>
      )}

      {/* Insufficient YST notice */}
      {walletConnected && !hasAccess && (
        <div style={{ background: 'rgba(224,96,126,0.08)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: 10, padding: 24, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🐋</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>WHALE CLUB EXCLUSIVE Balance</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginBottom: 12 }}>
            You need 250,000+ $YST to access the portfolio tracker. You hold {ystBalance.toLocaleString()} $YST.
          </div>
          <div className="prog-bar" style={{ maxWidth: 280, margin: '0 auto 14px' }}>
            <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 10_000_000) * 100) + '%' }} />
          </div>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get $YST on Jupiter →</a>
        </div>
      )}

      {/* Full portfolio — shown when wallet connected and hasAccess */}
      {walletConnected && hasAccess && (
        <div>
          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
            <div className="card-sm" style={{ textAlign: 'center', padding: '14px 8px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--pink)' }}>$8,214</div>
              <div style={{ fontSize: 8, color: 'var(--dim)', marginTop: 3, letterSpacing: '0.1em' }}>TOTAL VALUE</div>
            </div>
            <div className="card-sm" style={{ textAlign: 'center', padding: '14px 8px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>12.4 SOL</div>
              <div style={{ fontSize: 8, color: 'var(--dim)', marginTop: 3, letterSpacing: '0.1em' }}>SOL BALANCE</div>
            </div>
            <div className="card-sm" style={{ textAlign: 'center', padding: '14px 8px' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>4</div>
              <div style={{ fontSize: 8, color: 'var(--dim)', marginTop: 3, letterSpacing: '0.1em' }}>TOKENS HELD</div>
            </div>
            <div className="card-sm" style={{ textAlign: 'center', padding: '14px 8px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>+3.2%</div>
              <div style={{ fontSize: 8, color: 'var(--dim)', marginTop: 3, letterSpacing: '0.1em' }}>24H CHANGE</div>
            </div>
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
            <div>
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
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Birdeye ↗</a>
            <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Solscan ↗</a>
          </div>
        </div>
      )}
    </div>
  );
      }
