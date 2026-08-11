import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Order } from "@/schemas";

/**
 * Payment provider interface (ENGINEERING.md §3).
 *
 * The site talks to THIS interface only. The Flitt adapter drops in later as
 * another implementation: `createSession` will call Flitt's order-create API
 * and return their hosted checkout URL; `verifyCallback` will validate the
 * signature of Flitt's server callback/webhook. No UI code changes.
 */

export type PaymentOutcome = "approved" | "declined" | "cancelled";

export interface PaymentSession {
  sessionId: string;
  orderId: string;
  /** Locale-agnostic path the customer is sent to for approval. */
  redirectPath: string;
}

export interface VerifiedCallback {
  orderId: string;
  outcome: PaymentOutcome;
}

export interface PaymentProvider {
  readonly name: string;
  createSession(order: Order): Promise<PaymentSession>;
  /**
   * Verify a callback payload's authenticity (signature checked server-side).
   * Returns null for payloads that fail verification.
   */
  verifyCallback(payload: Record<string, string>): Promise<VerifiedCallback | null>;
}

/* ------------------------------ MockProvider ------------------------------ */

function secret(): string {
  return process.env.MOCK_PAYMENT_SECRET ?? "dev-only-signing-secret-change-me";
}

export function signMockPayload(orderId: string, outcome: string): string {
  return createHmac("sha256", secret()).update(`${orderId}:${outcome}`).digest("hex");
}

/**
 * MockProvider — a stand-in with the exact shape the Flitt adapter needs.
 * Sends the customer to an on-site fake approval terminal; its callbacks are
 * HMAC-signed and verified exactly like a real webhook would be.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createSession(order: Order): Promise<PaymentSession> {
    return {
      sessionId: `mock_${order.id}`,
      orderId: order.id,
      redirectPath: `/checkout/pay/${order.id}`,
    };
  },

  async verifyCallback(payload): Promise<VerifiedCallback | null> {
    const { orderId, outcome, signature } = payload;
    if (!orderId || !outcome || !signature) return null;
    if (outcome !== "approved" && outcome !== "declined" && outcome !== "cancelled") {
      return null;
    }
    const expected = signMockPayload(orderId, outcome);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return { orderId, outcome };
  },
};

/** Active provider, selected by environment (mock until Flitt keys arrive). */
export function getPaymentProvider(): PaymentProvider {
  const configured = process.env.PAYMENT_PROVIDER ?? "mock";
  switch (configured) {
    case "mock":
      return mockProvider;
    // case "flitt": return flittProvider; — drops in with sandbox keys later.
    default:
      return mockProvider;
  }
}
