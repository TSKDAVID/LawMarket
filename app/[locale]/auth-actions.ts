"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole, mapAuthError, pathFromNextParam } from "@/lib/auth-paths";
import { routing } from "@/i18n/routing";

export type AuthState = { error: string | null };

function safeLocale(value: FormDataEntryValue | null) {
  const locale = String(value ?? "");
  return routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;
}

function localePath(locale: string, path: string) {
  if (path === "/") return `/${locale}/`;
  return `/${locale}${path.endsWith("/") ? path : `${path}/`}`;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const locale = safeLocale(formData.get("locale"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "missingFields" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: mapAuthError(error) };
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  revalidatePath("/", "layout");
  redirect(
    localePath(
      locale,
      pathFromNextParam(String(formData.get("next") ?? "")) ??
        homePathForRole(data?.role)
    )
  );
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const locale = safeLocale(formData.get("locale"));
  const fullName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
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
  redirect(localePath(locale, homePathForRole(data?.role)));
}

export async function signOut(formData: FormData) {
  const locale = safeLocale(formData.get("locale"));
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}/`);
}
