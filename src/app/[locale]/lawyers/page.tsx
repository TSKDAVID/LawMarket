import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { formatClause } from "@/lib/format";
import { getLawyers, getServicesForLawyer } from "@/lib/repository";
import { Eyebrow } from "@/components/Eyebrow";
import { Monogram } from "@/components/Monogram";

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
    barePath: "/lawyers",
    title: dict.meta.lawyersTitle,
    description: dict.meta.lawyersDescription,
  });
}

export default async function LawyersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const lawyers = getLawyers();

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <Eyebrow>{dict.lawyers.registerEyebrow}</Eyebrow>
      <div className="grid grid-cols-12 items-end gap-x-5">
        <h1 className="col-span-12 mt-4 font-display text-display-xl md:col-span-7">
          {dict.lawyers.registerTitle}
        </h1>
        <p className="col-span-12 mt-5 max-w-[38rem] text-[0.9375rem] leading-relaxed text-ink-70 md:col-span-4 md:col-start-9 md:mt-0">
          {dict.lawyers.registerLede}
        </p>
      </div>

      <ul className="mt-12 border-t border-ink">
        {lawyers.map((lawyer) => {
          const services = getServicesForLawyer(lawyer);
          return (
            <li key={lawyer.id} className="border-b border-ink/20">
              <Link
                href={localeHref(locale, `/lawyers/${lawyer.slug}`)}
                className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 py-6 md:grid-cols-[auto_1.1fr_1fr_auto] md:gap-x-8"
              >
                <Monogram initials={lawyer.initials[locale]} size="md" />
                <div>
                  <p className="font-display text-[1.55rem] leading-tight transition-colors duration-150 group-hover:text-stamp">
                    {lawyer.name[locale]}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-70">
                    {[lawyer.barNumber, lawyer.specialty[locale]]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[0.875rem] leading-relaxed text-ink-70">
                    {lawyer.experience[locale]}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-70">
                    {services.map((service) => formatClause(service.number)).join(" · ")}
                  </p>
                </div>
                <span className="hidden font-mono text-[0.75rem] tracking-[0.08em] text-ink-70 underline-offset-4 transition-colors duration-150 group-hover:text-stamp group-hover:underline md:inline">
                  {dict.lawyers.caseFile} →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
