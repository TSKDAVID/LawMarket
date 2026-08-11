import type { Metadata } from "next";
import type { Locale } from "@/schemas";
import { localeHref } from "@/lib/routes";

export function siteUrl(): string {
  // Production origin by default — canonicals, hreflang, sitemap and JSON-LD
  // must point at the real domain on Vercel even without env configuration.
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawmarket.ge";
}

/** Fill `{placeholders}` in dictionary strings. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

/**
 * Per-page metadata with canonical + hreflang alternates for both locales
 * (ENGINEERING.md §5–6). Georgian canonical is the unprefixed URL.
 */
export function pageMetadata({
  locale,
  barePath,
  title,
  description,
  noindex = false,
}: {
  locale: Locale;
  barePath: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const canonical = localeHref(locale, barePath);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ka: localeHref("ka", barePath),
        en: localeHref("en", barePath),
        "x-default": localeHref("ka", barePath),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "LawMarket",
      locale: locale === "ka" ? "ka_GE" : "en_US",
      type: "website",
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
