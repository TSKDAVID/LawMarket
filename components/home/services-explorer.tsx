"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CategoryIcon } from "@/components/shared/category-icon";
import { ServiceCard } from "@/components/shared/service-card";
import { LogoMark } from "@/components/brand/logo-mark";
import { PageShell } from "@/components/layout/page-shell";
import type { Category, Lawyer, Service } from "@/data/types";
import {
  localizedCategoryName,
  localizedServiceDescription,
  localizedServiceTitle,
} from "@/data/localize";
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
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const lawyerById = useMemo(
    () => new Map(lawyers.map((l) => [l.id, l])),
    [lawyers]
  );
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const isFiltering = query.trim().length > 0 || activeCategory !== null;

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();

    return services.filter((service) => {
      if (activeCategory && service.categoryId !== activeCategory) {
        return false;
      }
      if (!q) return true;

      const category = categoryById.get(service.categoryId);
      const haystack = [
        localizedServiceTitle(service, locale),
        localizedServiceDescription(service, locale),
        category ? localizedCategoryName(category, locale) : "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [services, query, activeCategory, categoryById, locale]);

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
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <LogoMark className="h-5 w-5 text-burgundy" />
            <span className="font-body text-xs font-medium uppercase tracking-widest text-espresso/45">
              {tCommon("tagline")}
            </span>
          </div>
          <h1 className="animate-fade-up font-heading text-3xl font-semibold leading-[1.08] tracking-tight text-espresso sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="animate-fade-up mt-2.5 max-w-lg font-body text-base text-espresso/50 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="animate-fade-up relative mt-4 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-espresso/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="h-12 w-full rounded-xl border border-espresso/12 bg-white/90 pl-11 pr-11 font-body text-base text-espresso shadow-[0_4px_20px_rgba(28,18,16,0.06)] outline-none backdrop-blur-sm transition-colors placeholder:text-espresso/40 focus:border-burgundy"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[var(--radius-control)] text-espresso/40 transition-colors hover:bg-espresso/5 hover:text-espresso"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
