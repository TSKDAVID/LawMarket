import { Suspense } from "react";
import { getCategories, getLawyers, getServices } from "@/data/queries";
import { ServicesCatalog } from "@/components/services/services-catalog";
import type { Locale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const [categories, services, lawyers] = await Promise.all([
    getCategories(),
    getServices(),
    getLawyers(),
  ]);

  return (
    <div className="paper-grain page-shell py-10 lg:py-12">
      <Suspense fallback={null}>
        <ServicesCatalog
          services={services}
          categories={categories}
          lawyers={lawyers}
        />
      </Suspense>
    </div>
  );
}
