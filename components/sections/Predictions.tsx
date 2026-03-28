'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const MARKETS = [
  { q: 'Will $SOL reach $250 before end of April 2026?', yes: 62, no: 38, vol: '84K YST', end: '30 Apr', cat: 'PRICE' },
  { q: 'Will $YAKK market cap exceed $10M in Q2 2026?', yes: 71, no: 29, vol: '210K YST', end: '30 Jun', cat: 'YAKK' },
  { q: 'Will Solana surpass Ethereum in daily DEX volume in May 2026?', yes: 58, no: 42, vol: '320K YST', end: '31 May', cat: 'MACRO' },
  { q: 'Will BTC hit a new ATH above $120K by June 2026?', yes: 44, no: 56, vol: '540K YST', end: '30 Jun', cat: 'PRICE' },
  { q: 'Will BONK outperform WIF in Q2 2026?', yes: 55, no: 45, vol: '128K YST', end: '30 Jun', cat: 'PRICE' },
];

export default function Predictions({ walletConnected, ystBalance, onNavigate }: Props) {
  const [bet, setBet] = useState<Record<string, 'yes'|'no'|null>>({});
  const hasAccess = walletConnected && ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--pink),var(--gold))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🎯 PREDICTION MARKETS</div>
          <span className="badge b-yakk">BETA</span>
        </div>
        <div className="sec-sub">Bet on crypto outcomes with $YST. Community-driven prediction markets on Solana.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Held</span>
          {hasAccess
            ? <span className="badge b-green">✓ ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">PREDICTION MARKETS</div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access prediction markets.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST 🪙</a>
        </div>
      )}
      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">Insufficient $YST</div>
          <div className="locked-sub">You need <strong>250,000+ $YST</strong>. You hold: {ystBalance.toLocaleString()} $YST.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get More $YST 🪙</a>
        </div>
      )}

      {hasAccess && (
        <div>
          <div className="warn-bar">🎯 BETA — Markets are for entertainment &amp; community engagement. Payouts are in $YST. Not financial advice.</div>
          {MARKETS.map((m, i) => (
            <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <span className={`badge b-${m.cat === 'YAKK' ? 'yakk' : m.cat === 'MACRO' ? 'blue' : 'dim'}`}>{m.cat}</span>
                <div style={{ flex: 1, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>{m.q}</div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', whiteSpace: 'nowrap' }}>ends {m.end}</div>
              </div>
              {/* Progress bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--green)' }}>YES {m.yes}%</span>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--red)' }}>NO {m.no}%</span>
                </div>
                <div className="prog-bar"><div className="prog-fill" style={{ width: m.yes + '%' }} /></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className={`btn ${bet[i]==='yes' ? 'btn-green' : 'btn-outline'}`} style={{ fontSize: 10 }} onClick={() => setBet(b => ({ ...b, [i]: 'yes' }))}>YES ↑</button>
                <button className={`btn ${bet[i]==='no' ? 'btn-pink' : 'btn-outline'}`} style={{ fontSize: 10 }} onClick={() => setBet(b => ({ ...b, [i]: 'no' }))}>NO ↓</button>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginLeft: 'auto' }}>Vol: {m.vol}</span>
              </div>
              {bet[i] && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg4)', borderRadius: 6, fontSize: 11, color: 'var(--muted)' }}>
                  ✓ Position: <strong style={{ color: bet[i] === 'yes' ? 'var(--green)' : 'var(--red)' }}>{bet[i]?.toUpperCase()}</strong> — Integration with on-chain escrow coming in V2.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
