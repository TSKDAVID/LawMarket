"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ServiceEntry } from "@/components/ServiceEntry";
import { PracticeIcon } from "@/components/PracticeIcon";
import type { Locale } from "@/schemas";

/**
 * The homepage services ledger with real-time search (BRAND.md §4).
 * Zero dependencies: a plain filtered array over the 15 services.
 * Filtering is instant and client-side; the reserved min-height keeps the
 * page length constant so nothing below the ledger jumps while typing.
 */

export interface LedgerItem {
  slug: string;
  clause: string; // "§ 01"
  name: string; // active-locale name
  description: string; // active-locale brief
  lawyer?: string; // assigned lawyer, active locale
  price: string; // "₾ 250"
  searchable: string; // lowercased ka+en names, descriptions, area names
}

export interface LedgerGroup {
  id: string;
  heading: string; // active-locale area name
  headingLatin: string | null; // "CIVIL LAW" apparatus shown on ka pages
  range: string; // "§ 01 — § 12"
  items: LedgerItem[];
}

export interface LedgerStrings {
  searchLabel: string;
  searchPlaceholder: string;
  clear: string;
  countAnnouncement: string; // "{count} …"
  emptyTitle: string;
  emptyAction: string;
  guaranteedMark: string;
  view: string;
}

export function LedgerSearch({
  groups,
  strings,
  locale,
  serviceHrefPrefix,
}: {
  groups: LedgerGroup[];
  strings: LedgerStrings;
  locale: Locale;
  serviceHrefPrefix: string; // "/services" or "/en/services"
}) {
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef("");
  const [minHeight, setMinHeight] = useState<number>();

  useEffect(() => {
    queryRef.current = query;
  }, [query]);
  const total = useMemo(
    () => groups.reduce((sum, group) => sum + group.items.length, 0),
    [groups],
  );

  // Reserve the full ledger height once rendered — zero layout jump.
  useEffect(() => {
    const measure = () => {
      if (queryRef.current === "" && listRef.current) {
        setMinHeight(listRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const needle = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!needle) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.searchable.includes(needle)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, needle]);

  const shown = filtered.reduce((sum, group) => sum + group.items.length, 0);
  const announcement = strings.countAnnouncement.replace("{count}", String(shown));

  return (
    <div>
      <div className="grid grid-cols-12 items-end gap-x-5">
        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <label
            htmlFor="ledger-search"
            className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70"
          >
            {strings.searchLabel}
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="ledger-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              lang={locale}
              placeholder={strings.searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
              }}
              className="rule-field text-[1.0625rem] [&::-webkit-search-cancel-button]:appearance-none"
            />
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-[0.75rem] tabular-nums tracking-[0.08em] text-ink-70"
            >
              {String(shown).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={strings.clear}
              className={`flex h-11 w-9 shrink-0 items-center justify-center font-mono text-[1.2rem] leading-none text-ink-70 transition-[color,opacity] duration-150 ease-out hover:text-stamp ${
                query ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div
        ref={listRef}
        style={minHeight ? { minHeight } : undefined}
        className="mt-8"
      >
        {filtered.length === 0 ? (
          <div className="border-t border-ink/25 py-12">
            <p className="text-ink-70">
              {strings.emptyTitle}{" "}
              <button
                type="button"
                onClick={() => setQuery("")}
                className="font-mono text-[0.8125rem] tracking-[0.06em] text-stamp underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-stamp-press"
              >
                {strings.emptyAction}
              </button>
            </p>
          </div>
        ) : (
          filtered.map((group) => (
            <section key={group.id} aria-label={group.heading} className="mb-9 last:mb-0">
              <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-2">
                <h3 className="flex items-baseline gap-2.5 text-[0.9375rem] tracking-[0.04em]">
                  <PracticeIcon areaId={group.id} className="self-center text-ink" />
                  <span>{group.heading}</span>
                  {group.headingLatin ? (
                    <span className="hidden font-mono text-[0.6875rem] tracking-eyebrow text-ink-70 sm:inline">
                      · {group.headingLatin}
                    </span>
                  ) : null}
                </h3>
                <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-70">
                  {group.range}
                </span>
              </div>
              <ul className="divide-y divide-ink/15">
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <ServiceEntry
                      href={`${serviceHrefPrefix}/${item.slug}`}
                      clause={item.clause}
                      name={item.name}
                      description={item.description}
                      lawyer={item.lawyer}
                      price={item.price}
                      guaranteedLabel={strings.guaranteedMark}
                      viewLabel={strings.view}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
