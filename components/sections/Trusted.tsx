'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const TRUSTED = [
  { handle: '@ZachXBT', name: 'ZachXBT', role: 'Fraud Investigator', score: 98, tags: ['VERIFIED', 'ON-CHAIN SLEUTH'], badge: 'b-green', x: 'https://x.com/zachxbt' },
  { handle: '@0xfoobar', name: '0xfoobar', role: 'Security Researcher', score: 95, tags: ['VERIFIED', 'DEV'], badge: 'b-green', x: 'https://x.com/0xfoobar' },
  { handle: '@MustStopMurad', name: 'Murad', role: 'Memecoin Analyst', score: 89, tags: ['ANALYST', 'LONG TERM'], badge: 'b-blue', x: 'https://x.com/MustStopMurad' },
  { handle: '@ansem�t', name: 'Ansem', role: 'Macro / Solana Trader', score: 82, tags: ['TRADER', 'SOLANA OG'], badge: 'b-blue', x: 'https://x.com/blknoiz06' },
  { handle: '@cobie', name: 'Cobie', role: 'CT Legend / Alpha', score: 91, tags: ['VERIFIED', 'LEGEND'], badge: 'b-green', x: 'https://x.com/cobie' },
  { handle: '@gainzy222', name: 'Gainzy', role: 'Solana Degen Trader', score: 79, tags: ['DEGEN', 'SOLANA'], badge: 'b-yakk', x: 'https://x.com/gainzy222' },
  { handle: '@inversebrah', name: 'InverseBrah', role: 'Contrarian Analysis', score: 84, tags: ['ANALYST'], badge: 'b-blue', x: 'https://x.com/inversebrah' },
  { handle: '@kookCapital', name: 'Kook Capital', role: 'On-chain Alpha', score: 87, tags: ['ON-CHAIN', 'ALPHA'], badge: 'b-blue', x: 'https://x.com/KookCapitalLLC' },
];

export default function Trusted({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--green),var(--blue))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Connect your wallet and hold <strong>10,000,000 $YST</strong> to unlock this tool.
          </div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST
          </a>
        </div>
      )}

      {hasAccess && (
      <div className="sec-title">⛈️ TRUSTED LIST</div>
          <span className="badge b-green">PUBLIC</span>
        </div>
        <div className="sec-sub">YAKK-vetted CT analysts &amp; wallets with verified track records. Do your own research.</div>
      </div>

      <div className="warn-bar">⛈️ This list is curated by the YAKK community and updated regularly. It is NOT an endorsement. Always DYOR.</div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {['ALL', 'VERIFIED', 'ANALYST', 'ON-CHAIN', 'TRADER'].map(f => (
          <button key={f} className="mode-pill active" style={{ fontSize: 9 }}>{f}</button>
        ))}
      </div>

      <div className="grid2">
        {TRUSTED.map(t => (
          <div key={t.handle} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', transition: 'border-color 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--pink)' }}>{t.handle}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--green)' }}>{t.score}</div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>TRUST SCORE</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>{t.role}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
              {t.tags.map(tag => <span key={tag} className={`badge ${t.badge}`}>{tag}</span>)}
            </div>
            <a href={t.x} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 9, padding: '3px 10px' }}>View on X ↗</a>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>✉️</span>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>Nominate someone</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Think someone deserves to be on the trusted list? DM us on X — community votes decide.</div>
        </div>
        <a href="https://x.com/YAKKStudios" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>DM on X ↗</a>
      </div>
    </div>
  );
}
