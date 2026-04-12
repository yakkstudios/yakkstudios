import { NextRequest, NextResponse } from "next/server";
import { createSwap } from "@/lib/yakk-swap-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const swap = await createSwap(body);
    return NextResponse.json(swap);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Swap preparation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
