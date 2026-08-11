import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { fill, pageMetadata, siteUrl } from "@/lib/seo";
import { formatClause, formatGel } from "@/lib/format";
import {
  getLawyersForService,
  getPracticeArea,
  getService,
  getServices,
  getServicesByPracticeArea,
} from "@/lib/repository";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { Seal } from "@/components/Seal";
import { StampButton } from "@/components/StampButton";
import { LedgerRow } from "@/components/LedgerRow";
import { Monogram } from "@/components/Monogram";
import { PracticeIcon } from "@/components/PracticeIcon";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return getServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = getService(slug);
  if (!service) return {};
  const dict = getDictionary(locale);
  const price = formatGel(service.priceGel, locale);
  return pageMetadata({
    locale,
    barePath: `/services/${service.slug}`,
    title: fill(dict.meta.serviceTitle, { name: service.name[locale], price }),
    description: fill(dict.meta.serviceDescription, {
      description: service.description[locale],
      price,
    }),
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = getService(slug);
  if (!service) notFound();

  const dict = getDictionary(locale);
  const area = getPracticeArea(service.practiceAreaId);
  const lawyers = getLawyersForService(service);
  const price = formatGel(service.priceGel, locale);
  const related = getServicesByPracticeArea(service.practiceAreaId).filter(
    (entry) => entry.slug !== service.slug,
  );

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name[locale],
    description: service.description[locale],
    serviceType: area?.name[locale],
    url: `${siteUrl()}${localeHref(locale, `/services/${service.slug}`)}`,
    provider: {
      "@type": "LegalService",
      name: "LawMarket",
      url: siteUrl(),
    },
    areaServed: { "@type": "Country", name: "Georgia" },
    offers: {
      "@type": "Offer",
      price: String(service.priceGel),
      priceCurrency: "GEL",
      availability: "https://schema.org/InStock",
      url: `${siteUrl()}${localeHref(locale, `/checkout`)}?service=${service.slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <JsonLd data={serviceLd} />

      {/* Identity header */}
      <header>
        <Eyebrow className="flex items-center gap-2.5">
          {area ? <PracticeIcon areaId={area.id} className="text-ink-70" /> : null}
          <span>
            {formatClause(service.number)} · {area?.name[locale]}
            {locale === "ka" && area ? ` · ${area.name.en.toUpperCase()}` : ""}
          </span>
        </Eyebrow>
        <div className="mt-5 grid grid-cols-12 items-end gap-x-5 gap-y-6">
          <h1 className="col-span-12 font-display text-display-xl md:col-span-8">
            {service.name[locale]}
          </h1>
          <p className="col-span-12 self-end justify-self-start font-mono text-[2rem] leading-none tracking-[-0.01em] md:col-span-4 md:justify-self-end md:text-[2.4rem]">
            {price}
          </p>
        </div>
        <div className="relative mt-8">
          <Rule />
          <div className="absolute -top-[2.6rem] right-2 md:right-40">
            <Seal size={84} label={dict.common.sealAria} />
          </div>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-12 md:mt-12">
        {/* The letter body */}
        <div className="col-span-12 md:col-span-7">
          <section>
            <Eyebrow as="h2">{dict.service.subjectHeading}</Eyebrow>
            <p className="mt-4 max-w-[36ch] font-display text-display-md leading-snug">
              {service.description[locale]}.
            </p>
          </section>

          <section className="mt-12">
            <Eyebrow as="h2">{dict.service.includedHeading}</Eyebrow>
            <ol className="mt-4 border-t border-ink/20">
              {dict.service.included.map((item, index) => (
                <li
                  key={index}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-ink/20 py-4"
                >
                  <span className="font-mono text-[0.8125rem] leading-[1.8] text-ink-70">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  <p className="leading-relaxed">{item}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <Eyebrow as="h2">{dict.service.guaranteeTermsHeading}</Eyebrow>
            <p className="mt-4 max-w-[58ch] border-l border-ink/25 pl-5 leading-relaxed text-ink-70">
              {dict.guaranteePage.fullText}
            </p>
          </section>
        </div>

        {/* The filing-card rail */}
        <aside className="col-span-12 md:col-span-4 md:col-start-9">
          <div className="border-t-2 border-ink pt-1">
            <dl>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3.5">
                <dt className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                  {dict.service.factsPrice}
                </dt>
                <dd className="font-mono text-[1.05rem] tabular-nums">{price}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3.5">
                <dt className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                  {dict.service.factsArea}
                </dt>
                <dd className="text-[0.9375rem]">{area?.name[locale]}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3.5">
                <dt className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                  {dict.service.factsGuarantee}
                </dt>
                <dd className="text-[0.9375rem]">{dict.service.factsGuaranteeValue}</dd>
              </div>
            </dl>

            {lawyers.map((lawyer) => (
              <Link
                key={lawyer.id}
                href={localeHref(locale, `/lawyers/${lawyer.slug}`)}
                className="group flex items-center gap-4 border-b border-ink/20 py-4"
              >
                <Monogram initials={lawyer.initials[locale]} size="sm" />
                <span className="flex-1">
                  <span className="block text-[0.6875rem] font-mono tracking-eyebrow text-ink-70">
                    {dict.service.factsLawyer}
                  </span>
                  <span className="mt-0.5 block font-display text-[1.15rem] leading-tight transition-colors duration-150 group-hover:text-stamp">
                    {lawyer.name[locale]}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.6875rem] tracking-[0.08em] text-ink-70">
                    {[lawyer.specialty[locale], lawyer.barNumber]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <span className="font-mono text-[0.9375rem] text-ink-70 transition-colors duration-150 group-hover:text-stamp">
                  →
                </span>
              </Link>
            ))}

            <div className="mt-7 flex flex-col gap-3">
              <StampButton
                href={`${localeHref(locale, "/checkout")}?service=${service.slug}`}
                className="w-full"
              >
                {fill(dict.service.orderCta, { price })}
              </StampButton>
              <p className="text-[0.8125rem] leading-relaxed text-ink-70">
                {dict.service.orderNote}
              </p>
            </div>

            <div className="mt-8 border-t border-ink/20 pt-5">
              <p className="text-[0.875rem] leading-relaxed text-ink-70">
                {dict.service.consultPrompt}
              </p>
              <Link
                href={localeHref(locale, "/consultation")}
                className="mt-2 inline-block font-mono text-[0.8125rem] tracking-[0.04em] text-stamp underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-stamp-press"
              >
                {dict.service.consultLink} →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Related entries in the same practice area */}
      {related.length > 0 ? (
        <section className="mt-16 md:mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Eyebrow as="h2">{dict.service.relatedHeading}</Eyebrow>
            <Link
              href={localeHref(locale, "/#services")}
              className="font-mono text-[0.75rem] tracking-[0.06em] text-stamp underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-stamp-press"
            >
              {dict.service.backToRegister} →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-ink/15 border-y border-ink">
            {related.map((entry) => (
              <li key={entry.id}>
                <LedgerRow
                  href={localeHref(locale, `/services/${entry.slug}`)}
                  clause={formatClause(entry.number)}
                  label={entry.name[locale]}
                  price={formatGel(entry.priceGel, locale)}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
