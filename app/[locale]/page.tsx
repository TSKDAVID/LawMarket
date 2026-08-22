import { setRequestLocale } from "next-intl/server";
import { ServicesExplorer } from "@/components/home/services-explorer";
import { GuaranteeBand } from "@/components/home/guarantee-band";
import { TrustBand } from "@/components/home/trust-band";
import { ReviewsSection } from "@/components/home/reviews-section";
import { CtaSection } from "@/components/home/cta-section";
import {
  getCategories,
  getServices,
  getVerifiedLawyers,
  getReviews,
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

  const [categories, services, lawyers, reviews, user, settings] = await Promise.all([
    getCategories(),
    getServices(),
    getVerifiedLawyers(),
    getReviews(),
    getSessionUser(),
    getSiteSettings(),
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
      <ReviewsSection reviews={reviews} lawyers={lawyers} services={services} />
      <CtaSection />
    </>
  );
}
