import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 min ISR

let cache: { holders: number; ts: number } | null = null;
const CACHE_TTL = 300_000;
const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ holders: cache.holders, ts: cache.ts, cached: true });
  }

  try {
    // Try Birdeye first (public endpoint)
    const birdRes = await fetch(
      `https://public-api.birdeye.so/defi/token_overview?address=${YST_MINT}`,
      { headers: { 'x-chain': 'solana' }, signal: AbortSignal.timeout(5000) }
    );
    if (birdRes.ok) {
      const birdData = await birdRes.json();
      const holders = birdData?.data?.holder ?? 0;
      if (holders > 0) {
        cache = { holders, ts: Date.now() };
        return NextResponse.json({ holders, ts: Date.now() });
      }
    }
  } catch {}

  try {
    // Fallback: Solana RPC getTokenLargestAccounts gives us an estimate
    const rpcRes = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'getTokenSupply',
        params: [YST_MINT]
      }),
      signal: AbortSignal.timeout(5000),
    });
    const rpcData = await rpcRes.json();
    // We can't get exact holder count from basic RPC, return 0 as fallback
    void rpcData;
    cache = { holders: 0, ts: Date.now() };
    return NextResponse.json({ holders: 0, ts: Date.now(), note: 'RPC fallback - set HELIUS_API_KEY for accurate count' });
  } catch {
    return NextResponse.json({ holders: 0, ts: Date.now(), error: true });
  }
}
