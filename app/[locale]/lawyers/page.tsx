import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LawyersDirectory } from "@/components/lawyers/lawyers-directory";
import {
  getCategories,
  getCities,
  getLanguages,
  getLawyerRatings,
  getLawyers,
} from "@/data/queries";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lawyers" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function LawyersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const [lawyers, categories, cities, languages, ratingsMap] = await Promise.all([
    getLawyers(),
    getCategories(),
    getCities(),
    getLanguages(),
    getLawyerRatings(),
  ]);

  const ratings = Object.fromEntries(ratingsMap);

  return (
    <div className="paper-grain page-shell py-10 lg:py-12">
      <LawyersDirectory
        lawyers={lawyers}
        categories={categories}
        cities={cities}
        languages={languages}
        ratings={ratings}
      />
    </div>
  );
}
