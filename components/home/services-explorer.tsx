"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
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
import { cn, matchesQuery } from "@/lib/utils";
import { formatServicePrice } from "@/lib/service-pricing";
import { sortByPopularity } from "@/data/popularity";
import {
  FindServiceMark,
  PostProblemMark,
} from "@/components/brand/hero-path-marks";
import {
  HeroMediaSlot,
  type HeroMediaSettings,
} from "@/components/home/hero-media-slot";

type ServicesExplorerProps = {
  services: Service[];
  categories: Category[];
  lawyers: Lawyer[];
  postHref: string;
  heroMedia: HeroMediaSettings;
};

type FilterOption = {
  value: string;
  label: string;
};

/*
 * Custom dropdown (W3C select-only combobox pattern) — a native <select>
 * cannot style its open panel, and this design demands a sharp-cornered
 * cream ledger with inverted burgundy hover rows.
 */
function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selected = options[selectedIndex];

  /* Clicking anywhere outside the component closes the panel. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const moveActive = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), options.length - 1);
    setActiveIndex(clamped);
    listRef.current?.children[clamped]?.scrollIntoView({ block: "nearest" });
  };

  const selectAt = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " ", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(activeIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(activeIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveActive(0);
        break;
      case "End":
        e.preventDefault();
        moveActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectAt(activeIndex);
        break;
      case "Escape":
        /* Close only the dropdown — keep the results panel open. */
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className="w-full rounded-none px-4 py-3 text-left outline-none transition-colors hover:bg-espresso/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy sm:px-5"
      >
        <span
          id={labelId}
          className="block font-mono text-[11px] uppercase tracking-[0.16em] text-espresso/65"
        >
          {label}
        </span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate font-body text-sm font-medium text-espresso">
            {selected?.label}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-espresso/60 transition-transform",
              open && "rotate-180"
            )}
          />
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute inset-x-0 top-full z-50 -mt-px max-h-72 overflow-y-auto border border-espresso bg-cream shadow-[4px_4px_0_0_rgba(28,18,16,0.15)] [scrollbar-color:var(--color-espresso)_transparent] [scrollbar-width:thin]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value || "__all"}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => selectAt(index)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 border-b border-espresso/15 px-4 py-3 font-body text-sm leading-snug transition-colors last:border-b-0",
                  isActive
                    ? "bg-burgundy text-cream"
                    : "bg-transparent text-espresso"
                )}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 bg-current"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ServicesExplorer({
  services,
  categories,
  lawyers,
  postHref,
  heroMedia,
}: ServicesExplorerProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tLawyers = useTranslations("lawyers");
  const tServices = useTranslations("services");
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /* Quick filters — practice area and city. */
  const [heroCategory, setHeroCategory] = useState("");
  const [heroCity, setHeroCity] = useState("");

  const lawyerById = useMemo(
    () => new Map(lawyers.map((l) => [l.id, l])),
    [lawyers]
  );
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );
  const cities = useMemo(
    () => Array.from(new Set(lawyers.map((l) => l.city))),
    [lawyers]
  );

  /*
   * The search answers WHERE THE EYE IS: matches surface in a panel
   * directly under the search console. Quick filters work without typing —
   * picking a practice area or city refines the list on the fly.
   */
  const filtersActive = heroCategory !== "" || heroCity !== "";

  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q && !filtersActive) return [];

    return services.filter((service) => {
      if (heroCategory && service.categoryId !== heroCategory) return false;
      if (heroCity && lawyerById.get(service.lawyerId)?.city !== heroCity) {
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
  }, [
    services,
    query,
    filtersActive,
    heroCategory,
    heroCity,
    lawyerById,
    categoryById,
    locale,
  ]);

  const topSuggestions = suggestions.slice(0, 6);
  const showSuggestions =
    suggestionsOpen && (query.trim().length > 0 || filtersActive);

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
    : sortByPopularity(services).slice(0, 6);

  const submitSearch = () => {
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set("q", q);
    const categorySlug = heroCategory
      ? categoryById.get(heroCategory)?.slug
      : undefined;
    if (categorySlug) params.set("category", categorySlug);
    const qs = params.toString();
    router.push(qs ? `/services?${qs}` : "/services");
  };

  return (
    <section className="paper-grain bg-cream">
      {/* ── Hero: a ruled legal document — every zone separated by 1px lines ── */}
      <div className="border-b border-espresso/20">
        <PageShell>
          <div className="border-x border-espresso/15">
            {/* Row 1 — file header: tagline left, attorney annotation right */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-espresso/15 px-4 py-3 sm:px-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-espresso/70">
                {tCommon("tagline")}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-espresso/70">
                {t("attorneyPrompt")}{" "}
                <Link
                  href="/signup"
                  className="text-burgundy underline decoration-1 underline-offset-4 transition-colors hover:text-burgundy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
                >
                  {t("attorneyCta")} &rarr;
                </Link>
              </p>
            </div>

            {/* Row 2 — headline left, media slot right (fixed text slots, not fixed hero height) */}
            <div className="border-b border-espresso/15 lg:grid lg:grid-cols-2 lg:items-stretch lg:min-h-[26rem] xl:min-h-[30rem]">
              <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <h1
                  className="animate-fade-up line-clamp-2 max-w-2xl min-h-[4.75rem] font-heading text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-espresso sm:min-h-[5.5rem]"
                >
                  {t.rich("heroTitle", {
                    accent: (chunks) => <>{chunks}</>,
                  })}
                </h1>
                <p
                  className="animate-fade-up mt-5 max-w-lg line-clamp-3 min-h-[4.25rem] font-body text-base leading-relaxed text-espresso/75 sm:min-h-[5rem] sm:text-lg"
                >
                  {t("heroSubtitle")}
                </p>
              </div>

              <HeroMediaSlot settings={heroMedia} />
            </div>

            {/* Row 3 — path buttons, full hero width */}
            <div className="border-b border-espresso/15 px-4 py-6 sm:px-6 sm:py-8">
              <div className="animate-fade-up grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Link
                  href="/services"
                  className="group flex min-h-[4.75rem] items-center gap-3.5 border-2 border-espresso bg-burgundy px-4 py-3.5 text-cream shadow-[5px_5px_0_0_var(--color-espresso)] transition-[transform,box-shadow,background-color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-espresso hover:shadow-[7px_7px_0_0_var(--color-espresso)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--color-espresso)] sm:min-h-[5.25rem] sm:gap-4 sm:px-5"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-current/35 sm:h-12 sm:w-12"
                    aria-hidden="true"
                  >
                    <FindServiceMark className="h-6 w-6 sm:h-7 sm:w-7" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block font-mono text-base tracking-wide sm:text-lg">
                      {t("findService")}
                    </span>
                    <span className="mt-1 block font-body text-xs font-normal leading-snug text-cream/80 sm:text-sm">
                      {t("findServiceHint")}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href={postHref}
                  className="group flex min-h-[4.75rem] items-center gap-3.5 border-2 border-burgundy bg-cream px-4 py-3.5 text-burgundy shadow-[5px_5px_0_0_var(--color-burgundy)] transition-[transform,box-shadow,background-color,color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-burgundy hover:text-cream hover:shadow-[7px_7px_0_0_var(--color-espresso)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--color-burgundy)] sm:min-h-[5.25rem] sm:gap-4 sm:px-5"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-current/35 sm:h-12 sm:w-12"
                    aria-hidden="true"
                  >
                    <PostProblemMark className="h-6 w-6 sm:h-7 sm:w-7" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block font-mono text-base tracking-wide sm:text-lg">
                      {t("postProblem")}
                    </span>
                    <span className="mt-1 block font-body text-xs font-normal leading-snug text-espresso/60 group-hover:text-cream/80 sm:text-sm">
                      {t("postProblemHint")}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Row 4 — search console, full hero width */}
            <div className="border-t border-burgundy/15 bg-burgundy-tint/35 px-4 py-8 sm:px-6 sm:py-10">
              <p className="animate-fade-up mb-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-burgundy sm:text-[13px]">
                {t("proofLine", {
                  services: services.length,
                  lawyers: lawyers.length,
                })}
              </p>

              <form
                className="animate-fade-up relative z-20"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitSearch();
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
                  <div
                    className="overflow-hidden border-2 border-burgundy/20 bg-white shadow-[0_16px_48px_-20px_rgba(107,20,35,0.28)] ring-1 ring-espresso/5"
                  >
                    <div className="flex items-stretch border-b border-espresso/10 bg-parchment/60">
                      <div
                        className="flex shrink-0 items-center pl-4 sm:pl-5"
                        aria-hidden="true"
                      >
                        <Search className="h-5 w-5 text-burgundy sm:h-6 sm:w-6" />
                      </div>
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
                        className="h-[4.25rem] w-full min-w-0 border-0 bg-transparent pl-2 pr-2 font-body text-base text-espresso outline-none placeholder:text-espresso/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy sm:h-[4.75rem] sm:pl-3 sm:text-lg"
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          aria-label="Clear search"
                          className="flex w-11 shrink-0 items-center justify-center text-espresso/50 transition-colors hover:text-espresso focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex h-[4.25rem] w-[4.75rem] shrink-0 flex-col items-center justify-center gap-1 border-l border-burgundy/25 bg-burgundy text-cream transition-[background-color,transform] duration-200 hover:bg-espresso sm:h-[4.75rem] sm:w-24 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream"
                      >
                        <Search className="h-5 w-5" aria-hidden="true" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] sm:text-[10px]">
                          {t("searchButton")}
                        </span>
                      </button>
                    </div>

                    {/* Quick filters — choose on the fly, no typing required */}
                    <div className="grid grid-cols-1 divide-y divide-espresso/12 border-t border-espresso/10 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                      <FilterDropdown
                        label={tLawyers("filterByPracticeArea")}
                        value={heroCategory}
                        options={[
                          { value: "", label: tCommon("all") },
                          ...categories.map((category) => ({
                            value: category.id,
                            label: localizedCategoryName(category, locale),
                          })),
                        ]}
                        onChange={(v) => {
                          setHeroCategory(v);
                          setSuggestionsOpen(true);
                        }}
                      />
                      <FilterDropdown
                        label={tLawyers("filterByCity")}
                        value={heroCity}
                        options={[
                          { value: "", label: tCommon("all") },
                          ...cities.map((city) => ({
                            value: city,
                            label: city,
                          })),
                        ]}
                        onChange={(v) => {
                          setHeroCity(v);
                          setSuggestionsOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* Results ledger: lands where the eye already is */}
                  {showSuggestions && (
                    <div
                      id="hero-search-suggestions"
                      className="absolute inset-x-0 top-full z-30 -mt-px overflow-hidden border-2 border-burgundy/20 bg-white shadow-[0_20px_48px_-16px_rgba(28,18,16,0.2)] ring-1 ring-burgundy/10"
                    >
                      {topSuggestions.length > 0 ? (
                        <ul className="divide-y divide-espresso/10">
                          {topSuggestions.map((service) => {
                            const category = categoryById.get(
                              service.categoryId
                            );
                            return (
                              <li key={service.id}>
                                <Link
                                  href={`/services/${service.slug}`}
                                  className="flex items-baseline justify-between gap-4 px-4 py-3 transition-colors hover:bg-cream/70 focus-visible:bg-cream/70 sm:px-5"
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate font-body text-[15px] font-medium text-espresso">
                                      {localizedServiceTitle(service, locale)}
                                    </span>
                                    {category && (
                                      <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-espresso/60">
                                        {localizedCategoryName(
                                          category,
                                          locale
                                        )}
                                      </span>
                                    )}
                                  </span>
                                  <span className="shrink-0 font-mono text-sm font-semibold text-burgundy">
                                    {formatServicePrice(service, locale)}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="px-4 py-4 font-body text-sm text-espresso/65 sm:px-5">
                          {t("noResults")}
                        </p>
                      )}
                      <button
                        type="submit"
                        className="flex w-full items-center justify-between border-t border-espresso/15 px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.14em] text-burgundy transition-colors hover:bg-cream/70 focus-visible:bg-cream/70 sm:px-5"
                      >
                        <span>
                          {t("searchViewAll")}
                          {suggestions.length > 0
                            ? ` (${suggestions.length})`
                            : ""}
                        </span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  )}
                </form>
            </div>
          </div>
        </PageShell>
      </div>

      {/* ── Popular services (unchanged) ── */}
      <PageShell className="pb-10 sm:pb-12">
        <div className="pt-10 sm:pt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="brand-rule">
              <h2 className="font-heading text-2xl font-semibold text-espresso sm:text-3xl">
                {isFiltering ? t("searchResultsTitle") : t("popularServicesTitle")}
              </h2>
              <p className="mt-1 font-body text-sm text-espresso/65">
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

          {/* Filter ledger: one contiguous ruled strip, options split by 1px verticals */}
          <div className="no-scrollbar mt-5 w-full overflow-x-auto">
            <div className="flex w-max min-w-full items-stretch divide-x divide-espresso/20 border-y border-espresso">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                aria-pressed={activeCategory === null}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-none px-4 py-2.5 font-body text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy",
                  activeCategory === null
                    ? "bg-espresso text-cream"
                    : "text-espresso/75 hover:bg-espresso/5 hover:text-espresso"
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
                    aria-pressed={active}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-none px-4 py-2.5 font-body text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy",
                      active
                        ? "bg-espresso text-cream"
                        : "text-espresso/75 hover:bg-espresso/5 hover:text-espresso"
                    )}
                  >
                    <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                    {localizedCategoryName(category, locale)}
                  </button>
                );
              })}
            </div>
          </div>

          {displayedServices.length > 0 ? (
            <div className="card-grid mt-5">
              {displayedServices.map((service, index) => {
                const isLead = !isFiltering && index === 0;
                const cat = categoryById.get(service.categoryId);
                return (
                  <ServiceCard
                    key={service.id}
                    category={
                      cat ? localizedCategoryName(cat, locale) : ""
                    }
                    title={localizedServiceTitle(service, locale)}
                    description={localizedServiceDescription(service, locale)}
                    price={formatServicePrice(service, locale)}
                    hasFreeConsultation
                    detailsUrl={`/services/${service.slug}`}
                    index={index + 1}
                    icon={cat?.icon}
                    className={isLead ? "sm:col-span-2" : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-none border border-espresso/20 bg-parchment px-6 py-14 text-center">
              <p className="font-body text-espresso/65">{t("noResults")}</p>
            </div>
          )}
        </div>
      </PageShell>
    </section>
  );
}
