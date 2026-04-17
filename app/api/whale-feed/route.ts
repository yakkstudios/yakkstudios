import { NextRequest, NextResponse } from 'next/server';

// Route segment config
// maxDuration=30 makes this bundle's hash unique vs other routes (prevents Vercel EEXIST)
// NOTE: export const revalidate intentionally absent — invalid in App Router route handlers.
export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 30;

// ── Token mints (same as /api/screener) ──────────────────────────────────────
const WATCHED_TOKENS: Record<string, string> = {
  YST:  'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
  SPT:  '6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7',
  LOCK: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump',
  SOL:  'So11111111111111111111111111111111111111112',
};

// ── GeckoTerminal API ────────────────────────────────────────────────────────
const GECKO_BASE = 'https://api.geckoterminal.com/api/v2/networks/solana/tokens';

// ── In-memory cache ──────────────────────────────────────────────────────────
let cache: { trades: any[]; ts: number } | null = null;
const CACHE_TTL = 30_000; // 30s

// ── Whale threshold ──────────────────────────────────────────────────────────
const WHALE_USD_THRESHOLD = 10_000; // trades ≥ $10k shown

function num(v: any): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

async function fetchTokenActivity(symbol: string, mint: string): Promise<any | null> {
  try {
    const res = await fetch(`${GECKO_BASE}/${mint}/pools?page=1`, {
      headers: { Accept: 'application/json', 'User-Agent': 'YakkStudios/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const pools = json.data ?? [];
    if (pools.length === 0) return null;

    // Pick deepest-liquidity pool
    const best = pools.sort(
      (a: any, b: any) => num(b.attributes?.reserve_in_usd) - num(a.attributes?.reserve_in_usd)
    )[0];

    const attr = best.attributes ?? {};
    const txn = attr.transactions?.h24 ?? {};
    const vol = attr.volume_usd ?? {};

    return {
      symbol,
      pair: best.id?.split('_').slice(1).join('_') ?? mint,
      buys:   txn.buys  ?? 0,
      sells:  txn.sells ?? 0,
      vol24h: num(vol.h24),
      price:  num(attr.base_token_price_usd),
      liq:    num(attr.reserve_in_usd),
      chg24:  num(attr.price_change_percentage?.h24),
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204 });
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ trades: cache.trades, cached: true, ts: cache.ts });
  }

  try {
    const results = await Promise.allSettled(
      Object.entries(WATCHED_TOKENS).map(([sym, mint]) => fetchTokenActivity(sym, mint))
    );

    const trades = results
      .map(r => (r.status === 'fulfilled' ? r.value : null))
      .filter((t): t is NonNullable<typeof t> => t !== null && (t.vol24h ?? 0) >= WHALE_USD_THRESHOLD);

    cache = { trades, ts: Date.now() };
    return NextResponse.json({ trades, ts: Date.now() });
  } catch (err: unknown) {
    console.error('[whale-feed] fetch error:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { trades: cache?.trades ?? [], ts: Date.now(), stale: true },
    );
  }
}
