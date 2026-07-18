"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, onboardingSchema, signupSchema } from "@/lib/validations/auth";
import { updateOwnProfile } from "@/lib/data/profiles";
import { slugify } from "@/lib/utils";

export type AuthActionState = {
  error?: string;
};

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!parsed.success) {
    return { error: "შეამოწმეთ შეყვანილი მონაცემები." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/onboarding");
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "შეამოწმეთ ელფოსტა და პაროლი." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const next = String(formData.get("next") || "/dashboard");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function onboardingAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = onboardingSchema.safeParse({
    role: formData.get("role"),
    fullName: formData.get("fullName"),
    city: formData.get("city") || undefined,
    phone: formData.get("phone") || undefined,
    lawFirm: formData.get("lawFirm") || undefined,
  });

  if (!parsed.success) {
    return { error: "შეავსეთ სავალდებულო ველები." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "სესია ვერ მოიძებნა." };
  }

  const updates: Parameters<typeof updateOwnProfile>[0] = {
    full_name: parsed.data.fullName,
    role: parsed.data.role,
    city: parsed.data.city ?? null,
    phone: parsed.data.phone ?? null,
    onboarding_completed: true,
  };

  if (parsed.data.role === "provider") {
    const base = slugify(parsed.data.fullName) || "provider";
    updates.public_slug = `${base}-${user.id.slice(0, 4)}`;
  }

  try {
    await updateOwnProfile(updates);
  } catch {
    return { error: "პროფილის განახლება ვერ მოხერხდა." };
  }

  if (parsed.data.role === "provider") {
    const { error } = await supabase.from("provider_details").upsert({
      profile_id: user.id,
      law_firm: parsed.data.lawFirm ?? null,
    });
    if (error) {
      return { error: error.message };
    }
  }

  redirect("/dashboard");
}
