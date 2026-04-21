/**
 * /paused — YAKK Studios soft hold screen.
 *
 * Shown site-wide when SITE_PAUSED=true (see middleware.ts).
 * One door remains open to the public: /news.
 *
 * Flip back on by unsetting SITE_PAUSED (or setting it to false) and redeploying.
 */

import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata = {
  title: 'YAKK Studios · Back Soon',
  description:
    'YAKK Studios is cooking something big. The site will return to full function soon. News stays live.',
  robots: { index: false, follow: false },
};

export default function PausedPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg, #0A0A0F)',
        color: 'var(--text, #f5f5f7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'DM Sans, sans-serif',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Aurora wash (inherits brand sheet gradients) ──────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(900px 500px at 15% -10%, rgba(255,46,154,0.10), transparent 60%),' +
            'radial-gradient(800px 600px at 110% 20%, rgba(192,38,255,0.08), transparent 55%),' +
            'radial-gradient(700px 400px at 50% 110%, rgba(255,204,0,0.05), transparent 60%)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560 }}>
        {/* ── Header mark ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 32,
              letterSpacing: '0.08em',
              background:
                'linear-gradient(90deg, var(--pink-bright, #FF2E9A) 0%, var(--purple, #C026FF) 55%, var(--gold-bright, #FFCC00) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 28px rgba(255,46,154,0.35)',
              marginBottom: 10,
            }}
          >
            YAKK STUDIOS
          </div>
          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 10,
              color: 'var(--dim, #444458)',
              letterSpacing: '0.22em',
            }}
          >
            SYSTEM · REBUILDING
          </div>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg2, #0c0c14)',
            border: '1px solid var(--border, #1e1e2e)',
            borderRadius: 14,
            padding: '38px 32px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 9,
              letterSpacing: '0.3em',
              color: 'var(--pink-bright, #FF2E9A)',
              marginBottom: 14,
            }}
          >
            STATUS UPDATE · v0 → v1
          </div>

          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: '0 0 18px',
              color: 'var(--text, #f5f5f7)',
            }}
          >
            We&rsquo;re cooking{' '}
            <span
              style={{
                background:
                  'linear-gradient(90deg, var(--pink-bright, #FF2E9A), var(--gold-bright, #FFCC00))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              something big.
            </span>
          </h1>

          <p
            style={{
              color: 'var(--muted, #9a9aa2)',
              fontSize: 14,
              lineHeight: 1.7,
              margin: '0 0 22px',
            }}
          >
            YAKK Studios is offline while the team ships the next phase. No
            noise, no spoilers &mdash; just heads down building.
            <br />
            <strong style={{ color: 'var(--text, #f5f5f7)', fontWeight: 500 }}>
              The site returns to full function soon.
            </strong>
          </p>

          {/* ── YST holder card ──────────────────────────────────────── */}
          <div
            style={{
              background: 'rgba(255,204,0,0.04)',
              border: '1px solid rgba(255,204,0,0.22)',
              borderLeft: '3px solid var(--gold-bright, #FFCC00)',
              borderRadius: 8,
              padding: '14px 16px',
              textAlign: 'left',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: 'var(--gold-bright, #FFCC00)',
                marginBottom: 6,
              }}
            >
              MESSAGE TO $YST HOLDERS
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text, #f5f5f7)',
                lineHeight: 1.55,
              }}
            >
              Hold hard. We didn&rsquo;t go anywhere &mdash; we&rsquo;re just
              going bigger.{' '}
              <strong style={{ fontWeight: 500 }}>Stay strapped.</strong>
            </div>
          </div>

          {/* ── Actions ──────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/news"
              className="btn btn-pink"
              style={{ textDecoration: 'none' }}
            >
              Read the news &rarr;
            </Link>
            <a
              href="https://x.com/yakkstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ textDecoration: 'none' }}
            >
              Follow on X
            </a>
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 18,
              borderTop: '1px solid var(--border, #1e1e2e)',
              fontFamily: 'Space Mono, monospace',
              fontSize: 9,
              color: 'var(--dim, #444458)',
              letterSpacing: '0.16em',
              lineHeight: 1.7,
            }}
          >
            $YST HOLDINGS &middot; ON-CHAIN POSITIONS &middot; UNAFFECTED
          </div>
        </div>
      </div>
    </div>
  );
}
