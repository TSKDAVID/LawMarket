import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { formatGel } from "@/lib/format";
import { orderStore } from "@/lib/orders/store";
import { getServiceById } from "@/lib/repository";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { StampButton } from "@/components/StampButton";
import { completeMockPaymentAction } from "../../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: `${dict.terminal.title} · LawMarket`,
    robots: { index: false, follow: false },
  };
}

/**
 * The MockProvider's hosted approval screen — the stand-in for Flitt's
 * payment page. Sandbox only: lets the reviewer produce every outcome.
 */
export default async function MockTerminalPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const order = await orderStore.get(orderId);
  if (!order) {
    redirect(localeHref(locale, `/checkout/result/${orderId}`));
  }
  if (order.payment === "paid") {
    redirect(localeHref(locale, `/checkout/result/${orderId}`));
  }

  const service = getServiceById(order.serviceId);
  const price = formatGel(order.priceGel, locale);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[30rem]">
        <Eyebrow>{dict.terminal.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-display-lg">{dict.terminal.title}</h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-70">
          {dict.terminal.note}
        </p>

        <dl className="mt-8 border-t-2 border-ink">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3.5">
            <dt className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
              {dict.terminal.orderLabel}
            </dt>
            <dd className="font-mono text-[0.9375rem] tracking-[0.04em]">
              {order.reference}
            </dd>
          </div>
          {service ? (
            <div className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3.5">
              <dt className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                §
              </dt>
              <dd className="text-right text-[0.9375rem] leading-snug">
                {service.name[locale]}
              </dd>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink py-3.5">
            <dt className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
              {dict.terminal.amountLabel}
            </dt>
            <dd className="font-mono text-[1.35rem] leading-none tabular-nums">
              {price}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3">
          <form action={completeMockPaymentAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="outcome" value="approved" />
            <StampButton type="submit" className="w-full">
              {dict.terminal.approve} — {price}
            </StampButton>
          </form>
          <div className="grid gap-3 sm:grid-cols-2">
            <form action={completeMockPaymentAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="outcome" value="declined" />
              <StampButton type="submit" variant="secondary" className="w-full">
                {dict.terminal.decline}
              </StampButton>
            </form>
            <form action={completeMockPaymentAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="outcome" value="cancelled" />
              <StampButton type="submit" variant="secondary" className="w-full">
                {dict.terminal.cancel}
              </StampButton>
            </form>
          </div>
        </div>

        <Rule tone="faint" className="mt-8" />
        <form action={completeMockPaymentAction} className="mt-4">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="outcome" value="fail" />
          <button
            type="submit"
            className="min-h-[44px] font-mono text-[0.75rem] tracking-[0.06em] text-ink-70 underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-stamp"
          >
            {dict.terminal.fail}
          </button>
        </form>
      </div>
    </div>
  );
}
