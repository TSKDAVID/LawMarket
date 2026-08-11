import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Dictionary } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { formatClause, formatGel, formatLongDate } from "@/lib/format";
import { orderStore } from "@/lib/orders/store";
import { getLawyersForService, getServiceById } from "@/lib/repository";
import type { Locale, Order } from "@/schemas";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { Seal } from "@/components/Seal";
import { StampButton } from "@/components/StampButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.checkoutTitle,
    robots: { index: false, follow: false },
  };
}

/** Declined / cancelled / unconfirmed — each states what happened and what to do next. */
function FailureState({
  locale,
  eyebrow,
  title,
  body,
  order,
  primary,
  secondaryLabel,
  reference,
  referenceLabel,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  body: string;
  order?: Order;
  primary?: { label: string; href: string };
  secondaryLabel: string;
  reference?: string;
  referenceLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-32">
      <div className="max-w-[38rem]">
        <Eyebrow tone="stamp">{eyebrow}</Eyebrow>
        <h1 className="mt-5 font-display text-display-xl">{title}</h1>
        <p className="mt-6 max-w-[48ch] leading-relaxed text-ink-70">{body}</p>
        {reference && referenceLabel ? (
          <p className="mt-5 font-mono text-[0.8125rem] tracking-[0.06em]">
            {referenceLabel}: {reference}
          </p>
        ) : null}
        <Rule className="my-10 max-w-[26rem]" />
        <div className="flex flex-wrap gap-4">
          {primary && order ? (
            <StampButton href={primary.href}>{primary.label}</StampButton>
          ) : null}
          <StampButton variant="secondary" href={`${localeHref(locale, "/")}#services`}>
            {secondaryLabel}
          </StampButton>
        </div>
      </div>
    </div>
  );
}

/** The executed order — the seal is stamped on the confirmation. */
function ExecutedState({
  locale,
  dict,
  order,
}: {
  locale: Locale;
  dict: Dictionary;
  order: Order;
}) {
  const service = getServiceById(order.serviceId);
  const lawyer = service ? getLawyersForService(service)[0] : undefined;
  const price = formatGel(order.priceGel, locale);

  const letterRow =
    "grid grid-cols-[7.5rem_1fr] gap-x-4 border-b border-ink/20 py-3.5 md:grid-cols-[9rem_1fr]";
  const letterLabel =
    "font-mono text-[0.6875rem] tracking-eyebrow text-ink-70 leading-[1.9]";

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-12 md:px-10 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-[44rem]">
        <Eyebrow tone="brass">{dict.result.executedEyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-display-xl">
          {dict.result.successTitle}
        </h1>
        <p className="mt-5 max-w-[52ch] leading-relaxed text-ink-70">
          {dict.result.successBody}
        </p>

        <div className="relative mt-10 border-t-2 border-ink">
          <div className={letterRow}>
            <p className={letterLabel}>{dict.checkout.referenceLabel}</p>
            <p className="font-mono text-[1.25rem] leading-tight tracking-[0.04em]">
              {order.reference}
            </p>
          </div>
          <div className={letterRow}>
            <p className={letterLabel}>{dict.checkout.subjectLabel}</p>
            <p className="leading-snug">
              {service ? service.name[locale] : order.serviceId}
              {service ? (
                <span className="font-mono text-[0.75rem] text-ink-70">
                  {" "}
                  · {formatClause(service.number)}
                </span>
              ) : null}
            </p>
          </div>
          {lawyer ? (
            <div className={letterRow}>
              <p className={letterLabel}>{dict.checkout.performerLabel}</p>
              <p className="leading-snug">
                {lawyer.name[locale]}{" "}
                <span className="font-mono text-[0.75rem] text-ink-70">
                  · {lawyer.barNumber ?? lawyer.specialty[locale]}
                </span>
              </p>
            </div>
          ) : null}
          <div className={letterRow}>
            <p className={letterLabel}>{dict.checkout.clientHeading}</p>
            <div className="leading-snug">
              <p>{order.customer.name}</p>
              <p className="mt-0.5 font-mono text-[0.75rem] tracking-[0.04em] text-ink-70">
                {order.customer.email} · {order.customer.phone}
              </p>
            </div>
          </div>
          <div className={letterRow}>
            <p className={letterLabel}>{dict.checkout.dateLabel}</p>
            <p className="leading-snug">{formatLongDate(order.updatedAt, locale)}</p>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b-2 border-ink py-4">
            <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
              {dict.checkout.totalLabel}
            </p>
            <p className="font-mono text-[1.5rem] leading-none tabular-nums">{price}</p>
          </div>

          {/* The stamp — the brand's best moment. */}
          <div className="pointer-events-none absolute -bottom-16 left-4 md:-bottom-14 md:left-auto md:right-48">
            <Seal
              size={148}
              tone="stamp"
              rotate={-12}
              label={dict.common.sealAria}
              className="animate-stamp"
            />
          </div>
        </div>

        <p className="mt-20 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink-70 md:mt-16">
          {dict.result.successKeepRef}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <StampButton variant="secondary" href={`${localeHref(locale, "/")}#services`}>
            {dict.result.backToRegister}
          </StampButton>
        </div>
      </div>
    </div>
  );
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const order = await orderStore.get(orderId);

  if (!order) {
    return (
      <FailureState
        locale={locale}
        eyebrow="LM — ?"
        title={dict.result.notFoundTitle}
        body={dict.result.notFoundBody}
        secondaryLabel={dict.result.backToRegister}
      />
    );
  }

  const payHref = localeHref(locale, `/checkout/pay/${order.id}`);
  const resultHref = localeHref(locale, `/checkout/result/${order.id}`);

  switch (order.payment) {
    case "paid":
      return <ExecutedState locale={locale} dict={dict} order={order} />;
    case "declined":
      return (
        <FailureState
          locale={locale}
          eyebrow={dict.result.declinedEyebrow}
          title={dict.result.declinedTitle}
          body={dict.result.declinedBody}
          order={order}
          primary={{ label: dict.result.retry, href: payHref }}
          secondaryLabel={dict.result.backToRegister}
          reference={order.reference}
          referenceLabel={dict.checkout.referenceLabel}
        />
      );
    case "cancelled":
      return (
        <FailureState
          locale={locale}
          eyebrow={dict.result.cancelledEyebrow}
          title={dict.result.cancelledTitle}
          body={dict.result.cancelledBody}
          order={order}
          primary={{ label: dict.result.resume, href: payHref }}
          secondaryLabel={dict.result.backToRegister}
          reference={order.reference}
          referenceLabel={dict.checkout.referenceLabel}
        />
      );
    default:
      /* pending / failed — the network failure case: result unconfirmed. */
      return (
        <div>
          <FailureState
            locale={locale}
            eyebrow={dict.result.failedEyebrow}
            title={dict.result.failedTitle}
            body={dict.result.failedBody}
            order={order}
            primary={{ label: dict.result.retry, href: payHref }}
            secondaryLabel={dict.result.backToRegister}
            reference={order.reference}
            referenceLabel={dict.checkout.referenceLabel}
          />
          <div className="mx-auto -mt-16 max-w-[1200px] px-5 pb-20 md:px-10">
            <a
              href={resultHref}
              className="font-mono text-[0.8125rem] tracking-[0.06em] text-stamp underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-stamp-press"
            >
              {dict.result.checkStatus} →
            </a>
          </div>
        </div>
      );
  }
}
