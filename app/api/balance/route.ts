import { NextRequest, NextResponse } from 'next/server';

// Route segment config — Node runtime, unique bundle to prevent Vercel EEXIST symlink dedup.
export const dynamic     = 'force-dynamic';
export const runtime     = 'edge';
const YST_MINT   = process.env.YST_MINT ?? 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? '';
const HELIUS_RPC = HELIUS_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`
  : '';

// ── In-memory per-wallet cache ────────────────────────────────
// Short TTL — balance can change after a swap, but we want to avoid hammering
// Helius on repeated gate checks during navigation.
type Entry = { balance: number; ts: number };
const cache = new Map<string, Entry>();
const CACHE_TTL = 30_000; // 30 s

// Cap the cache so a bot spraying random wallets can't blow it up.
const MAX_ENTRIES = 5_000;
function remember(wallet: string, balance: number) {
  if (cache.size >= MAX_ENTRIES) cache.clear();
  cache.set(wallet, { balance, ts: Date.now() });
}

// ── Base58 validator (Solana pubkey) ─────────────────────────────
const B58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')?.trim() ?? '';

  if (!wallet || !B58.test(wallet)) {
    return NextResponse.json(
      { error: 'Missing or invalid ?wallet= parameter', balance: 0, stale: true },
      { status: 400 }
    );
  }

  // Cache hit
  const hit = cache.get(wallet);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return NextResponse.json({ balance: hit.balance, cached: true, ts: hit.ts });
  }

  // No Helius key → fail soft so UI never breaks
  if (!HELIUS_RPC) {
    return NextResponse.json(
      { balance: 0, stale: true, note: 'HELIUS_API_KEY env var not set' },
      { status: 200 }
    );
  }

  try {
    const rpcRes = await fetch(HELIUS_RPC, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id:      'balance',
        method:  'getTokenAccountsByOwner',
        params:  [wallet, { mint: YST_MINT }, { encoding: 'jsonParsed' }],
      }),
      signal: AbortSignal.timeout(5_000),
    });

    if (!rpcRes.ok) {
      console.error('[api/balance] Helius HTTP', rpcRes.status);
      return NextResponse.json({ balance: 0, stale: true, error: 'RPC HTTP error' }, { status: 200 });
    }

    const rpcData = await rpcRes.json();
    if (rpcData.error) {
      console.error('[api/balance] RPC error:', JSON.stringify(rpcData.error));
      return NextResponse.json({ balance: 0, stale: true, error: 'RPC error' }, { status: 200 });
    }

    const accounts: Array<{
      account: { data: { parsed: { info: { tokenAmount: { uiAmount: number | null } } } } };
    }> = rpcData?.result?.value ?? [];

    let ui = 0;
    for (const acc of accounts) {
      const v = acc?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
      if (typeof v === 'number' && Number.isFinite(v)) ui += v;
    }

    const balance = Math.floor(ui);
    remember(wallet, balance);
    return NextResponse.json({ balance, ts: Date.now() });
  } catch (err) {
    console.error('[api/balance] fetch failed:', err);
    // Fail soft — UI should fall back to client-side RPC.
    return NextResponse.json({ balance: 0, stale: true, error: 'Fetch failed' }, { status: 200 });
  }
}
