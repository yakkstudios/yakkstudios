'use client';

interface Article {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  stats: { val: string; lbl: string; color?: string }[];
  isNew?: boolean;
}

const ARTICLES: Article[] = [
  {
    slug: 'pump-expose',
    label: 'ON-CHAIN FORENSICS',
    title: '$PUMP: The $4B Extraction Machine',
    subtitle:
      '1.23 million on-chain transfers. 2 hub wallets. $4B+ distributed before retail ever touched the bonding curve. The $YST Cabal traces every transaction.',
    date: 'APR 2026',
    isNew: true,
    tags: ['$PUMP', 'HUB WALLETS', 'EXTRACTION', 'DEEP DIVE'],
    stats: [
      { val: '$4B+',   lbl: 'TOTAL EXTRACTED',   color: '#ff3a5c' },
      { val: '1.23M',  lbl: 'ON-CHAIN TRANSFERS', color: '#f7c948' },
      { val: '$1.63B', lbl: 'SILENT OVERHANG',    color: '#ff9900' },
      { val: '2',      lbl: 'HUB WALLETS',         color: '#e0607e' },
    ],
  },
  {
    slug: 'kol-expose',
    label: 'KOL INVESTIGATION',
    title: 'KOL Exposé: 39 Influencers, $3.98B+ Extraction Floor',
    subtitle:
      '39 KOL wallets. 113+ dev wallets blacklisted. 11 tokens investigated. The full on-chain breakdown of who got paid and how.',
    date: 'MAR 2026',
    tags: ['KOL', 'SHILL WALLETS', 'DEV WALLETS', 'TIER LIST'],
    stats: [
      { val: '39',      lbl: 'KOL WALLETS',         color: '#ff3a5c' },
      { val: '$3.98B+', lbl: 'EXTRACTION FLOOR',    color: '#ff3a5c' },
      { val: '113+',    lbl: 'DEV WALLETS FLAGGED', color: '#ff9900' },
      { val: '11',      lbl: 'TOKENS INVESTIGATED', color: '#f7c948' },
    ],
  },
];

export default function News() {
  return (
    <div className="sec-pad">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="sec-header">
        <div className="sec-bar" />
        <div className="sec-title">📰 YAKK NEWS</div>
        <div className="sec-sub">
          Investigations, forensics and intel drops from the $YST Cabal.
          All data publicly verifiable on-chain at{' '}
          <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)' }}>
            Solscan
          </a>.
        </div>
      </div>

      {/* ── Article list ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ARTICLES.map((a) => (
          <a
            key={a.slug}
            href={`/news/${a.slug}.html`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: '#0d0d0d',
                border: '1px solid #1e1e1e',
                borderLeft: '3px solid var(--pink)',
                borderRadius: 8,
                padding: '18px 20px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = '#111';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = '#0d0d0d';
              }}
            >
              {/* NEW badge */}
              {a.isNew && (
                <div style={{
                  position: 'absolute', top: 12, right: 14,
                  fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  color: '#00c896', background: 'rgba(0,200,150,0.1)',
                  border: '1px solid rgba(0,200,150,0.3)', borderRadius: 3,
                  padding: '2px 7px',
                }}>
                  NEW
                </div>
              )}

              {/* Eyebrow row */}
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 2,
                color: 'var(--pink)', textTransform: 'uppercase',
                fontFamily: 'monospace', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  width: 14, height: 1,
                  background: 'var(--pink)', display: 'inline-block',
                }} />
                {a.label}
                <span style={{ marginLeft: 'auto', color: '#444', fontWeight: 400 }}>
                  {a.date}
                </span>
              </div>

              {/* Title */}
              <div style={{
                fontSize: 16, fontWeight: 700,
                color: '#f5f5f7', marginBottom: 6, lineHeight: 1.3,
              }}>
                {a.title}
              </div>

              {/* Subtitle */}
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6, marginBottom: 14 }}>
                {a.subtitle}
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {a.stats.map((s) => (
                  <div key={s.lbl} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #1a1a1a',
                    borderRadius: 4,
                    padding: '6px 10px',
                  }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: s.color ?? 'var(--pink)',
                      fontFamily: 'monospace',
                    }}>
                      {s.val}
                    </div>
                    <div style={{
                      fontSize: 9, color: '#444',
                      letterSpacing: 1, textTransform: 'uppercase', marginTop: 2,
                    }}>
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags + CTA */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {a.tags.map((t) => (
                    <span key={t} style={{
                      fontSize: 9, color: '#444', background: '#111',
                      border: '1px solid #1e1e1e', borderRadius: 3,
                      padding: '2px 7px', fontFamily: 'monospace', letterSpacing: 0.5,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
                <span style={{
                  fontSize: 10, color: 'var(--pink)',
                  fontWeight: 700, letterSpacing: 0.5,
                }}>
                  READ FULL REPORT ↗
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ── Disclaimer ──────────────────────────────────────────────── */}
      <div style={{
        marginTop: 20, padding: '10px 14px',
        background: 'rgba(255,153,0,0.04)',
        border: '1px solid rgba(255,153,0,0.12)',
        borderRadius: 6, fontSize: 10, color: '#555', lineHeight: 1.7,
      }}>
        All on-chain data publicly verifiable at Solscan.io. Patterns do not constitute proof of wrongdoing.
        Reports are for community awareness only. Not financial or legal advice.
      </div>
    </div>
  );
}
