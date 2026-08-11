import type { Locale } from "@/schemas";

/**
 * Document-style GEL amount: "₾ 250". The lari sign leads, mono-set in the
 * UI. Grouping via Intl for the active locale (BRAND.md §3 — numerals are
 * set with intent, never default).
 */
export function formatGel(amount: number, locale: Locale): string {
  const grouped = new Intl.NumberFormat(locale === "ka" ? "ka-GE" : "en-GB").format(amount);
  return `₾ ${grouped}`;
}

/** Clause number in the § index: 3 → "§ 03". */
export function formatClause(number: number): string {
  return `§ ${String(number).padStart(2, "0")}`;
}

/** Long date for letters: "2026 წლის 11 აგვისტო" / "11 August 2026". */
export function formatLongDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
    dateStyle: "long",
    timeZone: "Asia/Tbilisi",
  }).format(new Date(iso));
}

/** Mono register date: ISO as written, document apparatus. */
export function formatCaseDate(iso: string): string {
  return iso;
}
