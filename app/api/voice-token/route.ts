import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Route segment config
// maxDuration=45 makes this bundle's hash unique vs other routes (prevents Vercel EEXIST)
// livekit-server-sdk is an ESM-only package declared in serverComponentsExternalPackages
// in next.config.mjs — this ensures it is never bundled by webpack.
export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 45;

// ── In-memory rate limiter ─────────────────────────────────────────────────
const RATE_MAP    = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT  = 10;
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

const ALLOWED_ROOMS    = new Set(['whale-lounge']);
const IDENTITY_SAFE    = /^[a-zA-Z0-9._\-]{1,64}$/;

export async function POST(req: NextRequest) {
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

  let body: { identity?: unknown; room?: unknown };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }); }

  const { identity: rawIdentity, room: rawRoom } = body;

  const room = typeof rawRoom === 'string' ? rawRoom.trim() : '';
  if (!ALLOWED_ROOMS.has(room)) {
    return NextResponse.json(
      { error: "Invalid room. Only 'whale-lounge' is currently available." },
      { status: 400 }
    );
  }

  const rawId    = typeof rawIdentity === 'string' ? rawIdentity.trim() : '';
  const identity = IDENTITY_SAFE.test(rawId)
    ? rawId
    : 'whale-anon-' + Math.random().toString(36).slice(2, 8);

  const apiKey    = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url       = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !url) {
    return NextResponse.json(
      {
        error:
          'Voice chat not configured. Add LIVEKIT_URL, LIVEKIT_API_KEY and ' +
          'LIVEKIT_API_SECRET to your Vercel environment variables.',
      },
      { status: 503 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity, ttl: '4h' });
  at.addGrant({
    roomJoin: true, room,
    canPublish: true, canSubscribe: true,
    roomCreate: false, roomAdmin: false,
    roomList: false, canPublishData: false,
  });

  const token = await at.toJwt();
  return NextResponse.json({ token, url });
}
