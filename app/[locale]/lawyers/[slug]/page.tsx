import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Languages, MapPin, MessageCircle, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/shared/avatar";
import { CategoryIcon } from "@/components/shared/category-icon";
import { CompactServiceList } from "@/components/shared/compact-service-list";
import {
  getCategoryById,
  getCasesByLawyer,
  getLawyerBySlug,
  getReviewsByLawyer,
  getServicesByLawyer,
} from "@/data/queries";
import {
  localizedCategoryName,
  localizedCaseDescription,
  localizedCaseOutcome,
  localizedCaseTitle,
  localizedLawyerBio,
  localizedLawyerHeadline,
  localizedReviewQuote,
  localizedReviewRole,
} from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lawyer = await getLawyerBySlug(slug);
  if (!lawyer) return {};

  return {
    title: lawyer.name,
    description: localizedLawyerHeadline(lawyer, locale as Locale),
  };
}

export default async function LawyerProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;

  const lawyer = await getLawyerBySlug(slug);
  if (!lawyer) notFound();

  const [services, reviews, cases, categoryList, t, tCommon] = await Promise.all([
    getServicesByLawyer(lawyer.id),
    getReviewsByLawyer(lawyer.id),
    getCasesByLawyer(lawyer.id),
    Promise.all(lawyer.practiceAreaIds.map((id) => getCategoryById(id))),
    getTranslations("lawyerProfile"),
    getTranslations("common"),
  ]);
  const practiceAreas = categoryList.filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <div className="bg-espresso">
        <div className="page-shell py-10">
          <Link
            href="/lawyers"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-cream/70 transition-colors hover:text-cream"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon("backToLawyers")}
          </Link>

          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar
              initials={lawyer.initials}
              color={lawyer.avatarColor}
              photoUrl={lawyer.photoUrl}
              alt={lawyer.name}
              size="xl"
              className="border border-cream/70"
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-semibold text-cream sm:text-4xl">
                  {lawyer.name}
                </h1>
                {lawyer.verified && (
                  <Badge variant="burgundy">{tCommon("verified")}</Badge>
                )}
              </div>
              <p className="mt-1 font-body text-cream/72">
                {localizedLawyerHeadline(lawyer, loc)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-body text-sm text-cream/65">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {lawyer.city}
                </span>
                <span>
                  {lawyer.yearsExperience} {tCommon("years")}{" "}
                  {t("experience").toLowerCase()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4" />
                  {lawyer.languages.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-espresso">
            {t("about")}
          </h2>
          <p className="mt-3 font-body leading-relaxed text-espresso/80">
            {localizedLawyerBio(lawyer, loc)}
          </p>

          <div className="mt-10">
            <h2 className="font-heading text-lg font-semibold text-espresso">
              {t("services")}
            </h2>
            {services.length > 0 ? (
              <CompactServiceList services={services} />
            ) : (
              <p className="mt-3 font-body text-sm text-espresso/65">
                {t("noServices")}
              </p>
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-lg font-semibold text-espresso">
              {t("cases")}
            </h2>
            {cases.length > 0 ? (
              <div className="mt-5 space-y-4">
                {cases.map((item) => (
                  <Card key={item.id} className="bg-white/60">
                    <CardContent>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-heading font-semibold text-espresso">
                          {localizedCaseTitle(item, loc)}
                        </p>
                        {item.year && (
                          <p className="font-mono text-xs text-espresso/60">
                            {item.year}
                          </p>
                        )}
                      </div>
                      <p className="mt-3 font-body text-sm leading-relaxed text-espresso/80">
                        {localizedCaseDescription(item, loc)}
                      </p>
                      {localizedCaseOutcome(item, loc) && (
                        <p className="mt-3 font-body text-sm text-espresso/70">
                          {localizedCaseOutcome(item, loc)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="mt-3 font-body text-sm text-espresso/65">
                {t("noCases")}
              </p>
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-lg font-semibold text-espresso">
              {t("reviews")}
            </h2>
            {reviews.length > 0 ? (
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-white/60">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="font-heading font-semibold text-espresso">
                          {review.authorName}
                        </p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < review.rating
                                  ? "fill-brass text-brass"
                                  : "fill-espresso/10 text-espresso/10"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 font-body text-xs text-espresso/60">
                        {localizedReviewRole(review, loc)}
                      </p>
                      <p className="mt-3 font-body text-sm leading-relaxed text-espresso/80">
                        &ldquo;{localizedReviewQuote(review, loc)}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="mt-3 font-body text-sm text-espresso/65">
                {t("noReviews")}
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white/70">
            <CardContent>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-espresso/80">
                {t("practiceAreas")}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {practiceAreas.map((category) => (
                  <Badge key={category.id} variant="outline">
                    <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                    {localizedCategoryName(category, loc)}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-xl bg-cream-muted/70 p-4 font-body text-xs leading-relaxed text-espresso/70">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-espresso/55" />
                {t("contactNote")}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </>
  );
}
