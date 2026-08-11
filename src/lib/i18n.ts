import "server-only";
import type { Locale } from "@/schemas";
import ka from "@/locales/ka.json";
import en from "@/locales/en.json";

export const locales: Locale[] = ["ka", "en"];
export const defaultLocale: Locale = "ka";

export type Dictionary = typeof ka;

const dictionaries: Record<Locale, Dictionary> = { ka, en: en as Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return value === "ka" || value === "en";
}
