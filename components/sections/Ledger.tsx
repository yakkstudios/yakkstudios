'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const RUGS = [
  { name: 'SQUIDGAME2', dev: '4r3b...beC', amount: '$2.1M', date: '2026-03-20', type: 'HARD RUG', victims: 847, badge: 'b-red' },
  { name: 'MOONPUMP', dev: 'BhsY...ijN', amount: '$890K', date: '2026-03-18', type: 'SOFT RUG', victims: 312, badge: 'b-gold' },
  { name: 'SOLBONK', dev: '7oKJ...MSk', amount: '$340K', date: '2026-03-15', type: 'MIGRATION SCAM', victims: 156, badge: 'b-red' },
  { name: 'WAGMI2025', dev: '6VCN...bag', amount: '$1.4M', date: '2026-03-10', type: 'HARD RUG', victims: 524, badge: 'b-red' },
  { name: 'PEPESOL', dev: '8EwC...BU7', amount: '$210K', date: '2026-03-05', type: 'SLOW RUG', victims: 89, badge: 'b-gold' },
];

export default function Ledger({ walletConnected, ystBalance, onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const filtered = RUGS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.dev.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--red),var(--pink))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">📒 RUG LEDGER</div>
          <span className="badge b-red">COMMUNITY DB</span>
        </div>
        <div className="sec-sub">Community-maintained database of confirmed rug pulls &amp; scam tokens on Solana.</div>
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
          <div className="locked-title">RUG LEDGER</div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access the rug ledger.</div>
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
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <input className="field-inp" placeholder="Search token or dev wallet..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-pink" style={{ fontSize: 11 }}>+ Submit Rug</button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            {[['Total Rugs', RUGS.length.toString(), 'var(--red)'], ['Total Stolen', '$5.0M+', 'var(--red)'], ['Victims', '1,928+', 'var(--gold)']].map(([l, v, c]) => (
              <div key={l as string} className="stat-card" style={{ flex: 1 }}>
                <div className="slbl">{l}</div>
                <div className="sval" style={{ color: c as string, fontSize: 18 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr><th>TOKEN</th><th>DEV WALLET</th><th>TYPE</th><th>AMOUNT STOLEN</th><th>VICTIMS</th><th>DATE</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.name}>
                    <td style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700 }}>{r.name}</td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)' }}>{r.dev}</td>
                    <td><span className={`badge ${r.badge}`}>{r.type}</span></td>
                    <td style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: 'var(--red)' }}>{r.amount}</td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{r.victims}</td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)' }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 10, fontFamily: 'Space Mono,monospace' }}>
            Community-submitted. DYOR before investing in any token. YAKK Studios is not liable for losses.
          </div>
        </div>
      )}
    </div>
  );
}
