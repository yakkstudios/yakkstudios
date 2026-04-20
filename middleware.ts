import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * YAKK Studios — Middleware
 *
 * Two independent gates, evaluated in this order:
 *
 *   1. SITE HOLD  — if SITE_PAUSED=true (env var), redirect virtually all
 *                   traffic to /paused. Used for quiet maintenance windows.
 *                   Allows /paused itself, /news (public read-only while
 *                   paused), /_next, favicons, and a small set of read-only
 *                   public API routes so that anything still being
 *                   referenced externally does not 404 hard.
 *
 *   2. TOKEN GATE — $YST holder check via `yst_access` httpOnly cookie.
 *                   Cookie is issued by /api/gate-check after Helius RPC
 *                   verifies on-chain balance. TTL = 10 minutes.
 *
 * To flip the hold OFF: set SITE_PAUSED=false (or remove it) in Vercel env,
 * then redeploy. No code change required.
 */

// ── Hold config ─────────────────────────────────────────────────────────────
const SITE_PAUSED = process.env.SITE_PAUSED === 'true';

/**
 * Paths that remain reachable even when the site is paused.
 * Anything else gets redirected to /paused.
 */
const HOLD_ALLOWLIST = [
    '/paused',
    '/news',                // ← public news page stays live during the hold
    '/_next',
    '/favicon.ico',
    '/apple-icon',
    '/icon',
    '/robots.txt',
    '/sitemap.xml',
    // Keep these public endpoints alive so link previews / integrations don't break
    '/api/price',
    '/api/stats',
    // Read-only news data (if/when wired to a headless CMS feed)
    '/api/news',
  ];

function isHoldAllowlisted(pathname: string): boolean {
    return HOLD_ALLOWLIST.some(
          (p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '.'),
        );
}

// ── Token-gated paths ───────────────────────────────────────────────────────
const TOKEN_GATED = [
    '/dashboard',
    '/signals',
    '/cabal',
    '/screener',
    '/terminal',
    '/portfolio',
    '/alerts',
    '/launchpad',
    '/raffle',
    '/wallet',
  ];

function isTokenGated(pathname: string): boolean {
    return TOKEN_GATED.some(
          (p) => pathname === p || pathname.startsWith(p + '/'),
        );
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

  // 1. SITE HOLD ────────────────────────────────────────────────────────────
  if (SITE_PAUSED && !isHoldAllowlisted(pathname)) {
        const pausedUrl = new URL('/paused', req.url);
        return NextResponse.redirect(pausedUrl);
  }

  // 2. TOKEN GATE ───────────────────────────────────────────────────────────
  if (isTokenGated(pathname)) {
        const access = req.cookies.get('yst_access');
        if (!access || access.value !== 'true') {
                const lockUrl = new URL('/locked', req.url);
                lockUrl.searchParams.set('from', pathname);
                return NextResponse.redirect(lockUrl);
        }
  }

  return NextResponse.next();
}

/**
 * Run middleware on every route EXCEPT:
 *   - static assets under /_next
 *   - common static files (images, fonts)
 *
 * We intentionally do NOT narrow to just the gated routes here, because the
 * SITE_PAUSED gate needs to catch every page-level request.
 */
export const config = {
    matcher: [
          '/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|otf|mp4|webm)$).*)',
        ],
};
