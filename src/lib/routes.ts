import type { Locale } from "@/schemas";

/**
 * Public URL for a path in a given locale. Georgian (default) lives
 * unprefixed at "/", English under "/en" (ENGINEERING.md §5; proxy.ts
 * rewrites unprefixed traffic to the internal /ka segment).
 */
export function localeHref(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === "ka" ? clean || "/" : `/en${clean}`;
}

/** The same path in the other locale — for the ქარ / ENG switcher. */
export function switchLocaleHref(locale: Locale, currentPath: string): string {
  const bare = currentPath.replace(/^\/en(?=\/|$)/, "") || "/";
  return localeHref(locale, bare);
}

/** Strip the locale prefix from a public pathname. */
export function barePath(pathname: string): string {
  return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}
