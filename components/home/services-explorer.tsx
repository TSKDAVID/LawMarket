"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CategoryIcon } from "@/components/shared/category-icon";
import { ServiceCard } from "@/components/shared/service-card";
import { PageShell } from "@/components/layout/page-shell";
import type { Category, Lawyer, Service } from "@/data/types";
import { localizedCategoryName } from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type ServicesExplorerProps = {
  services: Service[];
  categories: Category[];
  lawyers: Lawyer[];
};

export function ServicesExplorer({
  services,
  categories,
  lawyers,
}: ServicesExplorerProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tServices = useTranslations("services");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const lawyerById = useMemo(
    () => new Map(lawyers.map((l) => [l.id, l])),
    [lawyers]
  );
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const isFiltering = activeCategory !== null;

  const filteredServices = useMemo(
    () =>
      services.filter(
        (service) => !activeCategory || service.categoryId === activeCategory,
      ),
    [services, activeCategory],
  );

  const displayedServices = isFiltering
    ? filteredServices
    : services.filter((s) => s.popular).slice(0, 6);

  return (
    <section className="paper-grain relative overflow-hidden bg-cream pb-10 pt-7 sm:pb-12 sm:pt-9">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero-courthouse.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_35%] opacity-45 sm:opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream from-10% via-cream/92 via-50% to-cream/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/20 via-transparent to-cream" />
      </div>

      <PageShell className="relative">
        {/* Hero: one tagline, two doorways — clients and lawyers. */}
        <div className="mx-auto max-w-3xl pt-2 text-center">
          <h1 className="animate-fade-up font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-espresso sm:text-4xl">
            {t("heroTagline")}
          </h1>
        </div>

        <div className="animate-fade-up mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-start rounded-[var(--radius-card)] border border-espresso/12 bg-white/85 p-6 shadow-[0_4px_20px_rgba(28,18,16,0.06)] backdrop-blur-sm">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-burgundy">
              {t("forClientsLabel")}
            </span>
            <p className="mt-2 flex-1 font-body text-base text-espresso/70">
              {t("forClientsText")}
            </p>
            <Link
              href="/lawyers"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-burgundy px-6 font-body text-sm font-semibold text-cream transition-colors hover:bg-burgundy-dark"
            >
              {t("findLawyer")}
            </Link>
          </div>

          <div className="flex flex-col items-start rounded-[var(--radius-card)] border border-espresso/12 bg-white/85 p-6 shadow-[0_4px_20px_rgba(28,18,16,0.06)] backdrop-blur-sm">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-brass">
              {t("forLawyersLabel")}
            </span>
            <p className="mt-2 flex-1 font-body text-base text-espresso/70">
              {t("forLawyersText")}
            </p>
            <Link
              href="/signup"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-espresso px-6 font-body text-sm font-semibold text-cream transition-colors hover:bg-espresso-hover"
            >
              {t("applyAttorney")}
            </Link>
          </div>
        </div>

        <div className="mt-4 flex w-full min-w-0 flex-wrap items-center gap-1.5 border-b border-espresso/8 pb-3">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] px-3 py-1.5 font-body text-sm font-medium transition-colors",
              activeCategory === null
                ? "bg-espresso text-cream"
                : "text-espresso/60 hover:bg-espresso/5 hover:text-espresso"
            )}
          >
            {tCommon("all")}
          </button>
          {categories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveCategory(active ? null : category.id)
                }
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] px-3 py-1.5 font-body text-sm font-medium transition-colors",
                  active
                    ? "bg-burgundy text-cream"
                    : "text-espresso/60 hover:bg-espresso/5 hover:text-burgundy"
                )}
              >
                <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                {localizedCategoryName(category, locale)}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="brand-rule">
              <h2 className="font-heading text-2xl font-semibold text-espresso sm:text-3xl">
                {isFiltering ? t("searchResultsTitle") : t("popularServicesTitle")}
              </h2>
              <p className="mt-1 font-body text-sm text-espresso/50">
                {isFiltering
                  ? tServices("resultsCount", { count: filteredServices.length })
                  : t("popularServicesSubtitle")}
              </p>
            </div>
            {!isFiltering && (
              <Link
                href="/services"
                className="font-body text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
              >
                {t("viewAllServices")} &rarr;
              </Link>
            )}
          </div>

          {displayedServices.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  category={categoryById.get(service.categoryId)}
                  lawyer={lawyerById.get(service.lawyerId)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[var(--radius-card)] border border-dashed border-espresso/15 bg-white/50 px-6 py-14 text-center">
              <p className="font-body text-espresso/50">{t("noResults")}</p>
            </div>
          )}
        </div>
      </PageShell>
    </section>
  );
}
