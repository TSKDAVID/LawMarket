import type { Locale } from "@/i18n/routing";
import type { SiteContent } from "@/data/types";

function setNested(
  root: Record<string, unknown>,
  path: string,
  value: string
) {
  const parts = path.split(".");
  let cur: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    if (typeof next !== "object" || next === null) {
      cur[key] = {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  const leaf = parts[parts.length - 1];
  cur[leaf] = value;
}

function canMergeAt(messages: Record<string, unknown>, path: string) {
  const parts = path.split(".");
  let cur: Record<string, unknown> = messages;
  for (let i = 0; i < parts.length - 1; i++) {
    const next = cur[parts[i]];
    if (typeof next !== "object" || next === null) return false;
    cur = next as Record<string, unknown>;
  }
  const leaf = parts[parts.length - 1];
  const existing = cur[leaf];
  if (typeof existing === "object" && existing !== null) return false;
  return true;
}

/** Overlay site_content rows onto the static JSON messages tree. */
export function mergeSiteContentIntoMessages(
  messages: Record<string, unknown>,
  siteContent: SiteContent,
  locale: Locale
) {
  const lang = locale === "ka" ? "ka" : "en";
  for (const [key, values] of Object.entries(siteContent)) {
    const value = values[lang]?.trim();
    if (!value || !canMergeAt(messages, key)) continue;
    setNested(messages, key, value);
  }
}
