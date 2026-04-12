import { NextRequest, NextResponse } from 'next/server';

// Route segment config
// maxDuration=20 makes this bundle's hash unique vs other routes (prevents Vercel EEXIST)
// NOTE: export const revalidate is intentionally absent — invalid in App Router route
// handlers and causes 500 errors on Vercel. In-memory caching used instead.
export const dynamic     = 'force-dynamic';
export const runtime     = 'edge';
const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';

const DEX_ENDPOINTS = [
  `https://api.dexscreener.com/tokens/v1/solana/${YST_MINT}`,
  `https://api.dexscreener.com/latest/dex/tokens/${YST_MINT}`,
];

// ── IP-based rate limiter ──────────────────────────────────────────────────
const RATE_MAP    = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT  = 30;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = RATE_MAP.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_MAP.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'YakkStudios/1.0' },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

const FALLBACK_DATA = {
  symbol: 'YST', price: '0', priceNative: '0',
  change24h: 0, volume24h: 0, liquidity: 0,
  marketCap: 0, fdv: 0, pairAddress: null,
  dexUrl: `https://dexscreener.com/solana/${YST_MINT}`,
  stale: true,
};

export async function GET(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
  };

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { ...corsHeaders, 'Retry-After': '60' } }
    );
  }

  for (const endpoint of DEX_ENDPOINTS) {
    try {
      const res = await fetchWithTimeout(endpoint);
      if (!res.ok) continue;

      const data = await res.json();

      // NOTE: chainId filter intentionally removed — Solana-specific endpoint already
      // returns only Solana pairs; filtering on chainId wipes results when the field
      // is absent from v1 responses. Matches the working ticker route pattern.
      const pairs: any[] = Array.isArray(data)
        ? data
        : (Array.isArray(data.pairs) ? data.pairs : []);

      if (!pairs.length) continue;

      const pair = pairs
        .sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];

      if (!pair) continue;

      return NextResponse.json(
        {
          symbol:      pair.baseToken?.symbol ?? 'YST',
          price:       pair.priceUsd          ?? '0',
          priceNative: pair.priceNative       ?? '0',
          change24h:   pair.priceChange?.h24  ?? 0,
          volume24h:   pair.volume?.h24       ?? 0,
          liquidity:   pair.liquidity?.usd    ?? 0,
          marketCap:   pair.marketCap         ?? 0,
          fdv:         pair.fdv               ?? 0,
          pairAddress: pair.pairAddress,
          dexUrl:      pair.url,
        },
        { headers: corsHeaders }
      );
    } catch (err: unknown) {
      console.warn(`[price] ${endpoint} failed:`, err instanceof Error ? err.message : err);
    }
  }

  console.error('[price] All DexScreener endpoints failed, returning fallback');
  return NextResponse.json(FALLBACK_DATA, { status: 200, headers: corsHeaders });
}
