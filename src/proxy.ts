import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale routing (ENGINEERING.md §5).
 *
 * Georgian is the default locale and lives UNPREFIXED at "/"; English lives
 * under "/en". Internally every route sits in the app/[locale] segment, so:
 *
 *  - direct hits on /ka/... are permanently redirected to the unprefixed URL
 *    (one canonical URL per Georgian page),
 *  - /en/... passes through untouched,
 *  - everything else is rewritten internally to /ka/... .
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ka" || pathname.startsWith("/ka/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ka${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, and any file with an extension
  // (fonts, favicon, sitemap.xml, robots.txt, …).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
