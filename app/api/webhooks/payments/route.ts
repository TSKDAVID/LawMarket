import { NextResponse } from "next/server";

/**
 * Payment webhooks (BOG iPay / TBC) — Phase 3+.
 * Stub only: verifies nothing and writes nothing yet.
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, message: "Payment webhooks are not implemented yet." },
    { status: 501 },
  );
}
