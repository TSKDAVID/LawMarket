import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow, UserRole } from "@/lib/supabase/database.types";

export type SessionUser = {
  id: string;
  email: string | null;
  profile: ProfileRow | null;
};

/**
 * The signed-in user and their profile, or null.
 *
 * Always resolved through `getUser()` rather than `getSession()`: the former
 * verifies the token with Supabase, the latter trusts whatever is in the
 * cookie. Authorization decisions must never be made on an unverified token.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { id: user.id, email: user.email ?? null, profile };
}

export async function getRole(): Promise<UserRole | null> {
  const user = await getSessionUser();
  return user?.profile?.role ?? null;
}

/**
 * Gate for the admin section. Proxy already turns signed-out visitors away;
 * this is the check that actually decides, against the database, on every
 * render — so a stale or forged cookie cannot get past it.
 */
export async function requireAdmin(locale: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/${locale}/login/`);
  if (user.profile?.role !== "admin") redirect(`/${locale}/`);
  return user;
}

/** Gate for the lawyer portal. Admins are allowed through for support. */
export async function requireLawyer(locale: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/${locale}/login/`);
  const role = user.profile?.role;
  if (role !== "lawyer" && role !== "admin") redirect(`/${locale}/`);
  return user;
}

/** The lawyer row belonging to the signed-in user, if any. */
export async function getOwnLawyer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("lawyers")
    .select("*")
    .eq("profile_id", user.id)
    .maybeSingle();

  return data;
}

/** Where a user belongs after signing in. */
export function homePathForRole(role: UserRole | null | undefined) {
  if (role === "admin") return "/admin";
  if (role === "lawyer") return "/portal";
  return "/";
}
