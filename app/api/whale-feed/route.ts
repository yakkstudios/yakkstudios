import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const _ROUTE = 'whale-feed' as const; // unique bundle id

// ── $YST token mint ───────────────────────────────────────────────────────────
const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';

// ── Ring buffer — max 50 entries, oldest dropped when full ────────────────────
const RING_SIZE = 50;
const ringBuffer: WhaleEvent[] = [];

interface WhaleEvent {
  wallet: string;
  amount: number;
  direction: 'buy' | 'sell';
  token: string;
  timestamp: string;
  receivedAt: number;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ── Solana address validation (base58, 32–44 chars) ───────────────────────────
function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

// ── POST: receive n8n webhook events ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    // Always return 200 to the webhook so n8n doesn't retry indefinitely
    return NextResponse.json({ received: true, error: 'invalid_json' }, { status: 200, headers: CORS });
  }

  const { wallet, amount, direction, token, timestamp } = body ?? {};

  // Validate fields — log errors but always return 200
  const errors: string[] = [];
  if (!wallet || !isValidSolanaAddress(wallet))      errors.push('invalid_wallet');
  if (!amount || typeof amount !== 'number' || amount <= 0) errors.push('invalid_amount');
  if (direction !== 'buy' && direction !== 'sell')   errors.push('invalid_direction');
  if (token !== YST_MINT)                            errors.push('wrong_token');

  if (errors.length) {
    console.warn('[whale-feed] Validation failed:', errors, body);
    return NextResponse.json({ received: true, errors }, { status: 200, headers: CORS });
  }

  const event: WhaleEvent = {
    wallet,
    amount,
    direction,
    token,
    timestamp: timestamp ?? new Date().toISOString(),
    receivedAt: Date.now(),
  };

  // Push to ring buffer — drop oldest entry if full
  if (ringBuffer.length >= RING_SIZE) {
    ringBuffer.shift();
  }
  ringBuffer.push(event);

  return NextResponse.json({ received: true }, { status: 200, headers: CORS });
}

// ── GET: return current buffer contents ──────────────────────────────────────
export async function GET(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS });
  }

  // Return newest events first
  const events = [...ringBuffer].reverse();

  return NextResponse.json(
    {
      events,
      count: events.length,
      maxSize: RING_SIZE,
      ts: Date.now(),
    },
    { headers: CORS }
  );
}
