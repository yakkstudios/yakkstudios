import { NextResponse } from 'next/server';

// YST token mint & known pair address on Solana
const YST_MINT = 'AhqBZEsADHGGFJQEPjAbF4RvHhpfKjaejhxFfMYFDkfz';
const DEX_API  = 'https://api.dexscreener.com';

export const revalidate = 30; // cache for 30 seconds

export async function GET() {
  try {
    const res = await fetch(
      `${DEX_API}/tokens/v1/solana/${YST_MINT}`,
      { headers: { Accept: 'application/json' }, next: { revalidate: 30 } },
    );
    if (!res.ok) return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    const data = await res.json();
    const pairs: any[] = Array.isArray(data) ? data : (data.pairs ?? []);
    if (!pairs.length) return NextResponse.json({ error: 'no_pairs' }, { status: 404 });
    const pair = pairs.filter((p: any) => p.chainId === 'solana').sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
    if (!pair) return NextResponse.json({ error: 'no_solana_pairs' }, { status: 404 });
    return NextResponse.json({
      symbol: pair.baseToken?.symbol ?? 'YST', price: pair.priceUsd ?? '0',
      priceNative: pair.priceNative ?? '0', change24h: pair.priceChange?.h24 ?? 0,
      volume24h: pair.volume?.h24 ?? 0, liquidity: pair.liquidity?.usd ?? 0,
      marketCap: pair.marketCap ?? 0, fdv: pair.fdv ?? 0,
      pairAddress: pair.pairAddress, dexUrl: pair.url,
    });
  } catch (err) {
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
