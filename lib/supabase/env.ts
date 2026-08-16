/**
 * Public Supabase URL + anon key.
 *
 * Server code prefers `SUPABASE_URL` / `SUPABASE_ANON_KEY` because those are
 * read at runtime on Vercel. `NEXT_PUBLIC_*` is baked in at build time, so a
 * stale Production value keeps pointing at a dead project until a rebuild.
 */
export function getSupabasePublicEnv() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  const key = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();
  return { url, key };
}
