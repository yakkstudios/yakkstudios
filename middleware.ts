import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * YAKK Studios — Server-side token gate middleware
 *
 * Protects gated routes by checking for the `yst_access` httpOnly cookie.
 * The cookie is issued by /api/gate-check after verifying on-chain YST balance
 * via Helius RPC. Cookie TTL = 10 minutes; wallet must re-verify on expiry.
 *
 * Gated routes: /dashboard, /signals, /cabal, /screener, /terminal,
 *               /portfolio, /alerts, /launchpad, /raffle, /wallet
 *
 * Public routes (NOT gated): /, /locked, /api/*, /wren, /about, /_next
 */
export function middleware(req: NextRequest) {
  const access = req.cookies.get('yst_access');

  if (!access || access.value !== 'true') {
    const lockUrl = new URL('/locked', req.url);
    // Preserve the original path so /locked can show a "return to X" link
    lockUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(lockUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signals/:path*',
    '/cabal/:path*',
    '/screener/:path*',
    '/terminal/:path*',
    '/portfolio/:path*',
    '/alerts/:path*',
    '/launchpad/:path*',
    '/raffle/:path*',
    '/wallet/:path*',
  ],
};
