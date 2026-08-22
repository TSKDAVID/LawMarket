import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/page-header";
import { LegalSections } from "@/components/legal/legal-sections";
import {
  getSitePage,
  localizedPageNotice,
  localizedPageTitle,
  localizedSections,
} from "@/lib/cms/pages";
import { getSiteSettings } from "@/lib/cms/settings";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getSitePage("privacy");
  return {
    title: locale === "ka" ? page.title_ka : page.title_en,
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("legal");
  const page = await getSitePage("privacy");
  const settings = await getSiteSettings();
  const loc = locale as Locale;

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(settings.legal_updated_at));

  return (
    <>
      <PageHeader title={localizedPageTitle(page, loc)} />
      <LegalSections
        lastUpdatedLabel={t("lastUpdated", { date: formattedDate })}
        placeholderNotice={localizedPageNotice(page, loc)}
        showPlaceholderNotice={Boolean(localizedPageNotice(page, loc))}
        sections={localizedSections(page, loc)}
      />
    </>
  );
}
