"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/shared/avatar";
import { PageShell } from "@/components/layout/page-shell";
import type { Lawyer } from "@/data/types";
import { localizedLawyerHeadline } from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type TrustBandProps = {
  lawyers: Lawyer[];
};

export function TrustBand({ lawyers }: TrustBandProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");

  /* Track the id rather than the object so the selection survives any
     reordering of the roster it was picked from. */
  const [activeId, setActiveId] = useState(() => lawyers[0]?.id);
  const active = lawyers.find((l) => l.id === activeId) ?? lawyers[0];

  /* One full row at every breakpoint — a wrapped remainder reads as a broken
     grid rather than an index. The rest live behind "browse all lawyers". */
  const roster = lawyers.slice(0, 6);

  if (!active) return null;

  return (
    <section className="bg-espresso py-12 sm:py-14">
      <PageShell>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="lg:max-w-md">
            <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">
              {t("verifiedLawyersTitle")}
            </h2>
            <p className="mt-2 font-body text-sm text-cream/50 sm:text-base">
              {t("verifiedLawyersSubtitle")}
            </p>
            <Link
              href="/lawyers"
              /* Burgundy ink on espresso measures ~1.4:1, so the accent moves
                 to the rule and the label stays cream. */
              className="mt-4 inline-block font-body text-sm font-semibold text-cream underline decoration-burgundy decoration-2 underline-offset-4 transition-colors hover:decoration-cream"
            >
              {t("browseAllLawyers", { count: lawyers.length })} &rarr;
            </Link>
          </div>

          {/*
           * Master view — personnel file for whichever plate is selected below:
           * one cream frame, three ruled zones (mounted photograph, identity
           * block, action strip). Capped at 16rem so the 3:4 plate stays
           * passport-sized instead of filling a phone screen.
           */}
          <Link
            href={`/lawyers/${active.slug}`}
            className="group flex w-full max-w-[16rem] shrink-0 flex-col rounded-none border border-cream/70 bg-cream/5 transition-colors hover:border-burgundy"
          >
            <div className="border-b border-cream/70 p-3">
              <Avatar
                initials={active.initials}
                color={active.avatarColor}
                photoUrl={active.photoUrl}
                alt={active.name}
                size="xl"
                className="aspect-[3/4] h-auto w-full border border-cream/70 transition-colors group-hover:border-burgundy"
              />
            </div>
            <div className="border-b border-cream/70 px-4 py-3">
              <p className="font-heading text-lg font-semibold leading-tight text-cream">
                {active.name}
              </p>
              <p className="mt-1 font-body text-sm text-cream/50">
                {localizedLawyerHeadline(active, locale)}
              </p>
            </div>
            <span className="px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70 transition-colors group-hover:bg-burgundy group-hover:text-cream">
              {t("viewLawyerProfile")} &rarr;
            </span>
          </Link>
        </div>

        {/*
         * Control index — every plate selects the file above. Ruled top and
         * bottom (1px solid) so the row locks into the ledger. Exactly ONE
         * row at every breakpoint: below lg the strip scrolls horizontally
         * instead of wrapping into a broken second row; at lg it is the same
         * six-column grid as before.
         */}
        <ul className="no-scrollbar mt-8 flex gap-4 overflow-x-auto border-y border-cream/25 py-8 lg:grid lg:grid-cols-6 lg:gap-5">
          {roster.map((lawyer) => {
            const isActive = lawyer.id === active.id;

            return (
              <li key={lawyer.id} className="w-28 shrink-0 sm:w-32 lg:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveId(lawyer.id)}
                  aria-pressed={isActive}
                  title={localizedLawyerHeadline(lawyer, locale)}
                  className="group flex w-full cursor-pointer flex-col gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                >
                  {/* Strict rectangle: 3:4 plate, 1px border; the active
                      plate carries a hard 2px burgundy outline drawn inward
                      along the sharp corners — no rings, no box growth. */}
                  <Avatar
                    initials={lawyer.initials}
                    color={lawyer.avatarColor}
                    photoUrl={lawyer.photoUrl}
                    alt={lawyer.name}
                    size="lg"
                    className={cn(
                      "aspect-[3/4] h-auto w-full rounded-none border transition-colors duration-150",
                      isActive
                        ? "-outline-offset-2 border-burgundy outline-2 outline-burgundy"
                        : "border-cream/70 group-hover:border-burgundy"
                    )}
                  />
                  <p
                    className={cn(
                      "font-body text-xs font-medium leading-tight transition-colors sm:text-sm",
                      isActive
                        ? "text-cream"
                        : "text-cream/80 group-hover:text-cream"
                    )}
                  >
                    {lawyer.name}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </PageShell>
    </section>
  );
}
