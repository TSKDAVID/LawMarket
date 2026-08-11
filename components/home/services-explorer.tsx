"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { CategoryIcon } from "@/components/shared/category-icon";
import { ServiceCard } from "@/components/shared/service-card";
import { PageShell } from "@/components/layout/page-shell";
import type { Category, Lawyer, Service } from "@/data/types";
import {
  localizedCategoryName,
  localizedServiceDescription,
  localizedServiceTitle,
} from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { cn, formatPrice, matchesQuery } from "@/lib/utils";

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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const lawyerById = useMemo(
    () => new Map(lawyers.map((l) => [l.id, l])),
    [lawyers]
  );
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  /*
   * The search answers WHERE THE EYE IS: matches surface in a typeahead
   * panel directly under the input. The grid below is a stable "popular"
   * shelf, filtered only by the category chips.
   */
  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return [];

    return services.filter((service) => {
      const category = categoryById.get(service.categoryId);
      const haystack = [
        localizedServiceTitle(service, locale),
        localizedServiceDescription(service, locale),
        category ? localizedCategoryName(category, locale) : "",
      ].join(" ");

      return matchesQuery(haystack, q);
    });
  }, [services, query, categoryById, locale]);

  const topSuggestions = suggestions.slice(0, 6);
  const showSuggestions = suggestionsOpen && query.trim().length > 0;

  const isFiltering = activeCategory !== null;

  const filteredServices = useMemo(
    () =>
      services.filter(
        (service) => !activeCategory || service.categoryId === activeCategory
      ),
    [services, activeCategory]
  );

  const displayedServices = isFiltering
    ? filteredServices
    : services.filter((s) => s.popular).slice(0, 6);

  return (
    <section className="paper-grain relative overflow-hidden bg-cream pb-10 pt-12 sm:pb-12 sm:pt-16 lg:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero-courthouse.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_35%] opacity-60 sm:opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream from-20% via-cream/85 via-55% to-cream/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/15 via-transparent to-cream" />
      </div>

      <PageShell className="relative">
        {/* Hero: left-aligned against the courthouse; search is the action. */}
        <div className="max-w-2xl">
          <h1 className="animate-fade-up font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-espresso [text-wrap:balance] sm:text-4xl lg:text-5xl">
            {t.rich("heroTitle", {
              accent: (chunks) => (
                <span className="underline decoration-brass/60 decoration-[3px] underline-offset-[7px]">
                  {chunks}
                </span>
              ),
            })}
          </h1>
          <p className="animate-fade-up mt-3.5 max-w-lg font-body text-base text-espresso/55 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <form
            className="animate-fade-up relative z-20 mt-6 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              router.push(q ? `/services?q=${encodeURIComponent(q)}` : "/services");
            }}
            onFocus={() => setSuggestionsOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setSuggestionsOpen(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSuggestionsOpen(false);
            }}
          >
            <Search className="pointer-events-none absolute left-4 top-7 h-5 w-5 -translate-y-1/2 text-espresso/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSuggestionsOpen(true);
              }}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls="hero-search-suggestions"
              aria-autocomplete="list"
              className="h-14 w-full rounded-xl border border-espresso/20 bg-white/95 pl-11 pr-[8.25rem] font-body text-base text-espresso shadow-[0_4px_20px_rgba(28,18,16,0.08)] outline-none backdrop-blur-sm transition-colors placeholder:text-espresso/45 focus:border-burgundy"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-[6.75rem] top-7 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[var(--radius-control)] text-espresso/40 transition-colors hover:bg-espresso/5 hover:text-espresso"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-7 inline-flex h-10 -translate-y-1/2 items-center justify-center rounded-lg bg-burgundy px-5 font-body text-sm font-semibold text-cream transition-colors hover:bg-burgundy-dark"
            >
              {t("searchButton")}
            </button>

            {/* Typeahead: results land where the eye already is. */}
            {showSuggestions && (
              <div
                id="hero-search-suggestions"
                className="absolute inset-x-0 top-[3.75rem] overflow-hidden rounded-xl border border-espresso/15 bg-white shadow-[0_16px_40px_rgba(28,18,16,0.14)]"
              >
                {topSuggestions.length > 0 ? (
                  <ul>
                    {topSuggestions.map((service) => {
                      const category = categoryById.get(service.categoryId);
                      return (
                        <li key={service.id} className="border-b border-espresso/8">
                          <Link
                            href={`/services/${service.slug}`}
                            className="flex items-baseline justify-between gap-4 px-4 py-3 transition-colors hover:bg-cream/70 focus-visible:bg-cream/70"
                          >
                            <span className="min-w-0">
                              <span className="block truncate font-body text-[15px] font-medium text-espresso">
                                {localizedServiceTitle(service, locale)}
                              </span>
                              {category && (
                                <span className="block font-body text-[11px] uppercase tracking-[0.1em] text-espresso/45">
                                  {localizedCategoryName(category, locale)}
                                </span>
                              )}
                            </span>
                            <span className="shrink-0 font-heading text-base font-semibold text-burgundy">
                              {formatPrice(service.price)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-4 font-body text-sm text-espresso/50">
                    {t("noResults")}
                  </p>
                )}
                <button
                  type="submit"
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-body text-sm font-semibold text-burgundy transition-colors hover:bg-cream/70"
                >
                  <span>
                    {t("searchViewAll")}
                    {suggestions.length > 0 ? ` (${suggestions.length})` : ""}
                  </span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            )}
          </form>

          <p className="animate-fade-up mt-3.5 font-body text-[13px] tracking-wide text-espresso/50">
            {t("proofLine", {
              services: services.length,
              lawyers: lawyers.length,
            })}
          </p>

          {/* Attorneys are the rare visitor — a quiet annotation, not a doorway. */}
          <p className="animate-fade-up mt-1.5 font-body text-sm text-espresso/55">
            {t("attorneyPrompt")}{" "}
            <Link
              href="/signup"
              className="font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
            >
              {t("attorneyCta")} &rarr;
            </Link>
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
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

          <div className="mt-4 flex w-full min-w-0 items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  onClick={() => setActiveCategory(active ? null : category.id)}
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

          {displayedServices.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedServices.map((service, index) => {
                const isLead = !isFiltering && index === 0;
                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    category={categoryById.get(service.categoryId)}
                    lawyer={lawyerById.get(service.lawyerId)}
                    featured={isLead}
                    showDescription={isLead}
                    className={isLead ? "sm:col-span-2" : undefined}
                  />
                );
              })}
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
