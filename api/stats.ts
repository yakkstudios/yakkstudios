import type { NextApiRequest, NextApiResponse } from 'next';

const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';
const DEX_URL = `https://api.dexscreener.com/latest/dex/tokens/${YST_MINT}`;

// Cache: store last fetch + timestamp
let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 60_000; // 60s

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return res.status(200).json(cache.data);
  }

  try {
    const r = await fetch(DEX_URL, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`DexScreener ${r.status}`);
    const json = await r.json();

    // Find the best liquidity pair
    const pairs = json.pairs || [];
    const pair = pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];

    if (!pair) {
      return res.status(200).json({ price: '0', change24h: '0', volume24h: '0', liquidity: '0', fdv: '0', mcap: '0', buys24h: 0, sells24h: 0, holders: 0, ts: Date.now() });
    }

    const data = {
      price: pair.priceUsd || '0',
      priceNative: pair.priceNative || '0',
      change24h: pair.priceChange?.h24?.toString() || '0',
      change1h: pair.priceChange?.h1?.toString() || '0',
      change5m: pair.priceChange?.m5?.toString() || '0',
      volume24h: pair.volume?.h24?.toString() || '0',
      volume1h: pair.volume?.h1?.toString() || '0',
      liquidity: pair.liquidity?.usd?.toString() || '0',
      fdv: pair.fdv?.toString() || '0',
      mcap: pair.marketCap?.toString() || '0',
      buys24h: pair.txns?.h24?.buys || 0,
      sells24h: pair.txns?.h24?.sells || 0,
      pairAddress: pair.pairAddress || '',
      dexId: pair.dexId || '',
      url: pair.url || '',
      ts: Date.now(),
    };

    cache = { data, ts: Date.now() };
    return res.status(200).json(data);
  } catch (err: any) {
    // Return stale cache if available
    if (cache) return res.status(200).json({ ...cache.data, stale: true });
    return res.status(502).json({ error: 'Failed to fetch price data', message: err.message });
  }
}
