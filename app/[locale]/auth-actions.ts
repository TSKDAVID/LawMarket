"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole } from "@/lib/auth";
import { routing } from "@/i18n/routing";

export type AuthState = { error: string | null };

function safeLocale(value: FormDataEntryValue | null) {
  const locale = String(value ?? "");
  return routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;
}

/**
 * `next` comes from a query string, so it is only honoured when it is a
 * relative path — otherwise it is an open redirect waiting to happen.
 */
function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  return next.startsWith("/") && !next.startsWith("//") ? next : null;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const locale = safeLocale(formData.get("locale"));
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "missingFields" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "invalidCredentials" };
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  revalidatePath("/", "layout");
  redirect(
    safeNext(formData.get("next")) ??
      `/${locale}${homePathForRole(data?.role)}`.replace(/\/+$/, "/")
  );
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const locale = safeLocale(formData.get("locale"));
  const fullName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || !fullName) {
    return { error: "missingFields" };
  }
    if (password.length < 8) {
    return { error: "weakPassword" };
  }
  if (password !== String(formData.get("confirmPassword") ?? "")) {
    return { error: "passwordMismatch" };
  }

  const supabase = await createClient();
  // Role is deliberately absent from the payload. The database trigger
  // assigns 'client', except the first account which becomes admin.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return {
      error: error.message.toLowerCase().includes("already")
        ? "emailTaken"
        : "signUpFailed",
    };
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  revalidatePath("/", "layout");
  redirect(
    `/${locale}${homePathForRole(data?.role)}`.replace(/\/+$/, "/")
  );
}

export async function signOut(formData: FormData) {
  const locale = safeLocale(formData.get("locale"));
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}/`);
}
