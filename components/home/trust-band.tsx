import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/shared/avatar";
import { PageShell } from "@/components/layout/page-shell";
import type { Lawyer } from "@/data/types";
import { localizedLawyerHeadline } from "@/data/localize";
import type { Locale } from "@/i18n/routing";

type TrustBandProps = {
  lawyers: Lawyer[];
};

export function TrustBand({ lawyers }: TrustBandProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");

  const featured = lawyers[0];
  const gridLawyers = lawyers.slice(1, 7);

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
              className="mt-4 inline-block font-body text-sm font-semibold text-burgundy transition-colors hover:text-cream"
            >
              {t("browseAllLawyers", { count: lawyers.length })} &rarr;
            </Link>
          </div>

          {featured && (
            <Link
              href={`/lawyers/${featured.slug}`}
              className="group flex shrink-0 flex-row items-center gap-4 rounded-[var(--radius-card)] border border-cream/10 bg-cream/5 p-4 transition-colors hover:border-burgundy/40 sm:p-5 lg:flex-col lg:items-center lg:gap-3 lg:px-8 lg:py-6 lg:text-center"
            >
              <div className="relative">
                <Avatar
                  initials={featured.initials}
                  color={featured.avatarColor}
                  photoUrl={featured.photoUrl}
                  alt={featured.name}
                  size="xl"
                  className="ring-2 ring-cream/15 transition-all group-hover:ring-burgundy/60"
                />
                {featured.verified && (
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-burgundy ring-2 ring-espresso">
                    <BadgeCheck className="h-4 w-4 text-cream" />
                  </span>
                )}
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-cream">
                  {featured.name}
                </p>
                <p className="mt-1 font-body text-sm text-cream/50">
                  {localizedLawyerHeadline(featured, locale)}
                </p>
                <span className="mt-2 inline-block font-body text-xs font-semibold text-burgundy transition-colors group-hover:text-cream lg:mt-3">
                  {t("viewLawyerProfile")} &rarr;
                </span>
              </div>
            </Link>
          )}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-cream/10 pt-8 sm:grid-cols-4 lg:grid-cols-6 lg:gap-5">
          {(featured ? gridLawyers : lawyers).map((lawyer) => (
            <Link
              key={lawyer.id}
              href={`/lawyers/${lawyer.slug}`}
              className="group flex flex-col items-center gap-2.5 text-center"
              title={localizedLawyerHeadline(lawyer, locale)}
            >
              <div className="relative">
                <Avatar
                  initials={lawyer.initials}
                  color={lawyer.avatarColor}
                  photoUrl={lawyer.photoUrl}
                  alt={lawyer.name}
                  size="lg"
                  className="ring-2 ring-cream/12 transition-all duration-200 group-hover:ring-burgundy/60"
                />
                {lawyer.verified && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-burgundy ring-2 ring-espresso">
                    <BadgeCheck className="h-3 w-3 text-cream" />
                  </span>
                )}
              </div>
              <p className="font-body text-xs font-medium leading-tight text-cream/80 transition-colors group-hover:text-cream sm:text-sm">
                {lawyer.name}
              </p>
            </Link>
          ))}
        </div>
      </PageShell>
    </section>
  );
}
