import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { formatClause, formatGel } from "@/lib/format";
import { getLawyers, getLedger, getPriceRange } from "@/lib/repository";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { Seal } from "@/components/Seal";
import { StampButton } from "@/components/StampButton";
import { Monogram } from "@/components/Monogram";
import { JsonLd } from "@/components/JsonLd";
import {
  LedgerSearch,
  type LedgerGroup,
} from "@/components/LedgerSearch";

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
    barePath: "/",
    title: dict.meta.home.title,
    description: dict.meta.home.description,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const ledger = getLedger();
  const lawyers = getLawyers();
  const priceRange = getPriceRange();

  const groups: LedgerGroup[] = ledger.map(({ area, services }) => {
    const first = services[0];
    const last = services[services.length - 1];
    return {
      id: area.id,
      heading: area.name[locale],
      headingLatin: locale === "ka" ? area.name.en.toUpperCase() : null,
      range:
        services.length > 1 && first && last
          ? `${formatClause(first.number)} — ${formatClause(last.number)}`
          : first
            ? formatClause(first.number)
            : "",
      items: services.map((service) => ({
        slug: service.slug,
        clause: formatClause(service.number),
        name: service.name[locale],
        price: formatGel(service.priceGel, locale),
        searchable: [
          service.name.ka,
          service.name.en,
          area.name.ka,
          area.name.en,
        ]
          .join(" ")
          .toLowerCase(),
      })),
    };
  });

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "LawMarket",
    url: siteUrl(),
    description: dict.meta.home.description,
    areaServed: { "@type": "Country", name: "Georgia" },
    priceRange: `₾${priceRange.min}–₾${priceRange.max}`,
    currenciesAccepted: "GEL",
  };

  return (
    <>
      <JsonLd data={organizationLd} />

      {/* ——— Hero: the first page of a formal instrument ——— */}
      <section className="mx-auto max-w-[1200px] px-5 pt-12 md:px-10 md:pt-20">
        <Eyebrow>{dict.hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 font-display text-display-2xl tracking-[-0.01em]">
          {dict.hero.title}
        </h1>
        <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-10 md:mt-12">
          <p className="col-span-12 self-end font-display text-display-md text-ink-70 md:col-span-6">
            {dict.hero.consultNote}
          </p>
          <div className="col-span-12 flex max-w-[26rem] flex-col items-start gap-6 md:col-span-4 md:col-start-9">
            <p className="text-[0.9375rem] leading-relaxed text-ink-70">
              {dict.hero.lede}
            </p>
            <div className="flex flex-col items-start gap-3">
              <StampButton href="#services">{dict.hero.ctaPrimary}</StampButton>
              <StampButton
                variant="secondary"
                href={localeHref(locale, "/consultation")}
              >
                {dict.hero.ctaConsult}
              </StampButton>
            </div>
          </div>
        </div>
        <div className="relative mt-14 md:mt-16">
          <Rule />
          <div className="absolute -top-[3.4rem] right-4 md:right-24">
            <Seal size={108} label={dict.common.sealAria} />
          </div>
          <p className="mt-3 max-w-[65%] font-mono text-[0.6875rem] tracking-eyebrow text-ink-70 md:max-w-none">
            {dict.hero.meta}
          </p>
        </div>
      </section>

      {/* ——— The services ledger — the working document ——— */}
      <section
        id="services"
        className="mx-auto max-w-[1200px] scroll-mt-6 px-5 pb-20 pt-12 md:px-10 md:pb-24 md:pt-14"
      >
        <div className="mb-2 md:mb-0">
          <Eyebrow>{dict.ledger.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-display-lg md:-mb-[3.4rem] md:max-w-[46%]">
            {dict.ledger.title}
          </h2>
        </div>
        <div className="mt-6 md:mt-0">
          <LedgerSearch
            groups={groups}
            locale={locale}
            serviceHrefPrefix={localeHref(locale, "/services")}
            strings={{
              searchLabel: dict.ledger.searchLabel,
              searchPlaceholder: dict.ledger.searchPlaceholder,
              clear: dict.ledger.clear,
              countAnnouncement: dict.ledger.countAnnouncement,
              emptyTitle: dict.ledger.emptyTitle,
              emptyAction: dict.ledger.emptyAction,
            }}
          />
        </div>
        <p className="mt-6 border-t border-ink pt-3 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-70">
          {dict.ledger.note}
        </p>
      </section>

      {/* ——— The guarantee — numbered signed clauses ——— */}
      <section className="border-y border-ink/15 bg-paper-deep">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-10 md:py-28">
          <div className="grid grid-cols-12 gap-x-5 gap-y-10">
            <div className="col-span-12 md:col-span-4">
              <Eyebrow>{dict.guaranteeSection.eyebrow}</Eyebrow>
              <h2 className="mt-3 max-w-[16ch] font-display text-display-lg">
                {dict.guaranteeSection.title}
              </h2>
              <p className="mt-6">
                <Link
                  href={localeHref(locale, "/guarantee")}
                  className="font-mono text-[0.8125rem] tracking-[0.06em] text-stamp underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-stamp-press"
                >
                  {dict.guaranteeSection.link} →
                </Link>
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <ol>
                {dict.guaranteeSection.clauses.map((clause, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-[2.75rem_1fr] gap-x-2 border-b border-ink/20 py-5 first:pt-0"
                  >
                    <span className="font-mono text-[0.8125rem] leading-[1.9] text-ink-70">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <p className="text-[1.0625rem] leading-relaxed">{clause}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[0.8125rem] text-ink-70">
                    {dict.guaranteeSection.signedLabel}
                  </p>
                  <p className="mt-2 font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                    {dict.guaranteeSection.signedPlace}
                  </p>
                </div>
                <Seal size={92} rotate={-11} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— The bar register preview ——— */}
      <section className="mx-auto max-w-[1200px] px-5 py-14 md:px-10 md:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <Eyebrow>{dict.lawyersSection.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-display-lg">
              {dict.lawyersSection.title}
            </h2>
          </div>
          <Link
            href={localeHref(locale, "/lawyers")}
            className="font-mono text-[0.8125rem] tracking-[0.06em] text-stamp underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-stamp-press"
          >
            {dict.lawyersSection.viewAll} →
          </Link>
        </div>
        <p className="mt-4 max-w-[52ch] text-[0.9375rem] text-ink-70">
          {dict.lawyersSection.lede}
        </p>
        <ul className="mt-9 border-t border-ink">
          {lawyers.map((lawyer) => (
            <li key={lawyer.id} className="border-b border-ink/20">
              <Link
                href={localeHref(locale, `/lawyers/${lawyer.slug}`)}
                className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1 py-5 md:grid-cols-[auto_1.2fr_1fr_auto] md:gap-x-8"
              >
                <Monogram initials={lawyer.initials[locale]} size="md" />
                <div>
                  <p className="font-display text-[1.4rem] leading-tight transition-colors duration-150 group-hover:text-stamp">
                    {lawyer.name[locale]}
                  </p>
                  <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-70">
                    {[lawyer.barNumber, lawyer.specialty[locale]]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <p className="col-span-2 text-[0.875rem] leading-relaxed text-ink-70 md:col-span-1">
                  {lawyer.experience[locale]}
                </p>
                <span className="hidden font-mono text-[0.75rem] tracking-[0.08em] text-ink-70 underline-offset-4 transition-colors duration-150 group-hover:text-stamp group-hover:underline md:inline">
                  {dict.lawyersSection.caseFile} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ——— The standing offer — one huge line on paper ——— */}
      <section className="border-t border-ink/15">
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid grid-cols-12 items-end gap-x-5 gap-y-10">
            <div className="col-span-12 md:col-span-8">
              <Eyebrow>{dict.consultStrip.eyebrow}</Eyebrow>
              <h2 className="mt-4 font-display text-display-xl">
                {dict.consultStrip.title}
              </h2>
            </div>
            <div className="col-span-12 flex max-w-[24rem] flex-col items-start gap-6 md:col-span-3 md:col-start-10">
              <p className="text-[0.9375rem] leading-relaxed text-ink-70">
                {dict.consultStrip.lede}
              </p>
              <StampButton href={localeHref(locale, "/consultation")}>
                {dict.consultStrip.cta}
              </StampButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
