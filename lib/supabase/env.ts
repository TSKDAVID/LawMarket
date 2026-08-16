/**
 * Public Supabase URL + anon key.
 *
 * Never mix a URL from one env name with a key from another — a stale
 * NEXT_PUBLIC_ANON_KEY against a new SUPABASE_URL is Invalid API key, which
 * the login form surfaces as a generic failure.
 *
 * Server aliases (SUPABASE_URL / SUPABASE_ANON_KEY) are read as a pair at
 * runtime. NEXT_PUBLIC_* is the fallback pair, baked in at build time.
 */
function trimUrl(value: string | undefined) {
  return (value ?? "").trim().replace(/\/$/, "");
}

function trimKey(value: string | undefined) {
  return (value ?? "").trim();
}

function pair(url: string, key: string) {
  if (!url || !key) return null;
  return { url, key };
}

function jwtRef(key: string) {
  try {
    const payload = key.split(".")[1];
    if (!payload) return null;
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad =
      padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const json = JSON.parse(atob(padded + pad)) as { ref?: unknown };
    return typeof json.ref === "string" ? json.ref : null;
  } catch {
    return null;
  }
}

export function getSupabasePublicEnv() {
  const server = pair(
    trimUrl(process.env.SUPABASE_URL),
    trimKey(process.env.SUPABASE_ANON_KEY)
  );
  const nextPublic = pair(
    trimUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    trimKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const chosen = server ?? nextPublic ?? { url: "", key: "" };

  if (chosen.url && chosen.key) {
    try {
      const hostRef = new URL(chosen.url).hostname.split(".")[0];
      const keyRef = jwtRef(chosen.key);
      if (keyRef && hostRef && keyRef !== hostRef) {
        console.error(
          `[lawmarket] Supabase URL ${hostRef} does not match anon key ${keyRef}. Set both from the same project.`
        );
      }
    } catch {
      console.error("[lawmarket] Invalid SUPABASE_URL");
    }
  }

  return chosen;
}
