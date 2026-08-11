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
    barePath: "/terms",
    title: dict.meta.termsTitle,
    description: dict.meta.termsDescription,
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <LegalDocument
      eyebrow={dict.termsPage.eyebrow}
      title={dict.termsPage.title}
      updated={dict.termsPage.updated}
      articles={dict.termsPage.articles}
    />
  );
}
