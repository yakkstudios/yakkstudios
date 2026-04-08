import { NextResponse } from 'next/server';

// Route segment config
// maxDuration=10 makes this bundle's hash unique vs other routes (prevents Vercel EEXIST)
// NOTE: export const revalidate intentionally absent — invalid in App Router route handlers.
export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 10;

const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';

// ── In-memory cache ──────────────────────────────────────────────────────────
let cache: { holders: number; ts: number } | null = null;
const CACHE_TTL = 300_000; // 5 min

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ holders: cache.holders, ts: cache.ts, cached: true });
  }

  // ── Source 1: Birdeye public endpoint ────────────────────────────────────
  try {
    const birdRes = await fetch(
      `https://public-api.birdeye.so/defi/token_overview?address=${YST_MINT}`,
      {
        headers: { 'x-chain': 'solana', Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (birdRes.ok) {
      const birdData = await birdRes.json();
      const holders  = birdData?.data?.holder ?? 0;
      if (holders > 0) {
        cache = { holders, ts: Date.now() };
        return NextResponse.json({ holders, ts: Date.now() });
      }
    }
  } catch {}

  // ── Source 2: Helius RPC (if API key configured) ──────────────────────────
  const heliusKey = process.env.HELIUS_API_KEY;
  if (heliusKey) {
    try {
      const heliusRes = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0', id: 1,
            method:  'getTokenAccounts',
            params:  { mint: YST_MINT, limit: 1 },
          }),
          signal: AbortSignal.timeout(5000),
        }
      );
      if (heliusRes.ok) {
        const heliusData = await heliusRes.json();
        const total = heliusData?.result?.total ?? 0;
        if (total > 0) {
          cache = { holders: total, ts: Date.now() };
          return NextResponse.json({ holders: total, ts: Date.now() });
        }
      }
    } catch {}
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  cache = { holders: 0, ts: Date.now() };
  return NextResponse.json({
    holders: 0,
    ts: Date.now(),
    note: 'Set HELIUS_API_KEY env var for accurate holder count',
  });
}
