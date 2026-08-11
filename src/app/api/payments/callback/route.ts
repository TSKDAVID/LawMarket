import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { orderStore } from "@/lib/orders/store";
import type { PaymentStatus } from "@/schemas";

const outcomeToStatus: Record<string, PaymentStatus> = {
  approved: "paid",
  declined: "declined",
  cancelled: "cancelled",
};

/**
 * Payment callback/webhook endpoint (ENGINEERING.md §3). The Flitt adapter
 * will point its server callback here; signatures are verified through the
 * provider interface and order updates are idempotent (webhook retries are
 * no-ops once an order is paid).
 */
export async function POST(request: Request) {
  let payload: Record<string, string>;
  try {
    payload = (await request.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const verified = await getPaymentProvider().verifyCallback(payload);
  if (!verified) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const status = outcomeToStatus[verified.outcome];
  if (!status) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const order = await orderStore.applyPaymentResult(verified.orderId, status);
  if (!order) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
