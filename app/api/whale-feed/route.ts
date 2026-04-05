import { NextResponse } from 'next/server';

// ── In-memory whale feed store (last 50 events) ─────────────────────────────
// n8n whale-alert-monitor workflow POSTs here after Helius fires.
// Replace with Supabase/PlanetScale in production for persistence.
const FEED: WhaleTx[] = [];
const MAX_FEED = 50;

interface WhaleTx {
  txHash:      string;
  sender:      string;
  receiver:    string;
  amount:      number;
  isMegaWhale: boolean;
  timestamp:   string;
  receivedAt:  string;
}

// ── POST /api/whale-feed — called by n8n ─────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.txHash || typeof body.amount !== 'number') {
      return NextResponse.json({ error: 'Missing txHash or amount' }, { status: 400 });
    }

    const entry: WhaleTx = {
      txHash:      String(body.txHash),
      sender:      String(body.sender   || 'Unknown'),
      receiver:    String(body.receiver || 'Unknown'),
      amount:      Number(body.amount),
      isMegaWhale: Boolean(body.isMegaWhale),
      timestamp:   String(body.timestamp || new Date().toISOString()),
      receivedAt:  new Date().toISOString(),
    };

    FEED.unshift(entry);
    if (FEED.length > MAX_FEED) FEED.length = MAX_FEED;

    return NextResponse.json({ ok: true, feedSize: FEED.length });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

// ── GET /api/whale-feed — called by dApp live feed component ─────────────────
export async function GET() {
  return NextResponse.json({
    feed:      FEED,
    count:     FEED.length,
    updatedAt: new Date().toISOString(),
    stale:     false,
  });
}
