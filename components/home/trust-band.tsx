"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/shared/avatar";
import { PageShell } from "@/components/layout/page-shell";
import { CmsStyledText } from "@/components/cms/cms-style-provider";
import type { Lawyer } from "@/data/types";
import { localizedLawyerHeadline } from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type TrustBandProps = {
  lawyers: Lawyer[];
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function TrustBand({ lawyers }: TrustBandProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");

  const [activeId, setActiveId] = useState(() => lawyers[0]?.id);
  const active = lawyers.find((l) => l.id === activeId) ?? lawyers[0];

  const cityCount = useMemo(
    () => new Set(lawyers.map((l) => l.city)).size,
    [lawyers]
  );
  const combinedYears = useMemo(
    () => lawyers.reduce((sum, l) => sum + l.yearsExperience, 0),
    [lawyers]
  );

  if (!active) return null;

  return (
    <section className="bg-espresso py-8 sm:py-9">
      <PageShell>
        <div className="flex flex-col gap-3 border-b border-brass/40 pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <p className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-brass">
            <span className="text-cream">{pad(lawyers.length)}</span>
            <span className="ml-2">{t("lawyerStatLawyers")}</span>
            <span className="mx-3 text-brass/35" aria-hidden="true">
              /
            </span>
            <span className="text-cream">{pad(cityCount)}</span>
            <span className="ml-2">{t("lawyerStatCities")}</span>
            <span className="mx-3 text-brass/35" aria-hidden="true">
              /
            </span>
            <span className="text-cream">{combinedYears}</span>
            <span className="ml-2">{t("lawyerStatYears")}</span>
          </p>
          <Link
            href="/lawyers"
            className={cn(
              "relative w-fit shrink-0 pb-[5px] font-body text-sm font-semibold text-cream no-underline",
              "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-brass",
              "after:scale-x-[0.4] after:transition-transform after:duration-300 after:ease-out",
              "hover:after:scale-x-100 hover:after:bg-cream"
            )}
          >
            {t("browseAllLawyers", { count: lawyers.length })}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <CmsStyledText
          contentKey="home.verifiedLawyersTitle"
          as="h2"
          className="mt-5 max-w-3xl font-heading text-2xl font-semibold leading-snug text-cream sm:text-3xl"
        >
          {t("verifiedLawyersTitle")}
        </CmsStyledText>
        <CmsStyledText
          contentKey="home.verifiedLawyersSubtitle"
          as="p"
          className="mt-1.5 max-w-xl font-body text-sm text-cream/70"
        >
          {t("verifiedLawyersSubtitle")}
        </CmsStyledText>

        {/* Tiles carry their own hairline so unused columns stay invisible. */}
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(9.5rem,11rem))]">
          {lawyers.map((lawyer, index) => {
            const isActive = lawyer.id === active.id;

            return (
              <li
                key={lawyer.id}
                className={cn(
                  "border bg-espresso transition-colors",
                  isActive ? "border-brass/60" : "border-brass/25"
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveId(lawyer.id)}
                  aria-pressed={isActive}
                  title={localizedLawyerHeadline(lawyer, locale)}
                  className={cn(
                    "group flex h-full w-full cursor-pointer flex-col text-left",
                    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-burgundy"
                  )}
                >
                  <span className="relative block">
                    <Avatar
                      initials={lawyer.initials}
                      color={lawyer.avatarColor}
                      photoUrl={lawyer.photoUrl}
                      alt={lawyer.name}
                      size="lg"
                      className="aspect-[4/5] h-auto w-full rounded-none border-0"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-0 top-0 h-[2px] w-full bg-brass transition-opacity duration-200",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                      )}
                    />
                    <span className="absolute left-2 top-2 font-heading text-[10px] leading-none tracking-[0.08em] text-brass">
                      {pad(index + 1)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "border-t px-2.5 py-2.5",
                      isActive ? "border-brass/50 bg-cream/[0.04]" : "border-brass/20"
                    )}
                  >
                    <span
                      className={cn(
                        "relative inline-block pb-0.5 font-heading text-[13px] font-medium leading-snug sm:text-sm",
                        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-brass",
                        "after:transition-transform after:duration-300 after:ease-out",
                        isActive
                          ? "text-cream after:scale-x-100"
                          : "text-cream/88 after:scale-x-0 group-hover:text-cream group-hover:after:scale-x-100"
                      )}
                    >
                      {lawyer.name}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          aria-live="polite"
          className="flex flex-col gap-2 border-t border-brass/40 pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <p className="min-w-0 font-body text-sm leading-relaxed text-cream/82">
            <span className="font-heading font-semibold text-cream">
              {active.name}
            </span>
            <span className="mx-2 text-brass/50" aria-hidden="true">
              ·
            </span>
            <span>{localizedLawyerHeadline(active, locale)}</span>
            <span className="mx-2 text-brass/50" aria-hidden="true">
              ·
            </span>
            <span>{active.city}</span>
            <span className="mx-2 text-brass/50" aria-hidden="true">
              ·
            </span>
            <span>
              {active.yearsExperience} {t("lawyerStatYears")}
            </span>
          </p>
          <Link
            href={`/lawyers/${active.slug}`}
            className={cn(
              "relative w-fit shrink-0 pb-[5px] font-body text-sm font-semibold text-cream no-underline",
              "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-burgundy",
              "after:scale-x-[0.4] after:transition-transform after:duration-300 after:ease-out",
              "hover:text-burgundy-light hover:after:scale-x-100"
            )}
          >
            {t("viewLawyerProfile")}
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </PageShell>
    </section>
  );
}
