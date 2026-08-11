import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/shared/avatar";
import type { Lawyer, Review, Service } from "@/data/types";
import {
  localizedReviewQuote,
  localizedReviewRole,
  localizedServiceTitle,
} from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { PageShell } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

type ReviewsSectionProps = {
  reviews: Review[];
  lawyers: Lawyer[];
  services: Service[];
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-brass text-brass"
              : "fill-espresso/10 text-espresso/10"
          )}
        />
      ))}
    </div>
  );
}

function ReviewAvatar({
  review,
  lawyer,
  size,
}: {
  review: Review;
  lawyer?: Lawyer;
  size: "sm" | "md";
}) {
  if (lawyer?.photoUrl) {
    return (
      <Avatar
        initials={lawyer.initials}
        color={lawyer.avatarColor}
        photoUrl={lawyer.photoUrl}
        alt={lawyer.name}
        size={size}
      />
    );
  }

  return (
    <Avatar
      initials={initialsFromName(review.authorName)}
      color="#1c1210"
      size={size}
    />
  );
}

export function ReviewsSection({
  reviews,
  lawyers,
  services,
}: ReviewsSectionProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");

  const lawyerById = new Map(lawyers.map((l) => [l.id, l]));
  const serviceById = new Map(services.map((s) => [s.id, s]));

  const [featured, ...rest] = reviews;
  const secondary = rest.slice(0, 4);

  if (!featured) return null;

  const featuredLawyer = featured.lawyerId
    ? lawyerById.get(featured.lawyerId)
    : undefined;
  const featuredService = featured.serviceId
    ? serviceById.get(featured.serviceId)
    : undefined;

  return (
    <section className="bg-cream py-12 sm:py-14">
      <PageShell>
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-semibold text-espresso sm:text-3xl">
            {t("reviewsTitle")}
          </h2>
          <p className="mt-2 font-body text-sm text-espresso/50">
            {t("reviewsSubtitle")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <span
              aria-hidden="true"
              className="font-heading text-6xl leading-none text-burgundy/25"
            >
              &ldquo;
            </span>
            <Stars rating={featured.rating} />
            <p className="mt-5 font-heading text-2xl font-medium leading-snug text-espresso sm:text-3xl">
              {localizedReviewQuote(featured, locale)}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <ReviewAvatar
                review={featured}
                lawyer={featuredLawyer}
                size="md"
              />
              <div>
                <p className="font-heading text-sm font-semibold text-espresso">
                  {featured.authorName}
                </p>
                <p className="font-body text-xs text-espresso/50">
                  {localizedReviewRole(featured, locale)}
                </p>
                {featuredService && (
                  <Link
                    href={`/services/${featuredService.slug}`}
                    className="mt-0.5 block font-body text-xs text-burgundy hover:text-burgundy-dark"
                  >
                    {t("viaService", {
                      service: localizedServiceTitle(featuredService, locale),
                    })}
                  </Link>
                )}
              </div>
            </div>
            {featuredLawyer && (
              <Link
                href={`/lawyers/${featuredLawyer.slug}`}
                className="mt-4 inline-block font-body text-sm font-semibold text-burgundy hover:text-burgundy-dark"
              >
                {t("viewLawyerProfile")} &rarr;
              </Link>
            )}
          </div>

          {/* A quiet ledger of further reviews — hairlines, not card clones. */}
          <div className="lg:col-span-7">
            {secondary.map((review, index) => {
              const service = review.serviceId
                ? serviceById.get(review.serviceId)
                : undefined;
              return (
                <div
                  key={review.id}
                  className={cn(
                    "py-5",
                    index > 0 && "border-t border-espresso/10"
                  )}
                >
                  <p className="font-body text-[15px] leading-relaxed text-espresso/75">
                    &ldquo;{localizedReviewQuote(review, locale)}&rdquo;
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-heading text-sm font-semibold text-espresso">
                      {review.authorName}
                    </span>
                    <span className="font-body text-xs text-espresso/45">
                      · {localizedReviewRole(review, locale)}
                    </span>
                    {service && (
                      <Link
                        href={`/services/${service.slug}`}
                        className="font-body text-xs text-burgundy hover:text-burgundy-dark"
                      >
                        · {t("viaService", {
                          service: localizedServiceTitle(service, locale),
                        })}
                      </Link>
                    )}
                    <span className="ml-auto">
                      <Stars rating={review.rating} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageShell>
    </section>
  );
}
