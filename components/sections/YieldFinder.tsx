'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const PROTOCOLS = [
  { name: 'Kamino Finance', type: 'Lending', apy: '12.4%', tvl: '$1.2B', risk: 'Low', badge: 'b-green', token: 'SOL/USDC' },
  { name: 'Marinade Finance', type: 'Liquid Staking', apy: '7.8%', tvl: '$890M', risk: 'Low', badge: 'b-green', token: 'mSOL' },
  { name: 'Jito', type: 'Liquid Staking', apy: '8.2%', tvl: '$2.1B', risk: 'Low', badge: 'b-green', token: 'jitoSOL' },
  { name: 'Raydium', type: 'LP / AMM', apy: '34.7%', tvl: '$320M', risk: 'Medium', badge: 'b-gold', token: 'RAY/SOL' },
  { name: 'Orca', type: 'Concentrated LP', apy: '58.2%', tvl: '$180M', risk: 'Medium', badge: 'b-gold', token: 'BONK/SOL' },
  { name: 'Drift Protocol', type: 'Perps', apy: '18.9%', tvl: '$240M', risk: 'Medium', badge: 'b-gold', token: 'USDC' },
  { name: 'Meteora', type: 'Dynamic LP', apy: '142%', tvl: '$89M', risk: 'High', badge: 'b-red', token: 'YST/SOL' },
  { name: 'Francium', type: 'Leveraged LP', apy: '220%', tvl: '$22M', risk: 'High', badge: 'b-red', token: 'BONK/SOL' },
];

export default function YieldFinder({ walletConnected, ystBalance, onNavigate }: Props) {
  const [filter, setFilter] = useState('All');
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const filtered = filter === 'All' ? PROTOCOLS : PROTOCOLS.filter(p => p.risk === filter);

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar green" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">💰 YIELD FINDER</div>
          <span className="badge b-green">LIVE</span>
        </div>
        <div className="sec-sub">Discover the best yield opportunities across Solana DeFi protocols.</div>
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
          <div className="locked-title">YIELD FINDER</div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access yield opportunities.</div>
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
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Space Mono,monospace' }}>RISK:</span>
            {['All','Low','Medium','High'].map(r => (
              <button key={r} className={`mode-pill ${filter===r?'active':''}`} onClick={() => setFilter(r)}>{r}</button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--dim)', fontFamily: 'Space Mono,monospace' }}>APY ESTIMATES · NOT FINANCIAL ADVICE</span>
          </div>

          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>PROTOCOL</th><th>TYPE</th><th>PAIR / TOKEN</th><th>EST. APY</th><th>TVL</th><th>RISK</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.name}>
                    <td style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{p.name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 11 }}>{p.type}</td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--blue)' }}>{p.token}</td>
                    <td style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--green)' }}>{p.apy}</td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)' }}>{p.tvl}</td>
                    <td><span className={`badge ${p.badge}`}>{p.risk}</span></td>
                    <td><a href="https://app.kamino.finance" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '3px 9px', fontSize: 9 }}>ENTER ↗</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 10, fontFamily: 'Space Mono,monospace' }}>
            ⚠ APY estimates are indicative only. DeFi yields are variable. Always DYOR before depositing funds.
          </div>
        </div>
      )}
    </div>
  );
}
