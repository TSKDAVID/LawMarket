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
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const [categories, services, lawyers, reviews, user] = await Promise.all([
    getCategories(),
    getServices(),
    getVerifiedLawyers(),
    getReviews(),
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
      />
      <GuaranteeBand />
      <TrustBand lawyers={lawyers} />
      <ReviewsSection reviews={reviews} lawyers={lawyers} services={services} />
      <CtaSection />
    </>
  );
}
