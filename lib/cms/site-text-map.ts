import type { SiteContent } from "@/data/types";
import type { Locale } from "@/i18n/routing";

/** Locale-keyed CMS copy for client components (dot-path keys). */
export function buildCmsTextMap(siteContent: SiteContent, locale: Locale) {
  const lang = locale === "ka" ? "ka" : "en";
  const map: Record<string, string> = {};
  for (const [key, row] of Object.entries(siteContent)) {
    // Include empty strings — a saved blank in CMS must hide copy, not fall back to JSON.
    map[key] = (row[lang] ?? "").trim();
  }
  return map;
}
