import { NextRequest, NextResponse } from 'next/server';

// ── App Router replacement for /api/stats (Pages Router) ─────────────────
// 3-tier fallback:
//   Tier 1 — n8n cached webhook (fast, no rate limit)
//   Tier 2 — DexScreener direct (live but rate-limited)
//   Tier 3 — Last known hardcoded values (never breaks UI)

export const revalidate = 30;

const YST_MINT   = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';
const DEX_URL    = `https://api.dexscreener.com/tokens/v1/solana/${YST_MINT}`;
const N8N_URL    = process.env.N8N_STATS_WEBHOOK ?? '';

// ── Hardcoded floor (Tier 3) — update whenever you get a chance ──────────
const FLOOR = {
  price:       '0.00000012',
  priceNative: '0.00000000082',
  change24h:   '0',
  change1h:    '0',
  change5m:    '0',
  volume24h:   '0',
  volume1h:    '0',
  liquidity:   '0',
  fdv:         '0',
  mcap:        '0',
  buys24h:     0,
  sells24h:    0,
  pairAddress: '',
  dexId:       '',
  url:         'https://dexscreener.com/solana/jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
  source:      'floor',
};

// ── Rate limit ────────────────────────────────────────────────────────────
const RATE_MAP   = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT  = 60;
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

async function fetchWithTimeout(url: string, ms = 6000): Promise<Response> {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function shapePair(pair: any, source: string) {
  return {
    price:       pair.priceUsd           ?? '0',
    priceNative: pair.priceNative        ?? '0',
    change24h:   pair.priceChange?.h24?.toString() ?? '0',
    change1h:    pair.priceChange?.h1?.toString()  ?? '0',
    change5m:    pair.priceChange?.m5?.toString()  ?? '0',
    volume24h:   pair.volume?.h24?.toString()      ?? '0',
    volume1h:    pair.volume?.h1?.toString()        ?? '0',
    liquidity:   pair.liquidity?.usd?.toString()   ?? '0',
    fdv:         pair.fdv?.toString()              ?? '0',
    mcap:        pair.marketCap?.toString()        ?? '0',
    buys24h:     pair.txns?.h24?.buys  ?? 0,
    sells24h:    pair.txns?.h24?.sells ?? 0,
    pairAddress: pair.pairAddress ?? '',
    dexId:       pair.dexId       ?? '',
    url:         pair.url         ?? '',
    ts:          Date.now(),
    source,
  };
}

// ── Tier 1: n8n cached webhook ────────────────────────────────────────────
async function tryN8N(): Promise<any | null> {
  if (!N8N_URL) return null;
  try {
    const res = await fetchWithTimeout(N8N_URL, 4000);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.price) return null;
    return { ...data, source: 'n8n', ts: Date.now() };
  } catch {
    return null;
  }
}

// ── Tier 2: DexScreener direct ────────────────────────────────────────────
async function tryDexScreener(): Promise<any | null> {
  try {
    const res = await fetchWithTimeout(DEX_URL, 8000);
    if (!res.ok) return null;
    const json = await res.json();
    const pairs: any[] = Array.isArray(json) ? json : (json.pairs ?? []);
    const pair = pairs
      .filter((p: any) => p.chainId === 'solana')
      .sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
    if (!pair) return null;
    return shapePair(pair, 'dexscreener');
  } catch {
    return null;
  }
}

// ── GET handler ───────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '60' } });
  }

  // Tier 1 — n8n
  const n8nData = await tryN8N();
  if (n8nData) return NextResponse.json(n8nData);

  // Tier 2 — DexScreener
  const dexData = await tryDexScreener();
  if (dexData) return NextResponse.json(dexData);

  // Tier 3 — floor fallback (never throws)
  return NextResponse.json({ ...FLOOR, ts: Date.now() });
}
