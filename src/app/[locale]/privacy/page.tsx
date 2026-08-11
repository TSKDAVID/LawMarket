import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { LegalDocument } from "@/components/LegalDocument";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    barePath: "/privacy",
    title: dict.meta.privacyTitle,
    description: dict.meta.privacyDescription,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <LegalDocument
      eyebrow={dict.privacyPage.eyebrow}
      title={dict.privacyPage.title}
      updated={dict.privacyPage.updated}
      articles={dict.privacyPage.articles}
    />
  );
}
