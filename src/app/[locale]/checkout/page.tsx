import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { fill, pageMetadata } from "@/lib/seo";
import { formatClause, formatGel, formatLongDate } from "@/lib/format";
import { getLawyersForService, getService } from "@/lib/repository";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { StampButton } from "@/components/StampButton";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    barePath: "/checkout",
    title: dict.meta.checkoutTitle,
    description: dict.meta.checkoutDescription,
    noindex: true,
  });
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { service: serviceSlug } = await searchParams;
  const service = serviceSlug ? getService(serviceSlug) : undefined;

  /* Designed empty state: no service selected yet. */
  if (!service) {
    return (
      <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-36">
        <Eyebrow>{dict.checkout.letterEyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-display text-display-xl">
          {dict.checkout.emptyTitle}
        </h1>
        <p className="mt-6 max-w-[44ch] text-ink-70">{dict.checkout.emptyBody}</p>
        <Rule className="my-10 max-w-[26rem]" />
        <StampButton href={localeHref(locale, "/services")}>
          {dict.checkout.emptyAction}
        </StampButton>
      </div>
    );
  }

  const lawyer = getLawyersForService(service)[0];
  const price = formatGel(service.priceGel, locale);
  const today = formatLongDate(new Date().toISOString(), locale);
  const guaranteeClause = dict.guaranteeSection.clauses[2] ?? "";

  const letterRow =
    "grid grid-cols-[7.5rem_1fr] gap-x-4 border-b border-ink/20 py-3.5 md:grid-cols-[9rem_1fr]";
  const letterLabel = "font-mono text-[0.6875rem] tracking-eyebrow text-ink-70 leading-[1.9]";

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <Eyebrow>{dict.checkout.letterEyebrow}</Eyebrow>
      <h1 className="mt-4 font-display text-display-xl">{dict.checkout.pageTitle}</h1>

      <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-14 md:mt-12">
        {/* ——— The engagement letter ——— */}
        <section className="col-span-12 md:col-span-7">
          <div className="border-t-2 border-ink">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <h2 className="font-display text-display-md">
                {dict.checkout.letterHeading}
              </h2>
              <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-70">
                {dict.checkout.dateLabel}: {today}
              </p>
            </div>
            <p className="max-w-[56ch] pb-5 text-[0.9375rem] leading-relaxed text-ink-70">
              {dict.checkout.letterIntro}
            </p>

            <div className="border-t border-ink/20">
              <div className={letterRow}>
                <p className={letterLabel}>{dict.checkout.subjectLabel}</p>
                <div>
                  <p className="leading-snug">
                    {service.name[locale]}{" "}
                    <span className="font-mono text-[0.75rem] text-ink-70">
                      · {formatClause(service.number)}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-70">
                    {service.description[locale]}.
                  </p>
                </div>
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
                <p className={letterLabel}>{dict.checkout.guaranteeLabel}</p>
                <p className="text-[0.9375rem] leading-relaxed">{guaranteeClause}</p>
              </div>
              <div className={letterRow}>
                <p className={letterLabel}>{dict.checkout.priceLabel}</p>
                <p className="font-mono tabular-nums">{price}</p>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-6 border-b-2 border-t border-ink py-4">
              <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                {dict.checkout.totalLabel}
              </p>
              <p className="font-mono text-[1.5rem] leading-none tabular-nums">
                {price}
              </p>
            </div>
          </div>
        </section>

        {/* ——— The client — guest details ——— */}
        <aside className="col-span-12 max-w-[26rem] md:col-span-4 md:col-start-9">
          <CheckoutForm
            serviceSlug={service.slug}
            locale={locale}
            termsHref={localeHref(locale, "/terms")}
            privacyHref={localeHref(locale, "/privacy")}
            strings={{
              clientHeading: dict.checkout.clientHeading,
              nameLabel: dict.checkout.nameLabel,
              emailLabel: dict.checkout.emailLabel,
              phoneLabel: dict.checkout.phoneLabel,
              phoneHint: dict.checkout.phoneHint,
              submit: fill(dict.checkout.submit, { price }),
              submitting: dict.checkout.submitting,
              consentBefore: dict.checkout.consentBefore,
              consentTerms: dict.checkout.consentTerms,
              consentBetween: dict.checkout.consentBetween,
              consentPrivacy: dict.checkout.consentPrivacy,
              consentAfter: dict.checkout.consentAfter,
              errors: dict.checkout.errors,
            }}
          />
        </aside>
      </div>
    </div>
  );
}
