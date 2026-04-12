import { NextRequest, NextResponse } from 'next/server';

// Route segment config
// maxDuration=15 makes this bundle's hash unique vs other routes (prevents Vercel EEXIST)
// NOTE: export const revalidate intentionally absent — invalid in App Router route handlers.
export const dynamic     = 'force-dynamic';
export const runtime     = 'edge';
const YST_MINT    = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';
const N8N_WEBHOOK = 'https://yakkstudios.app.n8n.cloud/webhook/yst-stats';
const DEX_ENDPOINTS = [
  `https://api.dexscreener.com/tokens/v1/solana/${YST_MINT}`,
  `https://api.dexscreener.com/latest/dex/tokens/${YST_MINT}`,
];

// ── In-memory cache ──────────────────────────────────────────────────────────
let cachedData: any = null;
let cachedAt        = 0;
const CACHE_TTL     = 30_000;

// ── Rate limiter ─────────────────────────────────────────────────────────────
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

async function fetchSafe(url: string, ms = 6000): Promise<Response | null> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'YakkStudios/1.0' },
      signal: controller.signal,
    });
    return res.ok ? res : null;
  } catch { return null; }
  finally { clearTimeout(timer); }
}

const FALLBACK = {
  symbol: 'YST', price: '0', priceNative: '0',
  change24h: 0, volume24h: 0, liquidity: 0,
  marketCap: 0, fdv: 0, pairAddress: null,
  dexUrl: `https://dexscreener.com/solana/${YST_MINT}`,
  source: 'fallback', stale: true,
};

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
};

export async function GET(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { ...CORS, 'Retry-After': '60' } }
    );
  }

  if (cachedData && Date.now() - cachedAt < CACHE_TTL) {
    return NextResponse.json({ ...cachedData, cached: true }, { headers: CORS });
  }

  // ── Source 1: n8n webhook ─────────────────────────────────────────────────
  try {
    const n8nRes = await fetchSafe(N8N_WEBHOOK, 3000);
    if (n8nRes) {
      const n8n = await n8nRes.json();
      if (n8n?.price) {
        const result = { ...n8n, source: 'n8n' };
        cachedData = result; cachedAt = Date.now();
        return NextResponse.json(result, { headers: CORS });
      }
    }
  } catch {
    console.warn('[stats] n8n webhook unreachable');
  }

  // ── Source 2+3: DexScreener ───────────────────────────────────────────────
  for (const endpoint of DEX_ENDPOINTS) {
    try {
      const res = await fetchSafe(endpoint);
      if (!res) continue;

      const data  = await res.json();

      // NOTE: chainId filter removed — Solana endpoint returns only Solana pairs;
      // filter causes false negatives when chainId field is absent in v1 responses.
      const pairs: any[] = Array.isArray(data)
        ? data
        : (Array.isArray(data.pairs) ? data.pairs : []);

      if (!pairs.length) continue;

      const pair = pairs
        .sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];

      if (!pair) continue;

      const result = {
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
        source:      'dexscreener',
      };

      cachedData = result; cachedAt = Date.now();
      return NextResponse.json(result, { headers: CORS });
    } catch (err: unknown) {
      console.warn(`[stats] ${endpoint} failed:`, err instanceof Error ? err.message : err);
    }
  }

  console.error('[stats] All sources failed, returning fallback');
  return NextResponse.json(FALLBACK, { status: 200, headers: CORS });
}
