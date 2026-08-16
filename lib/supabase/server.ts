import { createServerClient } from "@supabase/ssr";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Server Supabase client bound to the request cookies. Use this in server
 * components, server actions, and route handlers.
 */
function publicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return { url, key };
}

/** Cookie-bound client for server components, actions, and route handlers. */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = publicEnv();

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a server component, where cookies are read-only.
            // Proxy already refreshed the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Anonymous client for public content rendered outside a request scope
 * (generateStaticParams, sitemap, revalidated pages). Never sees a session.
 */
export function createAnonClient() {
  const { url, key } = publicEnv();
  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

/**
 * Service-role client. Bypasses row-level security entirely, so it must never
 * be imported into a client component and must never be handed user input
 * without an authorization check first.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createJsClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
