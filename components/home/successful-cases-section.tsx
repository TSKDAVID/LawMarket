"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Category, PublishedCase } from "@/data/types";
import {
  localizedCaseDescription,
  localizedCaseOutcome,
  localizedCaseTitle,
  localizedCategoryName,
} from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { PageShell } from "@/components/layout/page-shell";
import { CmsStyledText } from "@/components/cms/cms-style-provider";
import { cn } from "@/lib/utils";

type SuccessfulCasesSectionProps = {
  cases: PublishedCase[];
  categories: Category[];
};

function CaseYear({ year }: { year: number | null }) {
  if (!year) return null;
  return (
    <span className="font-mono text-xs tracking-[0.14em] text-espresso/55">
      {year}
    </span>
  );
}

export function SuccessfulCasesSection({
  cases,
  categories,
}: SuccessfulCasesSectionProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const [featured, ...rest] = cases;
  const secondary = rest.slice(0, 4);

  if (!featured) return null;

  const featuredCategory = featured.categoryId
    ? categoryById.get(featured.categoryId)
    : undefined;

  return (
    <section className="bg-cream py-12 sm:py-14">
      <PageShell>
        <div className="max-w-xl">
          <CmsStyledText
            contentKey="home.casesTitle"
            as="h2"
            className="font-heading text-2xl font-semibold text-espresso sm:text-3xl"
          >
            {t("casesTitle")}
          </CmsStyledText>
          <CmsStyledText
            contentKey="home.casesSubtitle"
            as="p"
            className="mt-2 font-body text-sm text-espresso/65"
          >
            {t("casesSubtitle")}
          </CmsStyledText>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="rounded-none border border-espresso bg-parchment p-8 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                {featuredCategory && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-burgundy">
                    {localizedCategoryName(featuredCategory, locale)}
                  </p>
                )}
                <CaseYear year={featured.year} />
              </div>
              <p className="mt-4 font-heading text-xl font-medium leading-snug text-espresso sm:text-2xl">
                {localizedCaseTitle(featured, locale)}
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-espresso/80">
                {localizedCaseDescription(featured, locale)}
              </p>
              {localizedCaseOutcome(featured, locale) && (
                <p className="mt-4 border-t border-espresso/15 pt-4 font-body text-sm text-espresso/70">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-espresso/50">
                    {t("caseOutcomeLabel")}
                  </span>
                  <span className="mt-1 block">
                    {localizedCaseOutcome(featured, locale)}
                  </span>
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-espresso/20 pt-6">
                <p className="font-heading text-sm font-semibold text-espresso">
                  {featured.lawyerName}
                </p>
                <Link
                  href={`/lawyers/${featured.lawyerSlug}`}
                  className="font-mono text-xs uppercase tracking-[0.16em] text-burgundy transition-colors hover:text-burgundy-dark"
                >
                  {t("viewLawyerProfile")} &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {secondary.map((item, index) => {
              const category = item.categoryId
                ? categoryById.get(item.categoryId)
                : undefined;
              return (
                <div
                  key={item.id}
                  className={cn("py-5", index > 0 && "border-t border-espresso/25")}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-heading text-base font-semibold text-espresso">
                      {localizedCaseTitle(item, locale)}
                    </p>
                    <CaseYear year={item.year} />
                  </div>
                  <p className="mt-2 font-body text-[15px] leading-relaxed text-espresso/85 line-clamp-3">
                    {localizedCaseDescription(item, locale)}
                  </p>
                  <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest">
                      <span className="font-semibold text-espresso">
                        {item.lawyerName}
                      </span>
                      {category && (
                        <span className="text-espresso/70">
                          {localizedCategoryName(category, locale)}
                        </span>
                      )}
                      <Link
                        href={`/lawyers/${item.lawyerSlug}`}
                        className="text-burgundy transition-colors hover:text-burgundy-dark"
                      >
                        {t("viewLawyerProfile")} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageShell>
    </section>
  );
}
