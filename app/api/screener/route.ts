import { NextRequest, NextResponse } from 'next/server';

// Route segment config
// maxDuration=35 makes this bundle's hash unique vs other routes (prevents Vercel EEXIST)
// NOTE: export const revalidate intentionally absent — invalid in App Router route handlers.
export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 35;

// ── Known Solana token mints ──────────────────────────────────────────────
// YAKK trusted list only + SOL bluechip. No external tokens.
const TOKENS: Record<string, { ticker: string; name: string; cat: string; emoji: string }> = {
  'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV': { ticker: 'YST',  name: 'YAKK Studios Token', cat: 'yakk',     emoji: '🩷' },
  '6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7': { ticker: 'SPT',  name: 'StakePoint',         cat: 'yakk',     emoji: '🏆' },
  'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump': { ticker: 'LOCK', name: 'StreamLock',         cat: 'yakk',     emoji: '🔒' },
  'So11111111111111111111111111111111111111112':   { ticker: 'SOL',  name: 'Solana',              cat: 'bluechip', emoji: '◎'  },
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
  if (!Number.isFinite(n) || n <= 0) return '$0';
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

function fmtMcap(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '$0';
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

// ── YAKK Rug Risk Score ───────────────────────────────────────────────────
// Deterministic 0–100 score from available pair metrics. Higher = safer.
// No probabilistic logic — pure thresholds per the YAKK constitution.
function computeRisk(pair: any, ageDays: number) {
  if (!pair) return { score: 0, grade: '—', factors: ['no-data'] };
  const liq     = pair.liquidity?.usd ?? 0;
  const mcap    = pair.marketCap ?? 0;
  const vol24   = pair.volume?.h24 ?? 0;
  const buys24  = pair.txns?.h24?.buys ?? 0;
  const sells24 = pair.txns?.h24?.sells ?? 0;
  const total24 = buys24 + sells24;

  let score = 0;
  const factors: string[] = [];

  // Liquidity depth (35 pts)
  if (liq >= 100_000)      { score += 35; factors.push('deep-liq'); }
  else if (liq >= 25_000)  { score += 22; factors.push('mid-liq'); }
  else if (liq >= 5_000)   { score += 12; factors.push('thin-liq'); }
  else                     { factors.push('micro-liq'); }

  // MCap / liquidity ratio (25 pts) — healthy markets have mcap/liq ≤ 20
  if (liq > 0 && mcap > 0) {
    const ratio = mcap / liq;
    if (ratio <= 10)      { score += 25; factors.push('balanced'); }
    else if (ratio <= 25) { score += 15; factors.push('stretched'); }
    else if (ratio <= 60) { score += 6;  factors.push('top-heavy'); }
    else                  { factors.push('overextended'); }
  }

  // Age (15 pts)
  if (ageDays >= 30)      { score += 15; factors.push('mature'); }
  else if (ageDays >= 7)  { score += 10; factors.push('aged'); }
  else if (ageDays >= 1)  { score += 4;  factors.push('fresh'); }
  else                    { factors.push('brand-new'); }

  // Buy/sell balance (15 pts) — ratio between 0.35 and 0.65 is healthy
  if (total24 > 0) {
    const buyShare = buys24 / total24;
    if (buyShare >= 0.35 && buyShare <= 0.70) { score += 15; factors.push('two-sided'); }
    else if (buyShare >= 0.20 && buyShare <= 0.80) { score += 7; factors.push('lopsided'); }
    else { factors.push('one-sided'); }
  }

  // Activity (10 pts) — at least 50 txns in 24h
  if (total24 >= 500)      { score += 10; factors.push('active'); }
  else if (total24 >= 50)  { score += 5;  factors.push('quiet'); }
  else                     { factors.push('dormant'); }

  // Clamp
  if (score > 100) score = 100;
  if (score < 0)   score = 0;

  let grade = 'F';
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 35) grade = 'D';

  return { score, grade, factors };
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
        // Extended fields (null-safe defaults)
        priceChanges: { m5: 0, h1: 0, h6: 0, h24: 0 },
        volumes:      { m5: 0, h1: 0, h6: 0, h24: 0 },
        txnBreakdown: {
          m5:  { buys: 0, sells: 0 },
          h1:  { buys: 0, sells: 0 },
          h6:  { buys: 0, sells: 0 },
          h24: { buys: 0, sells: 0 },
        },
        raw: { liq: 0, mcap: 0, fdv: 0, vol24: 0, buys24: 0, sells24: 0 },
        pairAddress: mint,
        pairCreatedAt: 0,
        ageDays: 0,
        quoteTicker: 'SOL',
        info: { imageUrl: '', header: '', openGraph: '', websites: [], socials: [] },
        risk: { score: 0, grade: '—', factors: ['no-pair'] },
      };
    }

    const price   = parseFloat(pair.priceUsd ?? '0') || 0;
    const chg     = pair.priceChange?.h24 ?? 0;
    const vol24   = pair.volume?.h24 ?? 0;
    const liq     = pair.liquidity?.usd ?? 0;
    const mcap    = pair.marketCap ?? 0;
    const fdv     = pair.fdv ?? 0;
    const buys    = pair.txns?.h24?.buys ?? 0;
    const sells   = pair.txns?.h24?.sells ?? 0;
    const txns    = buys + sells;
    const pairAddr    = pair.pairAddress ?? mint;
    const pairCreated = pair.pairCreatedAt ?? 0;
    const ageDays     = pairCreated > 0 ? (Date.now() - pairCreated) / 86_400_000 : 0;
    const quoteTicker = pair.quoteToken?.symbol ?? 'SOL';

    const priceChanges = {
      m5:  pair.priceChange?.m5  ?? 0,
      h1:  pair.priceChange?.h1  ?? 0,
      h6:  pair.priceChange?.h6  ?? 0,
      h24: pair.priceChange?.h24 ?? 0,
    };
    const volumes = {
      m5:  pair.volume?.m5  ?? 0,
      h1:  pair.volume?.h1  ?? 0,
      h6:  pair.volume?.h6  ?? 0,
      h24: pair.volume?.h24 ?? 0,
    };
    const txnBreakdown = {
      m5:  { buys: pair.txns?.m5?.buys  ?? 0, sells: pair.txns?.m5?.sells  ?? 0 },
      h1:  { buys: pair.txns?.h1?.buys  ?? 0, sells: pair.txns?.h1?.sells  ?? 0 },
      h6:  { buys: pair.txns?.h6?.buys  ?? 0, sells: pair.txns?.h6?.sells  ?? 0 },
      h24: { buys, sells },
    };
    const info = {
      imageUrl:  pair.info?.imageUrl  ?? '',
      header:    pair.info?.header    ?? '',
      openGraph: pair.info?.openGraph ?? '',
      websites:  pair.info?.websites  ?? [],
      socials:   pair.info?.socials   ?? [],
    };
    const risk = computeRisk(pair, ageDays);

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
      isNew: ageDays > 0 && ageDays < 2,
      updated: meta.cat === 'yakk',
      live: true,
      // Extended
      priceChanges,
      volumes,
      txnBreakdown,
      raw: { liq, mcap, fdv, vol24, buys24: buys, sells24: sells },
      pairAddress: pairAddr,
      pairCreatedAt: pairCreated,
      ageDays,
      quoteTicker,
      info,
      risk,
    };
  });

  // Summary roll-up across the trusted list
  const summary = tokens.reduce(
    (acc, t) => {
      acc.totalVol24  += t.raw?.vol24  ?? 0;
      acc.totalLiq    += t.raw?.liq    ?? 0;
      acc.totalTxns24 += (t.raw?.buys24 ?? 0) + (t.raw?.sells24 ?? 0);
      return acc;
    },
    { totalVol24: 0, totalLiq: 0, totalTxns24: 0, pairsTracked: tokens.filter(t => t.live).length }
  );

  return NextResponse.json({ tokens, summary, ts: Date.now() });
}
