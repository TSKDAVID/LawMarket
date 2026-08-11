import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { fill, pageMetadata, siteUrl } from "@/lib/seo";
import { formatCaseDate, formatClause, formatGel } from "@/lib/format";
import {
  getLawyer,
  getLawyers,
  getServiceById,
  getServicesForLawyer,
} from "@/lib/repository";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { Monogram } from "@/components/Monogram";
import { LedgerRow } from "@/components/LedgerRow";
import { BrassStar } from "@/components/BrassStar";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return getLawyers().map((lawyer) => ({ slug: lawyer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const lawyer = getLawyer(slug);
  if (!lawyer) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    barePath: `/lawyers/${lawyer.slug}`,
    title: fill(dict.meta.lawyerTitle, {
      name: lawyer.name[locale],
      specialty: lawyer.specialty[locale],
    }),
    description: fill(dict.meta.lawyerDescription, {
      experience: lawyer.experience[locale],
    }),
  });
}

export default async function LawyerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const lawyer = getLawyer(slug);
  if (!lawyer) notFound();

  const dict = getDictionary(locale);
  const services = getServicesForLawyer(lawyer);
  const cases = [...lawyer.cases].sort((a, b) =>
    b.completedOn.localeCompare(a.completedOn),
  );

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lawyer.name[locale],
    jobTitle: locale === "ka" ? "ადვოკატი" : "Attorney",
    ...(lawyer.barNumber ? { identifier: lawyer.barNumber } : {}),
    url: `${siteUrl()}${localeHref(locale, `/lawyers/${lawyer.slug}`)}`,
    worksFor: { "@type": "LegalService", name: "LawMarket", url: siteUrl() },
    knowsAbout: lawyer.specialty[locale],
  };

  return (
    <article className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <JsonLd data={personLd} />

      {/* Identity header — the file cover */}
      <header>
        <Eyebrow>
          {dict.lawyers.profileEyebrow}
          {lawyer.barNumber ? ` · ${lawyer.barNumber}` : ""}
        </Eyebrow>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-6">
          <Monogram initials={lawyer.initials[locale]} size="lg" />
          <div>
            <h1 className="font-display text-display-xl leading-none">
              {lawyer.name[locale]}
            </h1>
            <p className="mt-3 font-mono text-[0.75rem] tracking-[0.1em] text-ink-70">
              {lawyer.specialty[locale]} · {lawyer.experience[locale]}
            </p>
          </div>
        </div>
        <Rule className="mt-8" />
      </header>

      {/* Services performed by this lawyer — the purchase path */}
      <section className="mt-10">
        <Eyebrow as="h2">{dict.lawyers.servicesHeading}</Eyebrow>
        <ul className="mt-3 divide-y divide-ink/15 border-y border-ink">
          {services.map((service) => (
            <li key={service.id}>
              <LedgerRow
                href={localeHref(locale, `/services/${service.slug}`)}
                clause={formatClause(service.number)}
                label={service.name[locale]}
                price={formatGel(service.priceGel, locale)}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* The two registers: completed cases | reviews */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-ink/25">
        <section className="md:pr-10">
          <div className="flex items-baseline justify-between gap-4">
            <Eyebrow as="h2">{dict.lawyers.casesHeading}</Eyebrow>
            <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-70">
              {String(cases.length).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-3 border-t border-ink">
            {cases.length === 0 ? (
              <p className="border-b border-ink/20 py-10 text-[0.9375rem] leading-relaxed text-ink-70">
                {dict.lawyers.casesEmpty}
              </p>
            ) : (
              <>
                <ul>
                  {cases.map((entry) => {
                    const service = getServiceById(entry.serviceId);
                    return (
                      <li key={entry.id} className="border-b border-ink/20 py-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span className="font-mono text-[0.8125rem] tracking-[0.04em]">
                            {entry.code}
                          </span>
                          <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-70">
                            {formatCaseDate(entry.completedOn)}
                            {entry.placeholder ? (
                              <span className="ml-2 text-brass">
                                {dict.common.specimenMark}
                              </span>
                            ) : null}
                          </span>
                        </div>
                        <p className="mt-1.5 leading-snug">
                          {service ? service.name[locale] : entry.serviceId}
                        </p>
                        <p className="mt-1 text-[0.8125rem] text-ink-70">
                          {dict.lawyers.completed}
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 max-w-[44ch] text-[0.8125rem] leading-relaxed text-ink-70">
                  {dict.lawyers.casesNote}
                </p>
              </>
            )}
          </div>
        </section>

        <section className="mt-14 md:mt-0 md:pl-10">
          <div className="flex items-baseline justify-between gap-4">
            <Eyebrow as="h2">{dict.lawyers.reviewsHeading}</Eyebrow>
            <span aria-hidden="true" className="inline-flex items-center gap-1">
              <BrassStar filled={false} />
              <BrassStar filled={false} />
              <BrassStar filled={false} />
              <BrassStar filled={false} />
              <BrassStar filled={false} />
            </span>
          </div>
          <div className="mt-3 border-t border-ink">
            {lawyer.reviews.length === 0 ? (
              <p className="border-b border-ink/20 py-10 text-[0.9375rem] leading-relaxed text-ink-70">
                {dict.lawyers.reviewsEmpty}
              </p>
            ) : (
              <ul>
                {lawyer.reviews.map((review) => (
                  <li key={review.id} className="border-b border-ink/20 py-5">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <BrassStar key={index} filled={index < review.rating} />
                      ))}
                      <span className="ml-2 font-mono text-[0.75rem] text-ink-70">
                        {fill(dict.lawyers.ratingLabel, {
                          rating: String(review.rating),
                        })}
                      </span>
                    </div>
                    <blockquote className="mt-3 leading-relaxed">
                      {review.quote[locale]}
                    </blockquote>
                    <p className="mt-2 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-70">
                      {review.clientName} · {formatCaseDate(review.date)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
