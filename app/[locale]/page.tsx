import { setRequestLocale } from "next-intl/server";
import { ServicesExplorer } from "@/components/home/services-explorer";
import { GuaranteeBand } from "@/components/home/guarantee-band";
import { TrustBand } from "@/components/home/trust-band";
import { ReviewsSection } from "@/components/home/reviews-section";
import { SuccessfulCasesSection } from "@/components/home/successful-cases-section";
import { CtaSection } from "@/components/home/cta-section";
import {
  getCategories,
  getServices,
  getVerifiedLawyers,
  getReviews,
  getPublishedCases,
} from "@/data/queries";
import { getSessionUser } from "@/lib/auth";
import { getSiteSettings } from "@/lib/cms/settings";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const settings = await getSiteSettings();
  const showReviews = settings.home_show_reviews;

  const [categories, services, lawyers, reviews, cases, user] = await Promise.all([
    getCategories(),
    getServices(),
    getVerifiedLawyers(),
    showReviews ? getReviews() : Promise.resolve([]),
    showReviews ? Promise.resolve([]) : getPublishedCases(8),
    getSessionUser(),
  ]);

  const role = user?.profile?.role;
  const postHref =
    role === "lawyer" || role === "admin" ? "/cases" : "/cases/new";

  return (
    <>
      <ServicesExplorer
        services={services}
        categories={categories}
        lawyers={lawyers}
        postHref={postHref}
        heroMedia={{
          hero_media_type: settings.hero_media_type,
          hero_media_url: settings.hero_media_url,
          hero_poster_url: settings.hero_poster_url,
          hero_embed_url: settings.hero_embed_url,
        }}
      />
      <GuaranteeBand />
      <TrustBand lawyers={lawyers} />
      {showReviews ? (
        <ReviewsSection reviews={reviews} lawyers={lawyers} services={services} />
      ) : (
        <SuccessfulCasesSection cases={cases} categories={categories} />
      )}
      <CtaSection />
    </>
  );
}
