import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

// ── Config ────────────────────────────────────────────────────────────────────
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
const YST_MINT  = process.env.YST_MINT ?? 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';

// Dev wallets: bypass balance check, always granted WHALE tier
const DEV_WALLETS = new Set<string>(
  (process.env.DEV_WALLETS ?? '7CsMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
);

// ── Access tiers (display units — uiAmount from Helius) ───────────────────────
const TIERS = [
  { name: 'WHALE',  min: 10_000_000 },
  { name: 'HOLDER', min:    250_000 },
] as const;

type TierName = 'WHALE' | 'HOLDER' | 'NONE';

function getTier(uiBalance: number): TierName {
  for (const t of TIERS) {
    if (uiBalance >= t.min) return t.name;
  }
  return 'NONE';
}

// ── Rate limiting: 10 req / 60s per wallet ────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const e = rateLimitMap.get(key);
  if (!e || now > e.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (e.count >= 10) return true;
  e.count++;
  return false;
}

// ── Nonce replay protection (2-min sliding window) ────────────────────────────
const usedNonces = new Set<string>();

function validateNonce(nonce: string, timestamp: number): boolean {
  const now = Date.now();
  if (typeof timestamp !== 'number' || now - timestamp > 120_000) return false;
  if (usedNonces.has(nonce)) return false;
  usedNonces.add(nonce);
  // Prevent unbounded memory growth
  if (usedNonces.size > 10_000) usedNonces.clear();
  return true;
}

// ── Ed25519 signature verification ────────────────────────────────────────────
// Uses tweetnacl for crypto + @solana/web3.js PublicKey for base58 decoding
function verifySignature(message: string, signatureBase64: string, pubKeyStr: string): boolean {
  try {
    const msgBytes = new TextEncoder().encode(message);
    const sigBytes = Buffer.from(signatureBase64, 'base64');
    const pubBytes = new PublicKey(pubKeyStr).toBytes();
    return nacl.sign.detached.verify(
      msgBytes,
      new Uint8Array(sigBytes),
      pubBytes
    );
  } catch {
    return false;
  }
}

// ── Cookie helper ─────────────────────────────────────────────────────────────
function setCookies(res: NextResponse, tier: TierName): void {
  const prod = process.env.NODE_ENV === 'production';
  const ttl  = 60 * 60; // 1 hour

  // httpOnly — cannot be read by JS, protects against XSS token theft
  res.cookies.set('yst_access', 'true', {
    httpOnly: true,
    secure:   prod,
    sameSite: 'lax',
    maxAge:   ttl,
    path:     '/',
  });

  // Non-httpOnly — readable by client for UI personalisation (tier badge, etc.)
  res.cookies.set('yst_tier', tier, {
    httpOnly: false,
    secure:   prod,
    sameSite: 'lax',
    maxAge:   ttl,
    path:     '/',
  });
}

// ── POST /api/gate-check ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

    const { publicKey, message, signature, nonce, timestamp } = body;

    // ── 1. Validate wallet address ──────────────────────────────────────────
    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json({ error: 'Missing publicKey' }, { status: 400 });
    }
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(publicKey)) {
      return NextResponse.json({ error: 'Invalid Solana address format' }, { status: 400 });
    }

    // ── 2. Rate limit ───────────────────────────────────────────────────────
    if (isRateLimited(publicKey)) {
      return NextResponse.json({ error: 'Too many requests — wait 60s' }, { status: 429 });
    }

    // ── 3. Dev wallet bypass ────────────────────────────────────────────────
    if (DEV_WALLETS.has(publicKey)) {
      const res = NextResponse.json(
        { access: true, tier: 'WHALE' as TierName, balance: 10_000_000 },
        { status: 200 }
      );
      setCookies(res, 'WHALE');
      return res;
    }

    // ── 4. Require signature proof for all non-dev wallets ──────────────────
    if (!message || !signature || !nonce || timestamp === undefined) {
      return NextResponse.json(
        { error: 'Signature proof required: supply message, signature, nonce, timestamp' },
        { status: 400 }
      );
    }
    if (
      typeof message   !== 'string' ||
      typeof signature !== 'string' ||
      typeof nonce     !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid signature payload types' }, { status: 400 });
    }

    // ── 5. Replay protection ────────────────────────────────────────────────
    if (!validateNonce(nonce, Number(timestamp))) {
      return NextResponse.json(
        { error: 'Expired or replayed nonce — re-sign and retry' },
        { status: 400 }
      );
    }

    // ── 6. Verify message format ────────────────────────────────────────────
    const expectedMsg = `YAKK_ACCESS:${publicKey}:${nonce}:${timestamp}`;
    if (message !== expectedMsg) {
      return NextResponse.json({ error: 'Message format mismatch' }, { status: 400 });
    }

    // ── 7. Verify ed25519 signature ─────────────────────────────────────────
    if (!verifySignature(message, signature, publicKey)) {
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }

    // ── 8. Fetch $YST balance via Helius ────────────────────────────────────
    const rpcRes = await fetch(HELIUS_RPC, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id:      '1',
        method:  'getTokenAccountsByOwner',
        params:  [publicKey, { mint: YST_MINT }, { encoding: 'jsonParsed' }],
      }),
    });

    if (!rpcRes.ok) {
      console.error('[gate-check] Helius HTTP error:', rpcRes.status);
      return NextResponse.json({ error: 'RPC unavailable — try again shortly' }, { status: 503 });
    }

    const rpcData = await rpcRes.json();

    if (rpcData.error) {
      console.error('[gate-check] RPC error:', JSON.stringify(rpcData.error));
      return NextResponse.json({ error: 'RPC error' }, { status: 503 });
    }

    // uiAmount already has decimals applied — matches our TIERS thresholds directly
    const accounts: Array<{
      account: { data: { parsed: { info: { tokenAmount: { uiAmount: number } } } } };
    }> = rpcData?.result?.value ?? [];

    let uiBalance = 0;
    for (const acc of accounts) {
      const ui = acc?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
      if (ui) uiBalance += Number(ui);
    }

    // ── 9. Tier check ───────────────────────────────────────────────────────
    const tier = getTier(uiBalance);

    if (tier === 'NONE') {
      return NextResponse.json(
        { access: false, tier: 'NONE', balance: uiBalance, required: 250_000 },
        { status: 403 }
      );
    }

    // ── 10. Grant access ────────────────────────────────────────────────────
    const response = NextResponse.json({ access: true, tier, balance: uiBalance }, { status: 200 });
    setCookies(response, tier);
    return response;

  } catch (err) {
    console.error('[gate-check] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── OPTIONS — CORS preflight ──────────────────────────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  process.env.NEXT_PUBLIC_APP_URL ?? '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
