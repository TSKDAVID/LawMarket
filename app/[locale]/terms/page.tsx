import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/page-header";
import { LegalSections } from "@/components/legal/legal-sections";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("termsTitle") };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("legal");

  const sections = [1, 2, 3, 4].map((n) => ({
    title: t(`termsSection${n}Title`),
    text: t(`termsSection${n}Text`),
  }));

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date("2026-08-08"));

  return (
    <>
      <PageHeader title={t("termsTitle")} />
      <LegalSections
        lastUpdatedLabel={t("lastUpdated", { date: formattedDate })}
        placeholderNotice={t("placeholderNotice")}
        sections={sections}
      />
    </>
  );
}
