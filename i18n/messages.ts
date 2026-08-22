import en from "../messages/en.json";
import ka from "../messages/ka.json";
import type { Locale } from "./routing";
import { getSiteContent } from "@/data/queries";
import { mergeSiteContentIntoMessages } from "@/lib/cms/merge";

export const messagesByLocale = {
  en,
  ka,
} as const satisfies Record<Locale, typeof en>;

function cloneMessages(locale: Locale) {
  return structuredClone(messagesByLocale[locale]) as Record<string, unknown>;
}

export async function getMessagesForLocale(locale: Locale) {
  const base = cloneMessages(locale);
  const siteContent = await getSiteContent();
  mergeSiteContentIntoMessages(base, siteContent, locale);
  return base as typeof en;
}

/** Static messages without DB overlay (admin previews, defaults). */
export function getStaticMessagesForLocale(locale: Locale) {
  return messagesByLocale[locale];
}
