"use client";

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

  if (lawyers.length === 0) return null;

  return (
    <section className="bg-espresso py-8 sm:py-9">
      <PageShell>
        <div className="flex justify-end border-b border-brass/40 pb-3">
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

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(9.5rem,11rem))]">
          {lawyers.map((lawyer, index) => (
            <li
              key={lawyer.id}
              className="border border-brass/25 bg-espresso transition-colors hover:border-brass/60"
            >
              <Link
                href={`/lawyers/${lawyer.slug}`}
                title={localizedLawyerHeadline(lawyer, locale)}
                className={cn(
                  "group flex h-full w-full flex-col text-left no-underline",
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
                    className="absolute left-0 top-0 h-[2px] w-full bg-brass opacity-0 transition-opacity duration-200 group-hover:opacity-70"
                  />
                  <span className="absolute left-2 top-2 font-heading text-[10px] leading-none tracking-[0.08em] text-brass">
                    {pad(index + 1)}
                  </span>
                </span>
                <span className="border-t border-brass/20 px-2.5 py-2.5 group-hover:border-brass/50 group-hover:bg-cream/[0.04]">
                  <span
                    className={cn(
                      "relative inline-block pb-0.5 font-heading text-[13px] font-medium leading-snug text-cream/88 sm:text-sm",
                      "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-brass",
                      "after:scale-x-0 after:transition-transform after:duration-300 after:ease-out",
                      "group-hover:text-cream group-hover:after:scale-x-100"
                    )}
                  >
                    {lawyer.name}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageShell>
    </section>
  );
}
