"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/select";
import { LawyerCard } from "@/components/shared/lawyer-card";
import type { Category, Lawyer } from "@/data/types";
import type { LawyerRating } from "@/data/queries";
import { localizedCategoryName, localizedLawyerHeadline } from "@/data/localize";
import type { Locale } from "@/i18n/routing";

type LawyersDirectoryProps = {
  lawyers: Lawyer[];
  categories: Category[];
  cities: string[];
  languages: string[];
  ratings: Record<string, LawyerRating>;
};

export function LawyersDirectory({
  lawyers,
  categories,
  cities,
  languages,
  ratings,
}: LawyersDirectoryProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("lawyers");
  const [query, setQuery] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");

  const hasActiveFilters =
    query.trim().length > 0 || practiceArea || city || language;

  const filteredLawyers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return lawyers.filter((lawyer) => {
      if (practiceArea && !lawyer.practiceAreaIds.includes(practiceArea)) {
        return false;
      }
      if (city && lawyer.city !== city) return false;
      if (language && !lawyer.languages.includes(language)) return false;

      if (!q) return true;
      const haystack = [
        lawyer.name,
        localizedLawyerHeadline(lawyer, locale),
        lawyer.city,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [lawyers, query, practiceArea, city, language, locale]);

  function resetFilters() {
    setQuery("");
    setPracticeArea("");
    setCity("");
    setLanguage("");
  }

  const filterPanel = (
    <div className="space-y-4">
      <Select
        value={practiceArea}
        onChange={(e) => setPracticeArea(e.target.value)}
        aria-label={t("filterByPracticeArea")}
      >
        <option value="">{t("filterByPracticeArea")}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {localizedCategoryName(category, locale)}
          </option>
        ))}
      </Select>

      <Select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        aria-label={t("filterByCity")}
      >
        <option value="">{t("filterByCity")}</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t("filterByLanguage")}
      >
        <option value="">{t("filterByLanguage")}</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </Select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-burgundy transition-colors hover:text-burgundy-dark"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("reset")}
        </button>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24 rounded-[var(--radius-card)] border border-espresso/12 bg-white/80 p-5">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-espresso/45">
            {t("filtersTitle")}
          </p>
          <div className="mt-4">{filterPanel}</div>
        </div>
      </aside>

      <div className="lg:col-span-9">
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

        <div className="mt-4 rounded-[var(--radius-card)] border border-espresso/12 bg-white/80 p-4 lg:hidden">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-espresso/45">
            {t("filtersTitle")}
          </p>
          <div className="mt-3">{filterPanel}</div>
        </div>

        <p className="mt-6 font-body text-sm text-espresso/50 lg:mt-6">
          {t("resultsCount", { count: filteredLawyers.length })}
        </p>

        {filteredLawyers.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                rating={ratings[lawyer.id]}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-espresso/15 bg-white/50 px-6 py-14 text-center">
            <p className="font-body text-espresso/50">{t("noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
