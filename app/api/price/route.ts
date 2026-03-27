import { NextRequest, NextResponse } from 'next/server';

// ── Constants ──────────────────────────────────────────────────────────────
const YST_MINT = 'AhqBZEsADHGGFJQEPjAbF4RvHhpfKjaejhxFfMYFDkfz';
const DEX_API  = 'https://api.dexscreener.com';

// Cache for 30 s at the CDN/ISR layer
export const revalidate = 30;

// ── Simple IP-based rate limiter ───────────────────────────────────────────
const RATE_MAP   = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT  = 30;      // 30 price polls per minute is plenty
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

// ── Upstream fetch with timeout ────────────────────────────────────────────
async function fetchWithTimeout(url: string, ms = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(req: NextRequest) {
  // Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const res = await fetchWithTimeout(
      `${DEX_API}/tokens/v1/solana/${YST_MINT}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }

    const data = await res.json();
    const pairs: any[] = Array.isArray(data) ? data : (data.pairs ?? []);

    if (!pairs.length) {
      return NextResponse.json({ error: 'no_pairs' }, { status: 404 });
    }

    const pair = pairs
      .filter((p: any) => p.chainId === 'solana')
      .sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];

    if (!pair) {
      return NextResponse.json({ error: 'no_solana_pairs' }, { status: 404 });
    }

    // Only return the fields the client actually needs (minimise data surface)
    return NextResponse.json({
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
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'internal';
    // Don't leak internal error details to the client
    console.error('[price] upstream fetch failed:', msg);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
      }
