import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: "GEL" = "GEL") {
  const symbol = currency === "GEL" ? "₾" : currency;
  return `${symbol}${price.toLocaleString("en-US")}`;
}

/**
 * Forgiving search match for Georgian (and English) queries.
 *
 * Georgian nouns inflect: a user types "ხელშეკრულება" (nominative) while
 * listings say "ხელშეკრულების შემოწმება" (genitive). Plain substring match
 * misses those, so each query token also tries progressively shortened
 * stems (dropping up to two trailing letters for longer tokens).
 * Every token must match somewhere in the haystack.
 */
export function matchesQuery(haystack: string, query: string): boolean {
  const text = haystack.toLowerCase();
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  return tokens.every((token) => {
    if (text.includes(token)) return true;
    if (token.length >= 4 && text.includes(token.slice(0, -1))) return true;
    if (token.length >= 6 && text.includes(token.slice(0, -2))) return true;
    return false;
  });
}
