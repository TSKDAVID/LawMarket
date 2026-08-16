import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

const handleI18n = createIntlMiddleware(routing);

/**
 * Runs before every page request. Two jobs, in order:
 *
 * 1. next-intl resolves the locale and produces the response (a redirect for
 *    `/` → `/ka`, or a rewrite for the matched locale).
 * 2. Supabase refreshes the auth token and writes the rotated cookies onto
 *    that same response, so server components see a valid session.
 *
 * Authorization is deliberately *not* decided here — see the admin layout,
 * which re-checks the role against the database before rendering.
 */
export async function proxy(request: NextRequest) {
  const response = handleI18n(request);

  const { url, key: anonKey } = getSupabasePublicEnv();
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optimistic gate only: keeps signed-out visitors out of the admin shell
  // without a database round trip. The real check happens server-side.
  const { pathname } = request.nextUrl;
  if (!user && /^\/(ka|en)\/(admin|portal)(\/|$)/.test(pathname)) {
    const locale = pathname.split("/")[1] ?? routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login/`, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // Skip Next internals, the API surface, and anything with a file extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
