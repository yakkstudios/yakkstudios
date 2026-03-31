import { NextRequest, NextResponse } from 'next/server';

// ── In-memory whale event ring buffer (last 50 events) ───────────────────
// Resets on cold start — acceptable for a live feed. For persistence add a DB.
const MAX_EVENTS = 50;

interface WhaleEvent {
  id:        string;   // unique id (signature or uuid)
  ts:        number;   // unix ms
  wallet:    string;   // abbreviated wallet address
  amount:    number;   // YST amount
  type:      'buy' | 'sell' | 'transfer';
  tier:      'whale' | 'mega';  // whale ≥1M, mega ≥10M
  usdValue:  number;
  txSig?:    string;   // Solana tx signature (optional)
}

const FEED: WhaleEvent[] = [];

// ── Shared secret — set N8N_WHALE_FEED_SECRET in .env.local ──────────────
const FEED_SECRET = process.env.N8N_WHALE_FEED_SECRET ?? '';

// ── Thresholds (must match n8n workflow) ─────────────────────────────────
const WHALE_MIN = 1_000_000;   // 1M YST
const MEGA_MIN  = 10_000_000;  // 10M YST

// ── Rate limit for GET (public) ───────────────────────────────────────────
const RATE_MAP   = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT  = 60;
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

function abbrevWallet(w: string): string {
  if (!w || w.length < 10) return w ?? 'unknown';
  return `${w.slice(0, 4)}…${w.slice(-4)}`;
}

// ── POST — receive whale event from n8n ──────────────────────────────────
export async function POST(req: NextRequest) {
  // Validate shared secret
  const auth = req.headers.get('x-feed-secret') ?? req.headers.get('authorization') ?? '';
  if (FEED_SECRET && auth.replace('Bearer ', '') !== FEED_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Accept single event or array
  const events: any[] = Array.isArray(body) ? body : [body];

  for (const ev of events) {
    const amount = Number(ev.amount ?? ev.ystAmount ?? 0);
    if (isNaN(amount) || amount < WHALE_MIN) continue;

    const event: WhaleEvent = {
      id:       ev.id ?? ev.signature ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts:       ev.ts ?? ev.timestamp ?? Date.now(),
      wallet:   abbrevWallet(ev.wallet ?? ev.from ?? ev.address ?? ''),
      amount,
      type:     ev.type ?? 'transfer',
      tier:     amount >= MEGA_MIN ? 'mega' : 'whale',
      usdValue: Number(ev.usdValue ?? ev.usd_value ?? 0),
      txSig:    ev.txSig ?? ev.signature,
    };

    // Deduplicate by id
    if (!FEED.some(e => e.id === event.id)) {
      FEED.unshift(event);
      if (FEED.length > MAX_EVENTS) FEED.pop();
    }
  }

  return NextResponse.json({ ok: true, total: FEED.length });
}

// ── GET — serve whale feed to Alerts.tsx ─────────────────────────────────
export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Optional ?limit= query param (default 20, max 50)
  const url    = new URL(req.url);
  const limit  = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);
  const since  = Number(url.searchParams.get('since') ?? 0); // unix ms

  const result = FEED
    .filter(e => e.ts > since)
    .slice(0, limit);

  return NextResponse.json({
    events:  result,
    total:   FEED.length,
    updated: Date.now(),
  });
}
