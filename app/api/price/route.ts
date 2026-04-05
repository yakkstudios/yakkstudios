import { NextRequest, NextResponse } from 'next/server';

// ── Correct $YST token mint ─────────────────────────────────────────────────
const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';

// Try multiple DexScreener API formats for resilience
const DEX_ENDPOINTS = [
  `https://api.dexscreener.com/tokens/v1/solana/${YST_MINT}`,
  `https://api.dexscreener.com/latest/dex/tokens/${YST_MINT}`,
];

// NOTE: export const revalidate is intentionally removed.
// It is invalid inside App Router route handlers and causes 500 errors on Vercel.
// In-memory caching with TTL is used instead.

// ── IP-based rate limiter ──────────────────────────────────────────────────
const RATE_MAP   = new Map<string, { count: number; resetAt: number }>();
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

// ── Static fallback when all APIs fail ────────────────────────────────────
const FALLBACK_DATA = {
  symbol: 'YST',
  price: '0',
  priceNative: '0',
  change24h: 0,
  volume24h: 0,
  liquidity: 0,
  marketCap: 0,
  fdv: 0,
  pairAddress: null,
  dexUrl: `https://dexscreener.com/solana/${YST_MINT}`,
  stale: true,
};

export async function GET(req: NextRequest) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
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

  // Try each endpoint until one works
  for (const endpoint of DEX_ENDPOINTS) {
    try {
      const res = await fetchWithTimeout(endpoint);
      if (!res.ok) continue;

      const data = await res.json();
      const pairs: any[] = Array.isArray(data) ? data : (data.pairs ?? []);
      if (!pairs.length) continue;

      const pair = pairs
        .filter((p: any) => p.chainId === 'solana')
        .sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];

      if (!pair) continue;

      return NextResponse.json(
        {
          symbol:      pair.baseToken?.symbol  ?? 'YST',
          price:       pair.priceUsd           ?? '0',
          priceNative: pair.priceNative        ?? '0',
          change24h:   pair.priceChange?.h24   ?? 0,
          volume24h:   pair.volume?.h24        ?? 0,
          liquidity:   pair.liquidity?.usd     ?? 0,
          marketCap:   pair.marketCap          ?? 0,
          fdv:         pair.fdv                ?? 0,
          pairAddress: pair.pairAddress,
          dexUrl:      pair.url,
        },
        { headers: corsHeaders }
      );
    } catch (err: unknown) {
      console.warn(`[price] ${endpoint} failed:`, err instanceof Error ? err.message : err);
      continue;
    }
  }

  // All endpoints failed — return fallback so UI doesn't break
  console.error('[price] All DexScreener endpoints failed, returning fallback');
  return NextResponse.json(FALLBACK_DATA, { status: 200, headers: corsHeaders });
}
