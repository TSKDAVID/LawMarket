"use server";

import { redirect } from "next/navigation";
import { CustomerSchema, LocaleSchema, type PaymentStatus } from "@/schemas";
import { orderStore } from "@/lib/orders/store";
import { getPaymentProvider, signMockPayload } from "@/lib/payments/provider";
import { getService } from "@/lib/repository";
import { localeHref } from "@/lib/routes";

export interface CheckoutFormState {
  fieldErrors?: { name?: boolean; email?: boolean; phone?: boolean };
  serverError?: boolean;
}

/**
 * Creates the order server-side — the price is read from the repository,
 * NEVER from the client (ENGINEERING.md §3) — then opens a payment session
 * through the provider interface and sends the client to approval.
 */
export async function createOrderAction(
  _previous: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const localeParse = LocaleSchema.safeParse(formData.get("locale"));
  const locale = localeParse.success ? localeParse.data : "ka";

  const serviceSlug = String(formData.get("service") ?? "");
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");
  const service = getService(serviceSlug);
  if (!service || !idempotencyKey) {
    return { serverError: true };
  }

  const customerParse = CustomerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!customerParse.success) {
    const fieldErrors: CheckoutFormState["fieldErrors"] = {};
    for (const issue of customerParse.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "phone") {
        fieldErrors[field] = true;
      }
    }
    return { fieldErrors };
  }

  let redirectPath: string;
  try {
    const order = await orderStore.create({
      serviceId: service.id,
      priceGel: service.priceGel,
      customer: customerParse.data,
      locale,
      idempotencyKey,
    });
    const session = await getPaymentProvider().createSession(order);
    redirectPath = session.redirectPath;
  } catch {
    return { serverError: true };
  }

  redirect(localeHref(locale, redirectPath));
}

const outcomeToStatus: Record<string, PaymentStatus> = {
  approved: "paid",
  declined: "declined",
  cancelled: "cancelled",
};

/**
 * The mock terminal's four outcomes. For approved/declined/cancelled a
 * SIGNED callback payload is built and verified exactly the way a real
 * webhook would be; "fail" simulates a network failure — the callback never
 * arrives and the order stays pending, which the result page reports as an
 * unconfirmed payment. Updates are idempotent: a paid order never changes.
 */
export async function completeMockPaymentAction(formData: FormData): Promise<void> {
  const localeParse = LocaleSchema.safeParse(formData.get("locale"));
  const locale = localeParse.success ? localeParse.data : "ka";
  const orderId = String(formData.get("orderId") ?? "");
  const outcome = String(formData.get("outcome") ?? "");

  const order = await orderStore.get(orderId);
  if (!order) {
    redirect(localeHref(locale, "/checkout/result/unknown"));
  }

  if (order.payment !== "paid" && outcome !== "fail") {
    const payload = {
      orderId,
      outcome,
      signature: signMockPayload(orderId, outcome),
    };
    const verified = await getPaymentProvider().verifyCallback(payload);
    if (verified) {
      const status = outcomeToStatus[verified.outcome];
      if (status) {
        await orderStore.applyPaymentResult(verified.orderId, status);
      }
    }
  }

  redirect(localeHref(locale, `/checkout/result/${orderId}`));
}
