"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { CategoryIcon } from "@/components/shared/category-icon";
import { ServiceCard } from "@/components/shared/service-card";
import type { Category, Lawyer, Service } from "@/data/types";
import {
  localizedCategoryName,
  localizedServiceDescription,
  localizedServiceTitle,
} from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { cn, matchesQuery } from "@/lib/utils";

type SortOption = "popular" | "price-asc" | "price-desc";

type ServicesCatalogProps = {
  services: Service[];
  categories: Category[];
  lawyers: Lawyer[];
};

function CategoryFilters({
  categories,
  activeCategory,
  onSelect,
  locale,
  allLabel,
  layout,
}: {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
  locale: Locale;
  allLabel: string;
  layout: "scroll" | "sidebar";
}) {
  const isSidebar = layout === "sidebar";

  return (
    <nav
      className={cn(
        isSidebar
          ? "mt-3 flex flex-col gap-0.5"
          : "flex w-full min-w-0 flex-wrap gap-1.5"
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-[var(--radius-control)] px-3 py-2 text-left font-body text-sm font-medium transition-colors",
          activeCategory === null
            ? isSidebar
              ? "bg-burgundy text-cream"
              : "bg-espresso text-cream"
            : "text-espresso/60 hover:bg-espresso/5 hover:text-espresso"
        )}
      >
        {allLabel}
      </button>
      {categories.map((category) => {
        const active = activeCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(active ? null : category.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 font-body text-sm font-medium transition-colors",
              isSidebar && "w-full",
              active
                ? "bg-burgundy text-cream"
                : "text-espresso/60 hover:bg-espresso/5 hover:text-burgundy"
            )}
          >
            <CategoryIcon name={category.icon} className="h-4 w-4" />
            {localizedCategoryName(category, locale)}
          </button>
        );
      })}
    </nav>
  );
}

export function ServicesCatalog({
  services,
  categories,
  lawyers,
}: ServicesCatalogProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const queryParam = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    () => categories.find((c) => c.slug === categorySlug)?.id ?? null,
  );
  const [sort, setSort] = useState<SortOption>("popular");

  // Sync filters when the ?category= / ?q= URL params change —
  // state is adjusted during render instead of inside an effect.
  const [syncedSlug, setSyncedSlug] = useState(categorySlug);
  if (categorySlug !== syncedSlug) {
    setSyncedSlug(categorySlug);
    const match = categorySlug
      ? categories.find((c) => c.slug === categorySlug)
      : undefined;
    if (match) setActiveCategory(match.id);
  }
  const [syncedQuery, setSyncedQuery] = useState(queryParam);
  if (queryParam !== syncedQuery) {
    setSyncedQuery(queryParam);
    setQuery(queryParam);
  }

  const lawyerById = useMemo(
    () => new Map(lawyers.map((l) => [l.id, l])),
    [lawyers]
  );
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const filteredServices = useMemo(() => {
    const q = query.trim();

    const filtered = services.filter((service) => {
      if (activeCategory && service.categoryId !== activeCategory) {
        return false;
      }
      if (!q) return true;

      const category = categoryById.get(service.categoryId);
      const haystack = [
        localizedServiceTitle(service, locale),
        localizedServiceDescription(service, locale),
        category ? localizedCategoryName(category, locale) : "",
      ].join(" ");

      return matchesQuery(haystack, q);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.price - b.price;
    });
  }, [services, query, activeCategory, categoryById, locale, sort]);

  return (
    <div>
      <div className="brand-rule mb-6">
        <h1 className="font-heading text-3xl font-semibold text-espresso sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 font-body text-base text-espresso/50">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-espresso/35" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="h-12 w-full rounded-xl border border-espresso/12 bg-white/90 pl-11 pr-11 font-body text-base text-espresso shadow-sm outline-none transition-colors placeholder:text-espresso/40 focus:border-burgundy"
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

      <div className="mt-4 lg:hidden">
        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          locale={locale}
          allLabel={tCommon("all")}
          layout="scroll"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-body text-sm text-espresso/50">
          {t("resultsCount", { count: filteredServices.length })}
        </p>
        <label className="flex items-center gap-2 font-body text-sm text-espresso/50">
          <span className="sr-only">{t("sortBy")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="max-w-[min(100%,12rem)] rounded-[var(--radius-control)] border border-espresso/12 bg-white px-3 py-1.5 font-body text-sm text-espresso outline-none focus:border-burgundy"
          >
            <option value="popular">{t("sortPopular")}</option>
            <option value="price-asc">{t("sortPriceAsc")}</option>
            <option value="price-desc">{t("sortPriceDesc")}</option>
          </select>
        </label>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-10">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-espresso/45">
              {t("filterByCategory")}
            </p>
            <CategoryFilters
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
              locale={locale}
              allLabel={tCommon("all")}
              layout="sidebar"
            />
          </div>
        </aside>

        <div className="lg:col-span-9">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  category={categoryById.get(service.categoryId)}
                  lawyer={lawyerById.get(service.lawyerId)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-card)] border border-dashed border-espresso/15 bg-white/50 px-6 py-14 text-center">
              <p className="font-body text-espresso/50">{t("noResults")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
