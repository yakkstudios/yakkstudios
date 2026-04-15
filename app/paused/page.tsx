/**
 * /paused — YAKK Studios soft hold screen.
 *
 * Shown site-wide when SITE_PAUSED=true (see middleware.ts). Deliberately
 * vague — no mention of what's being built, no timelines, no figures.
 *
 * Flip back on by unsetting SITE_PAUSED (or setting it to false) and redeploying.
 */

export const dynamic = 'force-static';

export default function PausedPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg, #050509)',
        color: 'var(--text, #f5f5f7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'Syne, sans-serif',
        textAlign: 'center',
      }}
    >
      {/* ── Header mark ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: '0.08em',
            background:
              'linear-gradient(135deg, var(--pink, #e0607e), var(--gold, #f7c948))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 10,
          }}
        >
          YAKK STUDIOS
        </div>
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10,
            color: 'var(--dim, #6b6b76)',
            letterSpacing: '0.22em',
          }}
        >
          BACK SHORTLY
        </div>
      </div>

      {/* ── Card ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg2, #0c0c14)',
          border: '1px solid var(--border, #1f1f2a)',
          borderRadius: 14,
          padding: '40px 34px',
          maxWidth: 520,
          width: '100%',
        }}
      >
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 22,
            margin: '0 0 16px',
            color: 'var(--gold, #f7c948)',
            letterSpacing: '0.02em',
          }}
        >
          Temporarily offline
        </h1>

        <p
          style={{
            color: 'var(--muted, #a8a8b4)',
            fontSize: 14,
            lineHeight: 1.75,
            margin: '0 0 22px',
          }}
        >
          YAKK Studios is taking a short pause while we work on a few things
          behind the scenes. The tools and holder portal will be back soon.
        </p>

        <p
          style={{
            color: 'var(--dim, #6b6b76)',
            fontSize: 12,
            lineHeight: 1.7,
            margin: '0 0 28px',
          }}
        >
          $YST holdings and on-chain positions are unaffected.
          <br />
          Nothing about the token changes during this pause.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="https://x.com/yakkstudios"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
            style={{ textDecoration: 'none' }}
          >
            Follow on X &rarr;
          </a>
        </div>

        <div
          style={{
            marginTop: 30,
            paddingTop: 18,
            borderTop: '1px solid var(--border, #1f1f2a)',
            fontFamily: 'Space Mono, monospace',
            fontSize: 9,
            color: 'var(--dim, #6b6b76)',
            letterSpacing: '0.14em',
            lineHeight: 1.7,
          }}
        >
          THANK YOU FOR YOUR PATIENCE
        </div>
      </div>
    </div>
  );
}
