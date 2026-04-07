import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const _ROUTE = 'ticker' as const; // unique bundle id

// NOTE: export const revalidate is intentionally absent — invalid in App Router route handlers.
// In-memory TTL caching used instead.

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export interface TickerItem {
  symbol: string;
  price: string;
  change24h: number;
}

// ── Token registry ─────────────────────────────────────────────────────────────
// StreamLock ($LOCK): confirmed CA from archive
// StakePoint ($SPT): confirmed pair address from archive (mint TBC — update when confirmed by Grok)
// SOL: Raydium SOL/USDC pair
const MINT_TOKENS = [
  { symbol: 'YST',  mint: 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV' },
  { symbol: 'LOCK', mint: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump' },
];

const PAIR_TOKENS = [
  { symbol: 'SPT', pair: 'A1d4sAmgi4Njnodmc289HP7TaPxw54n4Ey3LRDfrBvo5' }, // StakePoint pair
  { symbol: 'SOL', pair: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj' }, // SOL/USDC Raydium
];

// ── In-memory cache ─────────────────────────────────────────────────────────────
let cachedTicker: TickerItem[] | null = null;
let cachedAt = 0;
const TTL = 30_000; // 30s

// ── Fetchers ───────────────────────────────────────────────────────────────────
async function fetchByMint(symbol: string, mint: string): Promise<TickerItem | null> {
  const urls = [
    `https://api.dexscreener.com/tokens/v1/solana/${mint}`,
    `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(5000) });
      if (!r.ok) continue;
      const j = await r.json();
      const arr: any[] = Array.isArray(j) ? j : (Array.isArray(j.pairs) ? j.pairs : []);
      if (!arr.length) continue;
      // Pick the highest-liquidity pair
      const pair = arr.sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
      return {
        symbol,
        price: pair.priceUsd ?? '0',
        change24h: pair.priceChange?.h24 ?? 0,
      };
    } catch { /* continue */ }
  }
  return null;
}

async function fetchByPair(symbol: string, pairAddr: string): Promise<TickerItem | null> {
  try {
    const r = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${pairAddr}`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const pair = j.pair;
    if (!pair) return null;
    return {
      symbol,
      price: pair.priceUsd ?? '0',
      change24h: pair.priceChange?.h24 ?? 0,
    };
  } catch {
    return null;
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function GET() {
  const now = Date.now();

  // Serve from cache if fresh
  if (cachedTicker && now - cachedAt < TTL) {
    return NextResponse.json(cachedTicker, { headers: HEADERS });
  }

  try {
    const [mintResults, pairResults] = await Promise.all([
      Promise.allSettled(MINT_TOKENS.map(t => fetchByMint(t.symbol, t.mint))),
      Promise.allSettled(PAIR_TOKENS.map(t => fetchByPair(t.symbol, t.pair))),
    ]);

    const items: TickerItem[] = [...mintResults, ...pairResults]
      .map(r => (r.status === 'fulfilled' ? r.value : null))
      .filter((x): x is TickerItem => x !== null);

    // If we got at least one result, update cache
    if (items.length > 0) {
      cachedTicker = items;
      cachedAt = now;
    }

    // Always return 200 — stale data beats broken UI
    return NextResponse.json(items.length > 0 ? items : (cachedTicker ?? []), { headers: HEADERS });
  } catch {
    // Total failure — return stale or empty
    return NextResponse.json(cachedTicker ?? [], { headers: HEADERS });
  }
}
