/**
 * /news — YAKK Studios public news page.
 *
 * This is the ONE door that stays open while the dApp is on hold
 * (SITE_PAUSED=true). It's intentionally a standalone route rather than the
 * SPA's `#section-news` slice, so it doesn't pull in the full sidebar,
 * ticker bar, or any token-gated chrome.
 *
 * When you wire articles to a real source (RSS, Ghost, a /api/news handler,
 * or the same data feeding `#section-news` inside app/page.tsx), replace
 * the `articles` array below with a fetch. The markup styles are already
 * defined in app/globals.css under `.news-*`.
 */

import Link from 'next/link';

export const dynamic = 'force-static';
export const revalidate = 300; // re-build every 5 min if wired to a feed

export const metadata = {
  title: 'News · YAKK Studios',
  description:
    'Market signals, on-chain developments, and Wren-synthesised briefings from YAKK Studios. Public read-only.',
};

type Article = {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags?: string[];
  author: string;
  sources?: string;
  date: string;
  featured?: boolean;
  href?: string;
};

// Placeholder content. Swap for real feed when ready.
const articles: Article[] = [
  {
    id: 'featured-1',
    title: 'YAKK Studios is rebuilding. Here is what stays live while we cook.',
    summary:
      'The YAKK dApp is paused for a short window while the next phase ships. Token holdings, on-chain positions, and the news feed are unaffected. A short note on what\u2019s moving under the hood.',
    category: 'Studio',
    tags: ['UPDATE', 'ROADMAP'],
    author: 'YAKK Studios',
    sources: 'Internal',
    date: 'Apr 20, 2026',
    featured: true,
  },
  {
    id: 'placeholder-2',
    title: 'Wren briefing: weekend on-chain flow snapshot',
    summary:
      'Light flow on majors, rotation into mid-caps on Solana, and a handful of anomalous wallet clusters worth watching through the week.',
    category: 'Signals',
    tags: ['WREN', 'SOLANA'],
    author: 'Wren',
    sources: '6 sources',
    date: 'Apr 19, 2026',
  },
  {
    id: 'placeholder-3',
    title: '$YST — mechanism recap for new holders',
    summary:
      'A quick primer on the token\u2019s role, why gated features exist, and how balance checks work via Helius RPC. Bookmarkable, no hype.',
    category: 'Token',
    tags: ['YST', 'PRIMER'],
    author: 'YAKK Studios',
    sources: 'Docs',
    date: 'Apr 18, 2026',
  },
];

export default function NewsPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg, #0A0A0F)',
        color: 'var(--text, #f5f5f7)',
        fontFamily: 'DM Sans, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Signature aurora wash */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(900px 500px at 15% -10%, rgba(255,46,154,0.08), transparent 60%),' +
            'radial-gradient(800px 600px at 110% 20%, rgba(192,38,255,0.06), transparent 55%),' +
            'radial-gradient(700px 400px at 50% 110%, rgba(255,204,0,0.04), transparent 60%)',
          zIndex: 0,
        }}
      />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 880,
          margin: '0 auto',
          padding: '48px 24px 72px',
        }}
      >
        {/* ── Top bar ───────────────────────────────────────────────── */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 34,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: '0.08em',
                background:
                  'linear-gradient(90deg, var(--pink-bright, #FF2E9A) 0%, var(--purple, #C026FF) 55%, var(--gold-bright, #FFCC00) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              YAKK STUDIOS
            </div>
            <div
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.22em',
                color: 'var(--dim, #444458)',
                marginTop: 2,
              }}
            >
              NEWS · PUBLIC READ
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              border: '1px solid var(--border, #1e1e2e)',
              borderRadius: 100,
              background: 'rgba(255,46,154,0.04)',
              fontFamily: 'Space Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.16em',
              color: 'var(--muted, #9a9aa2)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--pink-bright, #FF2E9A)',
                boxShadow: '0 0 10px rgba(255,46,154,0.7)',
              }}
            />
            SITE · PAUSED · NEWS LIVE
          </div>
        </header>

        {/* ── Section title ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 30 }}>
          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'var(--dim, #444458)',
              marginBottom: 10,
            }}
          >
            LATEST
          </div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            News &amp; signals.
          </h1>
          <div
            style={{
              height: 3,
              background:
                'linear-gradient(90deg, var(--pink-bright, #FF2E9A) 0%, var(--purple, #C026FF) 55%, var(--gold-bright, #FFCC00) 100%)',
              width: 64,
              borderRadius: 2,
              marginTop: 14,
              boxShadow: '0 0 16px rgba(255,46,154,0.35)',
            }}
          />
        </div>

        {/* ── Article list ──────────────────────────────────────────── */}
        <div className="news-list">
          {articles.map((a) => (
            <article
              key={a.id}
              className={`news-card ${a.featured ? 'news-card-featured' : ''}`}
            >
              <div className="news-card-top">
                <span className="news-cat-badge">{a.category}</span>
                {a.tags?.map((t) => (
                  <span key={t} className="news-tag">
                    {t}
                  </span>
                ))}
                <span className="news-meta-right">{a.date}</span>
              </div>

              <h2 className="news-card-title">{a.title}</h2>
              <p className="news-card-sub">{a.summary}</p>

              <div className="news-card-footer">
                <div>
                  <div className="news-author">{a.author}</div>
                  {a.sources && <div className="news-sources">{a.sources}</div>}
                </div>
                <span className="news-read-cta">
                  {a.href ? 'READ →' : 'MORE SOON'}
                </span>
              </div>

              {a.featured && (
                <div className="news-featured-strip">
                  Featured &middot; YAKK dApp is paused; news remains live while we rebuild.
                </div>
              )}
            </article>
          ))}
        </div>

        {/* ── Footer note ───────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 36,
            paddingTop: 20,
            borderTop: '1px solid var(--border, #1e1e2e)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            fontFamily: 'Space Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.16em',
            color: 'var(--dim, #444458)',
          }}
        >
          <div>© YAKK STUDIOS</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/paused" style={{ color: 'var(--muted, #9a9aa2)' }}>
              STATUS
            </Link>
            <a
              href="https://x.com/yakkstudios"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--muted, #9a9aa2)' }}
            >
              X / TWITTER
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
