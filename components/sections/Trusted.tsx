'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

// ── Trusted list ─────────────────────────────────────────────────────────────
// Only people Jay (@shyfts_) has had genuine interaction with on X.
// Trust score reflects consistency of engagement and track record — not clout.
// Updated manually. DM @shyfts_ on X to nominate.

const TRUSTED = [
  {
    handle: '@ZachXBT',
    name: 'ZachXBT',
    role: 'On-Chain Fraud Investigator',
    score: 97,
    tags: ['ON-CHAIN SLEUTH', 'VERIFIED'],
    badge: 'b-green',
    x: 'https://x.com/zachxbt',
    note: 'Track record speaks for itself. No affiliation required.',
  },
  {
    handle: '@0xfoobar',
    name: '0xfoobar',
    role: 'Smart Contract Security',
    score: 93,
    tags: ['SECURITY', 'DEV'],
    badge: 'b-green',
    x: 'https://x.com/0xfoobar',
    note: 'Consistently accurate security research.',
  },
];

// ── People removed from the list ─────────────────────────────────────────────
// Murad, Ansem, Cobie, Gainzy, InverseBrah, Kook Capital — removed.
// These are public figures with no direct verified interaction with @shyfts_.
// The trusted list reflects real relationships, not CT popularity.

export default function Trusted({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;

  if (!hasAccess) {
    return (
      <div className="sec-pad">
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
      </div>
    );
  }

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">WHALE CLUB — VETTED</div>
      <div className="sec-title">🛡️ TRUSTED LIST</div>
      <div className="sec-bar" />
      <div className="sec-sub">
        People @shyfts_ has directly interacted with on X and trusts. Not a popularity contest — real engagement only.
        Trust scores based on track record, consistency, and response quality.
      </div>

      <div className="warn-bar" style={{ marginBottom: 20 }}>
        ⚠️ This list is maintained by @shyfts_ personally. Nomination via DM on X only. Always DYOR — this is not financial advice.
      </div>

      <div className="grid2">
        {TRUSTED.map(t => (
          <div key={t.handle} style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '16px 18px',
          }}>
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
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{t.role}</div>
            <div style={{ fontSize: 10, color: 'var(--dim)', fontStyle: 'italic', marginBottom: 10 }}>{t.note}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
              {t.tags.map(tag => <span key={tag} className={`badge ${t.badge}`}>{tag}</span>)}
            </div>
            <a href={t.x} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 9, padding: '3px 10px' }}>View on X ↗</a>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>✉️</span>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>Nominate someone</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            Think someone belongs here? DM <strong>@shyfts_</strong> on X with evidence of consistent, genuine engagement. No CT clout required — real interaction only.
          </div>
        </div>
        <a href="https://x.com/shyfts_" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>DM @shyfts_ ↗</a>
      </div>
    </div>
  );
}
