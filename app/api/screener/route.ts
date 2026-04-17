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
  'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV':  { ticker: 'YST',  name: 'YAKK Studios Token', cat: 'yakk',     emoji: '🩷' },
  '6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7': { ticker: 'SPT',  name: 'StakePoint',         cat: 'yakk',     emoji: '🏆' },
  'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump': { ticker: 'LOCK', name: 'StreamLock',         cat: 'yakk',     emoji: '🔒' },
  'So11111111111111111111111111111111111111112':    { ticker: 'SOL',  name: 'Solana',              cat: 'bluechip', emoji: '◎'  },
};

// ── GeckoTerminal API ────────────────────────────────────────────────────
// Free, no API key. 30 req/min rate limit. We fetch 4 tokens = 4 reqs per call.
const GECKO_BASE = 'https://api.geckoterminal.com/api/v2/networks/solana/tokens';

// ── In-memory cache (30s TTL per YAKK rules — never use next: { revalidate }) ─
interface CacheEntry { data: any; ts: number }
const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL = 30_000; // 30 seconds

function getCached(key: string): any | null {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { CACHE.delete(key); return null; }
  return entry.data;
}

function setCache(key: string, data: any): void {
  CACHE.set(key, { data, ts: Date.now() });
}

// ── Rate limit (per-IP, client-facing) ───────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
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

function num(v: any): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

// ── Fetch pool data from GeckoTerminal ───────────────────────────────────
// Returns the best (highest liquidity) pool for a given mint address.
async function fetchGeckoPool(mint: string): Promise<any | null> {
  // Check cache first
  const cached = getCached(`gecko_${mint}`);
  if (cached) return cached;

  try {
    const res = await fetchWithTimeout(`${GECKO_BASE}/${mint}/pools?page=1`);
    if (!res.ok) {
      console.warn(`[screener] GeckoTerminal ${res.status} for ${mint}`);
      return null;
    }
    const json = await res.json();
    const pools = json.data ?? [];
    if (pools.length === 0) return null;

    // Pick the pool with deepest liquidity (reserve_in_usd)
    const best = pools.sort(
      (a: any, b: any) => num(b.attributes?.reserve_in_usd) - num(a.attributes?.reserve_in_usd)
    )[0];

    setCache(`gecko_${mint}`, best);
    return best;
  } catch (err: unknown) {
    console.warn('[screener] GeckoTerminal fetch failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

// ── YAKK Rug Risk Score ───────────────────────────────────────────────────
// Deterministic 0–100 score from available pair metrics. Higher = safer.
// No probabilistic logic — pure thresholds per the YAKK constitution.
function computeRisk(metrics: { liq: number; mcap: number; vol24: number; buys24: number; sells24: number }, ageDays: number) {
  const { liq, mcap, buys24, sells24 } = metrics;
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

// ── Null-safe default token (when pool fetch fails) ──────────────────────
function emptyToken(idx: number, mint: string, meta: { ticker: string; name: string; cat: string; emoji: string }) {
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

// ── GET handler ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Check if entire response is cached
  const cachedResponse = getCached('screener_full');
  if (cachedResponse) {
    return NextResponse.json(cachedResponse);
  }

  // Fetch all tokens in parallel (4 concurrent requests, well within 30/min)
  const entries = Object.entries(TOKENS);
  const poolResults = await Promise.allSettled(
    entries.map(([mint]) => fetchGeckoPool(mint))
  );

  const tokens = entries.map(([mint, meta], idx) => {
    const result = poolResults[idx];
    const pool = result.status === 'fulfilled' ? result.value : null;

    if (!pool) return emptyToken(idx, mint, meta);

    const attr = pool.attributes ?? {};

    // ── Extract pair address from GeckoTerminal pool ID ──
    // Format: "solana_{pair_address}"
    const poolId: string = pool.id ?? '';
    const pairAddr = poolId.includes('_') ? poolId.split('_').slice(1).join('_') : mint;

    // ── Core metrics ──
    const price = num(attr.base_token_price_usd);
    const liq   = num(attr.reserve_in_usd);
    const mcap  = num(attr.market_cap_usd);
    const fdv   = num(attr.fdv_usd);

    // ── Price changes (%) ──
    const pc = attr.price_change_percentage ?? {};
    const priceChanges = {
      m5:  num(pc.m5),
      h1:  num(pc.h1),
      h6:  num(pc.h6),
      h24: num(pc.h24),
    };
    const chg = priceChanges.h24;

    // ── Volumes ──
    const vol = attr.volume_usd ?? {};
    const volumes = {
      m5:  num(vol.m5),
      h1:  num(vol.h1),
      h6:  num(vol.h6),
      h24: num(vol.h24),
    };
    const vol24 = volumes.h24;

    // ── Transactions ──
    const txn = attr.transactions ?? {};
    const txnBreakdown = {
      m5:  { buys: txn.m5?.buys  ?? 0, sells: txn.m5?.sells  ?? 0 },
      h1:  { buys: txn.h1?.buys  ?? 0, sells: txn.h1?.sells  ?? 0 },
      h6:  { buys: txn.h6?.buys  ?? 0, sells: txn.h6?.sells  ?? 0 },
      h24: { buys: txn.h24?.buys ?? 0, sells: txn.h24?.sells ?? 0 },
    };
    const buys24  = txnBreakdown.h24.buys;
    const sells24 = txnBreakdown.h24.sells;
    const total24 = buys24 + sells24;

    // ── Pool age ──
    const poolCreated = attr.pool_created_at ? new Date(attr.pool_created_at).getTime() : 0;
    const ageDays     = poolCreated > 0 ? (Date.now() - poolCreated) / 86_400_000 : 0;

    // ── Quote token ticker (extract from pool name, e.g. "LOCK / SOL") ──
    const poolName: string = attr.name ?? '';
    const quoteTicker = poolName.includes('/') ? poolName.split('/').pop()?.trim() ?? 'SOL' : 'SOL';

    // ── Risk score ──
    const risk = computeRisk({ liq, mcap, vol24, buys24, sells24 }, ageDays);

    // ── Info (local static files per YAKK rule — never fetch from API) ──
    const info = { imageUrl: '', header: '', openGraph: '', websites: [], socials: [] };

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
      txns: total24.toLocaleString(),
      buys: buys24.toLocaleString(),
      sells: sells24.toLocaleString(),
      holders: '—',
      dex: pairAddr,
      isNew: ageDays > 0 && ageDays < 2,
      updated: meta.cat === 'yakk',
      live: true,
      priceChanges,
      volumes,
      txnBreakdown,
      raw: { liq, mcap, fdv, vol24, buys24, sells24 },
      pairAddress: pairAddr,
      pairCreatedAt: poolCreated,
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

  const response = { tokens, summary, ts: Date.now() };

  // Cache the full response for 30s
  setCache('screener_full', response);

  return NextResponse.json(response);
}
