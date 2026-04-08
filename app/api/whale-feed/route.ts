import { NextRequest, NextResponse } from 'next/server';

// Route segment config
// maxDuration=30 makes this bundle's hash unique vs other routes (prevents Vercel EEXIST)
// NOTE: export const revalidate intentionally absent — invalid in App Router route handlers.
export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 30;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

// ── Whale threshold ──────────────────────────────────────────────────────────
const WHALE_USD_THRESHOLD = 10_000; // trades ≥ $10k shown

// ── In-memory cache ──────────────────────────────────────────────────────────
let cache: { trades: any[]; ts: number } | null = null;
const CACHE_TTL = 30_000; // 30s

// Pair addresses to monitor for whale activity
const WATCHED_PAIRS = [
  { symbol: 'YST',  pair: '' },   // YST pair addr — filled from /api/price if needed
  { symbol: 'SOL',  pair: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj' },
];

async function fetchTrades(pairAddr: string): Promise<any[]> {
  if (!pairAddr) return [];
  try {
    const r = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/solana/${pairAddr}`,
      { signal: AbortSignal.timeout(5000), headers: { Accept: 'application/json' } }
    );
    if (!r.ok) return [];
    const j  = await r.json();
    const tx = j?.pair?.txns?.h24 ?? {};
    // DexScreener aggregate data — return a summary trade object
    return [{
      pair:   pairAddr,
      buys:   tx.buys  ?? 0,
      sells:  tx.sells ?? 0,
      vol24h: j?.pair?.volume?.h24 ?? 0,
      price:  j?.pair?.priceUsd   ?? '0',
      liq:    j?.pair?.liquidity?.usd ?? 0,
    }];
  } catch { return []; }
}

export async function GET(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS });
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ trades: cache.trades, cached: true, ts: cache.ts }, { headers: CORS });
  }

  try {
    const results = await Promise.allSettled(
      WATCHED_PAIRS
        .filter(p => p.pair)
        .map(p => fetchTrades(p.pair))
    );

    const trades = results
      .flatMap(r => (r.status === 'fulfilled' ? r.value : []))
      .filter(t => (t.vol24h ?? 0) >= WHALE_USD_THRESHOLD);

    cache = { trades, ts: Date.now() };
    return NextResponse.json({ trades, ts: Date.now() }, { headers: CORS });
  } catch (err: unknown) {
    console.error('[whale-feed] fetch error:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { trades: cache?.trades ?? [], ts: Date.now(), stale: true },
      { headers: CORS }
    );
  }
}
