import { NextRequest, NextResponse } from 'next/server';

// NOTE: export const revalidate is intentionally removed.
// It is invalid inside App Router route handlers and causes 500 errors on Vercel.

// ── Known Solana token mints ──────────────────────────────────────────────
const TOKENS: Record<string, { ticker: string; name: string; cat: string; emoji: string }> = {
  'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV': { ticker: 'YST',   name: 'YAKK Studios Token', cat: 'yakk',     emoji: '🩷' },
  'So11111111111111111111111111111111111111112':   { ticker: 'SOL',   name: 'Solana',              cat: 'bluechip', emoji: '◎'  },
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm':{ ticker: 'WIF',   name: 'dogwifhat',           cat: 'bluechip', emoji: '🐕' },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': { ticker: 'BONK', name: 'Bonk',               cat: 'bluechip', emoji: '🐶' },
  'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC': { ticker: 'AI16Z', name: 'ai16z',             cat: 'bluechip', emoji: '🤖' },
  // SPT_MINT_ADDRESS_TODO: replace address below with real StakePoint mint once confirmed by Grok
  // 'SPT_MINT_ADDRESS_TODO': { ticker: 'SPT', name: 'StakePoint', cat: 'yakk', emoji: '🏆' },
};

const DEX_BASE = 'https://api.dexscreener.com/tokens/v1/solana';

// ── Rate limit ────────────────────────────────────────────────────────────
const RATE_MAP   = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT  = 20;
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
      headers: { Accept: 'application/json', 'User-Agent': 'YakkStudios/1.0' },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function fmtVol(n: number): string {
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

function fmtMcap(n: number): string {
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return '$' + (n / 1_000).toFixed(0) + 'K';
  return '$' + n.toFixed(0);
}

function bestPair(pairs: any[], mintAddress: string) {
  const solPairs = pairs.filter((p: any) =>
    p.chainId === 'solana' &&
    (p.baseToken?.address?.toLowerCase() === mintAddress.toLowerCase() ||
     p.quoteToken?.address?.toLowerCase() === mintAddress.toLowerCase())
  );
  return solPairs.sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0] ?? pairs[0];
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const mints = Object.keys(TOKENS).join(',');

  let pairs: any[] = [];
  try {
    const res = await fetchWithTimeout(`${DEX_BASE}/${mints}`);
    if (res.ok) {
      const data = await res.json();
      pairs = Array.isArray(data) ? data : (data.pairs ?? []);
    }
  } catch (err: unknown) {
    console.warn('[screener] DexScreener fetch failed:', err instanceof Error ? err.message : err);
  }

  const pairsByMint: Record<string, any[]> = {};
  for (const pair of pairs) {
    const baseAddr  = pair.baseToken?.address ?? '';
    const quoteAddr = pair.quoteToken?.address ?? '';
    for (const mint of Object.keys(TOKENS)) {
      const m = mint.toLowerCase();
      if (baseAddr.toLowerCase() === m || quoteAddr.toLowerCase() === m) {
        if (!pairsByMint[mint]) pairsByMint[mint] = [];
        pairsByMint[mint].push(pair);
      }
    }
  }

  const tokens = Object.entries(TOKENS).map(([mint, meta], idx) => {
    const mintPairs = pairsByMint[mint] ?? [];
    const pair = bestPair(mintPairs, mint);

    if (!pair) {
      return {
        id: idx + 1,
        ticker: meta.ticker,
        name: meta.name,
        emoji: meta.emoji,
        cat: meta.cat,
        price: 0,
        chg: 0,
        vol: '$0',
        liq: '$0',
        mcap: '$0',
        fdv: '$0',
        txns: '0',
        buys: '0',
        sells: '0',
        holders: '—',
        dex: mint,
        isNew: false,
        updated: meta.cat === 'yakk',
        live: false,
      };
    }

    const price  = parseFloat(pair.priceUsd ?? '0') || 0;
    const chg    = pair.priceChange?.h24 ?? 0;
    const vol24  = pair.volume?.h24 ?? 0;
    const liq    = pair.liquidity?.usd ?? 0;
    const mcap   = pair.marketCap ?? 0;
    const fdv    = pair.fdv ?? 0;
    const buys   = pair.txns?.h24?.buys ?? 0;
    const sells  = pair.txns?.h24?.sells ?? 0;
    const txns   = buys + sells;
    const pairAddr = pair.pairAddress ?? mint;

    return {
      id: idx + 1,
      ticker: meta.ticker,
      name: meta.name,
      emoji: meta.emoji,
      cat: meta.cat,
      price,
      chg,
      vol: fmtVol(vol24),
      liq: fmtMcap(liq),
      mcap: fmtMcap(mcap),
      fdv: fmtMcap(fdv),
      txns: txns.toLocaleString(),
      buys: buys.toLocaleString(),
      sells: sells.toLocaleString(),
      holders: '—',
      dex: pairAddr,
      isNew: false,
      updated: meta.cat === 'yakk',
      live: true,
    };
  });

  return NextResponse.json({ tokens, ts: Date.now() });
}
