import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS.
 * Import ONLY from trusted server modules (lib/data/admin.ts, webhooks, cron).
 * Never import from Client Components or browser-reachable code.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
