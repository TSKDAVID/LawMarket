import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Pick the localized variant of a bilingual DB field, falling back to the other. */
export function pickLocale(locale: string, ka: string | null, en: string | null) {
  const primary = locale === "en" ? en : ka;
  const fallback = locale === "en" ? ka : en;
  return primary?.trim() ? primary : (fallback ?? "");
}

export function formatGel(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "ka-GE", {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDate(value: string | Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ka-GE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
