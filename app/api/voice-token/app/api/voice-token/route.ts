import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { identity, room } = await req.json();

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

  const at = new AccessToken(apiKey, apiSecret, {
    identity: identity ?? 'whale-anon',
    ttl: '4h',
  });

  at.addGrant({
    roomJoin:     true,
    room,
    canPublish:   true,
    canSubscribe: true,
  });

  const token = await at.toJwt();
  return NextResponse.json({ token, url });
}
