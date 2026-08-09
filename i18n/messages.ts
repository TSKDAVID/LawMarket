import en from "../messages/en.json";
import ka from "../messages/ka.json";
import type { Locale } from "./routing";

export const messagesByLocale = {
  en,
  ka,
} as const satisfies Record<Locale, typeof en>;

export function getMessagesForLocale(locale: Locale) {
  return messagesByLocale[locale];
}
