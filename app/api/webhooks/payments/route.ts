import { NextResponse } from "next/server";

/**
 * Reserved endpoint for the BOG iPay payment gateway callback.
 * The current build uses a stubbed payment flow; when real payments are
 * integrated, this handler will verify the gateway signature and update
 * the corresponding booking/payment records.
 */
export async function POST() {
  return NextResponse.json(
    { received: true, note: "Payment webhook stub — BOG iPay integration pending." },
    { status: 200 },
  );
}
