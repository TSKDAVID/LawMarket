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
import { ChevronDown, Search, X } from "lucide-react";
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
          className="block font-mono text-[10px] uppercase tracking-[0.16em] text-espresso/65"
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
    : services.filter((s) => s.popular).slice(0, 6);

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
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-espresso/70">
                {tCommon("tagline")}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-espresso/70">
                {t("attorneyPrompt")}{" "}
                <Link
                  href="/signup"
                  className="text-burgundy underline decoration-1 underline-offset-4 transition-colors hover:text-burgundy-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
                >
                  {t("attorneyCta")} &rarr;
                </Link>
              </p>
            </div>

            {/* Row 2 — the oversized serif headline */}
            <div className="border-b border-espresso/15 px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
              {/* One uniform ink — burgundy is reserved for interactivity. */}
              <h1 className="animate-fade-up font-heading text-[clamp(2.75rem,7.2vw,6.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-espresso">
                {t.rich("heroTitle", {
                  accent: (chunks) => <>{chunks}</>,
                })}
              </h1>
              <p className="animate-fade-up mt-6 max-w-xl border-l border-espresso/25 pl-4 font-body text-base text-espresso/75 sm:text-lg">
                {t("heroSubtitle")}
              </p>
            </div>

            {/* Row 3 — search console */}
            <div className="px-4 py-8 sm:px-6 sm:py-10">
              <div className="lg:w-[68%]">
                <p className="animate-fade-up mb-3 font-mono text-xs uppercase tracking-[0.16em] text-espresso/75">
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
                  <div className="border border-espresso bg-parchment">
                    <div className="flex items-stretch">
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
                        className="h-16 w-full min-w-0 rounded-none border-0 bg-transparent px-4 font-body text-base text-espresso outline-none placeholder:text-espresso/55 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy sm:px-5 sm:text-lg"
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          aria-label="Clear search"
                          className="flex w-10 shrink-0 items-center justify-center rounded-none text-espresso/55 transition-colors hover:text-espresso focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      {/* The seal: a blocky square stamped onto the input's right edge */}
                      <button
                        type="submit"
                        className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-none border-l border-espresso bg-burgundy text-cream transition-colors hover:bg-espresso focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream"
                      >
                        <Search className="h-5 w-5" aria-hidden="true" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em]">
                          {t("searchButton")}
                        </span>
                      </button>
                    </div>

                    {/* Quick filters — choose on the fly, no typing required */}
                    <div className="grid grid-cols-1 divide-y divide-espresso/20 border-t border-espresso sm:grid-cols-2 sm:divide-x sm:divide-y-0">
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
                      className="absolute inset-x-0 top-full z-30 -mt-px border border-espresso bg-white shadow-[0_16px_40px_rgba(28,18,16,0.14)]"
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
                                    {formatPrice(service.price)}
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
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    price={service.price}
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
