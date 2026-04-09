import { NextResponse } from 'next/server';

// Voice feature removed — livekit-server-sdk caused Vercel EEXIST bundle collision.
// Route kept as a stub so any lingering client calls get a clean 410 Gone
// rather than a 404 that might be misread as a config error.
export const dynamic     = 'force-dynamic';
export const runtime     = 'nodejs';
export const maxDuration = 45;

export async function POST() {
  return NextResponse.json(
    { error: 'Voice feature is not available. Use Discord or Telegram for voice chat.' },
    { status: 410 }
  );
}
