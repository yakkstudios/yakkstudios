import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Route segment config — forces Node.js runtime and prevents static optimisation.
// Also ensures this route's bundle is unique (prevents Vercel EEXIST symlink dedup).
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ── In-memory rate limiter (resets per serverless instance cold-start) ─────
// For production scale, replace with Upstash Redis or Vercel KV.
const RATE_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT   = 10;   // max requests
const RATE_WINDOW  = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_MAP.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_MAP.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Allowed rooms ──────────────────────────────────────────────────────────
const ALLOWED_ROOMS = new Set(['whale-lounge']);

// ── Identity sanitisation ──────────────────────────────────────────────────
// Only allow alphanumeric + dots + hyphens + underscores (wallet-safe chars).
const IDENTITY_SAFE = /^[a-zA-Z0-9._\-]{1,64}$/;

export async function POST(req: NextRequest) {
  // 1. Rate limit by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before joining again.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  // 2. Parse and validate body
  let body: { identity?: unknown; room?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { identity: rawIdentity, room: rawRoom } = body;

  // 3. Validate room — only whale-lounge is permitted
  const room = typeof rawRoom === 'string' ? rawRoom.trim() : '';
  if (!ALLOWED_ROOMS.has(room)) {
    return NextResponse.json(
      { error: 'Invalid room. Only \'whale-lounge\' is currently available.' },
      { status: 400 }
    );
  }

  // 4. Sanitise identity (defaults to anonymous whale tag)
  const rawId = typeof rawIdentity === 'string' ? rawIdentity.trim() : '';
  const identity = IDENTITY_SAFE.test(rawId)
    ? rawId
    : 'whale-anon-' + Math.random().toString(36).slice(2, 8);

  // 5. Check LiveKit credentials are configured
  const apiKey    = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url       = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !url) {
    return NextResponse.json(
      {
        error:
          'Voice chat not configured. Add LIVEKIT_URL, LIVEKIT_API_KEY and ' +
          'LIVEKIT_API_SECRET to your Vercel environment variables. ' +
          'Get free credentials at livekit.io',
      },
      { status: 503 }
    );
  }

  // 6. Mint a short-lived token (4h TTL, room-scoped)
  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    ttl: '4h',
  });
  at.addGrant({
    roomJoin:     true,
    room,
    canPublish:   true,
    canSubscribe: true,
    // Prevent participants from creating new rooms or administering the server
    roomCreate:   false,
    roomAdmin:    false,
    roomList:     false,
    canPublishData: false, // disable data channel (chat) for now
  });

  const token = await at.toJwt();
  return NextResponse.json({ token, url });
}
