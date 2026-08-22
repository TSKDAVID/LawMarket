import type { SiteContent } from "@/data/types";
import type { Locale } from "@/i18n/routing";

/** Locale-keyed CMS copy for client components (dot-path keys). */
export function buildCmsTextMap(siteContent: SiteContent, locale: Locale) {
  const lang = locale === "ka" ? "ka" : "en";
  const map: Record<string, string> = {};
  for (const [key, row] of Object.entries(siteContent)) {
    const value = row[lang]?.trim();
    if (value) map[key] = value;
  }
  return map;
}
