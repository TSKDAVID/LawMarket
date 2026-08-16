import { useLocale, useTranslations } from "next-intl";
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

/*
 * Typographic rating — a technical mono mark instead of an SVG widget.
 * Reads like an entry in a grading ledger: [ ★★★★★ ].
 */
function RatingMark({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span
      className={cn(
        "font-mono text-xs tracking-tight text-espresso",
        className
      )}
    >
      <span aria-hidden="true">
        [ {"★".repeat(filled)}
        {"☆".repeat(5 - filled)} ]
      </span>
      <span className="sr-only">{rating}/5</span>
    </span>
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
        className="aspect-square rounded-none border border-espresso"
      />
    );
  }

  return (
    <Avatar
      initials={initialsFromName(review.authorName)}
      color="#1c1210"
      size={size}
      className="aspect-square rounded-none border border-espresso"
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
          <p className="mt-2 font-body text-sm text-espresso/65">
            {t("reviewsSubtitle")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Case file — the featured testimony sealed in a 1px ink frame */}
          <div className="lg:col-span-5">
            <div className="rounded-none border border-espresso bg-parchment p-8 sm:p-10 lg:p-12">
              <RatingMark rating={featured.rating} />
              <p className="mt-5 font-heading text-2xl font-medium leading-snug text-espresso sm:text-3xl">
                {localizedReviewQuote(featured, locale)}
              </p>

              <div className="mt-8 flex items-center gap-3 border-t border-espresso/20 pt-6">
                <ReviewAvatar
                  review={featured}
                  lawyer={featuredLawyer}
                  size="md"
                />
                <div>
                  <p className="font-heading text-sm font-semibold text-espresso">
                    {featured.authorName}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-espresso/65">
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
                  className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.16em] text-burgundy transition-colors hover:text-burgundy-dark"
                >
                  {t("viewLawyerProfile")} &rarr;
                </Link>
              )}
            </div>
          </div>

          {/* Review ledger — hard 1px ink rules between entries */}
          <div className="lg:col-span-7">
            {secondary.map((review, index) => {
              const service = review.serviceId
                ? serviceById.get(review.serviceId)
                : undefined;
              return (
                <div
                  key={review.id}
                  className={cn("py-5", index > 0 && "border-t border-espresso")}
                >
                  <p className="font-body text-[15px] leading-relaxed text-espresso/85">
                    &ldquo;{localizedReviewQuote(review, locale)}&rdquo;
                  </p>
                  {/*
                   * Signature line: attribution left, grade right. Burgundy is
                   * reserved for the one interactive token — the service link —
                   * so the name and role stay full-strength ink. ml-auto keeps
                   * the grade right-aligned even after the line wraps.
                   */}
                  <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest">
                      <span className="font-semibold text-espresso">
                        {review.authorName}
                      </span>
                      <span className="text-espresso">
                        {localizedReviewRole(review, locale)}
                      </span>
                      {service && (
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-burgundy transition-colors hover:text-burgundy-dark"
                        >
                          {t("viaService", {
                            service: localizedServiceTitle(service, locale),
                          })}
                        </Link>
                      )}
                    </div>
                    <RatingMark
                      rating={review.rating}
                      className="ml-auto shrink-0"
                    />
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
