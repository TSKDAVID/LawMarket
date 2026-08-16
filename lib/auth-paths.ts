import type { UserRole } from "@/lib/supabase/database.types";

/** Where a user belongs after signing in. Safe for client and server. */
export function homePathForRole(role: UserRole | null | undefined) {
  if (role === "admin") return "/admin";
  if (role === "lawyer") return "/portal/profile";
  return "/";
}

export function mapAuthError(error: { message: string; code?: string }) {
  const code = (error.code ?? "").toLowerCase();
  const message = error.message.toLowerCase();
  if (code === "email_not_confirmed" || message.includes("not confirmed")) {
    return "emailNotConfirmed";
  }
  if (code === "invalid_login_credentials" || message.includes("invalid login")) {
    return "invalidCredentials";
  }
  if (
    code === "user_banned" ||
    message.includes("banned") ||
    message.includes("disabled")
  ) {
    return "accountSuspended";
  }
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("enotfound") ||
    message.includes("failed to parse")
  ) {
    return "signInFailed";
  }
  return "signInFailed";
}

/** next-intl paths have no locale prefix; the login `next` query often does. */
export function pathFromNextParam(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  const stripped = next.replace(/^\/(ka|en)(?=\/|$)/, "");
  return stripped || "/";
}
