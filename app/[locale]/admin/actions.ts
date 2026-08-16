"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { initialsFromName, slugify } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import type { Json } from "@/lib/supabase/database.types";

export type AdminState = {
  error: string | null;
  ok?: boolean;
  decision?: "approved" | "rejected";
};

function localeOf(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");
  return routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;
}

export async function createLawyerAccount(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  const locale = localeOf(formData);
  await requireAdmin(locale);

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!email || !password || !name) return { error: "createFailed" };
  if (password.length < 8) return { error: "createFailed" };

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "missingServiceRole" };
  }

  const admin = createAdminClient();
  const supabase = await createClient();

  let userId: string | null = null;
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (created.data.user) {
    userId = created.data.user.id;
  } else {
    const { data: listed } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = listed?.users.find(
      (user) => user.email?.toLowerCase() === email
    );
    if (!existing) return { error: "createFailed" };
    userId = existing.id;
    await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });
  }

  // Role changes must go through the signed-in admin session. The service-role
  // key has no auth.uid(), so guard_profile_role() would reject it.
  const { error: roleError } = await supabase
    .from("profiles")
    .update({ role: "lawyer", full_name: name, email })
    .eq("id", userId);
  if (roleError) return { error: "createFailed" };

  const { data: existingLawyer } = await supabase
    .from("lawyers")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (!existingLawyer) {
    let slug = slugify(name);
    const { data: clash } = await supabase
      .from("lawyers")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (clash) slug = `${slug}-${userId.slice(0, 6)}`;

    const { error: lawyerError } = await supabase.from("lawyers").insert({
      profile_id: userId,
      slug,
      name,
      initials: initialsFromName(name) || "LM",
      headline_ka: name,
      headline_en: name,
      bio_ka: "",
      bio_en: "",
      published: true,
      verified: true,
    });
    if (lawyerError) return { error: "createFailed" };
  }

  revalidatePath("/", "layout");
  revalidatePath(`/${locale}/lawyers/`);
  return { error: null, ok: true };
}

export async function reviewChangeRequest(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  const locale = localeOf(formData);
  const adminUser = await requireAdmin(locale);
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const note = String(formData.get("review_note") ?? "").trim() || null;
  if (!id || (decision !== "approved" && decision !== "rejected")) {
    return { error: "createFailed" };
  }

  const supabase = await createClient();
  const { data: request, error } = await supabase
    .from("change_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !request || request.status !== "pending") {
    return { error: "createFailed" };
  }

  if (decision === "rejected") {
    const { error: updateError } = await supabase
      .from("change_requests")
      .update({
        status: "rejected",
        review_note: note,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (updateError) return { error: "createFailed" };
    revalidatePath(`/${locale}/admin/`);
    return { error: null, ok: true, decision: "rejected" };
  }

  const payload = request.payload as Record<string, Json | undefined>;
  let createdId: string | null = null;

  if (request.kind === "service") {
    const { data: lawyer } = await supabase
      .from("lawyers")
      .select("slug")
      .eq("id", request.lawyer_id)
      .maybeSingle();
    const titleKa = String(payload.title_ka ?? "");
    const titleEn = String(payload.title_en ?? titleKa);
    let slug = slugify(titleEn || titleKa);
    const { data: clash } = await supabase
      .from("services")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (clash) slug = `${slug}-${request.id.slice(0, 6)}`;

    const { data: created, error: insertError } = await supabase
      .from("services")
      .insert({
        slug,
        category_id: String(payload.category_id ?? ""),
        lawyer_id: request.lawyer_id,
        title_ka: titleKa,
        title_en: titleEn,
        description_ka: String(payload.description_ka ?? ""),
        description_en: String(payload.description_en ?? ""),
        price: Number(payload.price ?? 0),
        price_max:
          payload.price_max === null || payload.price_max === undefined
            ? null
            : Number(payload.price_max),
        pricing_mode:
          payload.pricing_mode === "from" || payload.pricing_mode === "range"
            ? payload.pricing_mode
            : "fixed",
        duration_minutes:
          payload.duration_minutes === null || payload.duration_minutes === undefined
            ? null
            : Number(payload.duration_minutes),
        includes_ka: Array.isArray(payload.includes_ka)
          ? (payload.includes_ka as string[])
          : [],
        includes_en: Array.isArray(payload.includes_en)
          ? (payload.includes_en as string[])
          : [],
        published: true,
      })
      .select("id")
      .maybeSingle();
    if (insertError || !created) return { error: "createFailed" };
    createdId = created.id;
    revalidatePath(`/${locale}/services/`);
    if (lawyer?.slug) revalidatePath(`/${locale}/lawyers/${lawyer.slug}/`);
  }

  if (request.kind === "case") {
    const { data: created, error: insertError } = await supabase
      .from("lawyer_cases")
      .insert({
        lawyer_id: request.lawyer_id,
        category_id: payload.category_id ? String(payload.category_id) : null,
        title_ka: String(payload.title_ka ?? ""),
        title_en: String(payload.title_en ?? ""),
        description_ka: String(payload.description_ka ?? ""),
        description_en: String(payload.description_en ?? ""),
        year: payload.year ? Number(payload.year) : null,
        outcome_ka: String(payload.outcome_ka ?? ""),
        outcome_en: String(payload.outcome_en ?? ""),
        published: true,
      })
      .select("id")
      .maybeSingle();
    if (insertError || !created) return { error: "createFailed" };
    createdId = created.id;
    const { data: lawyer } = await supabase
      .from("lawyers")
      .select("slug")
      .eq("id", request.lawyer_id)
      .maybeSingle();
    if (lawyer?.slug) revalidatePath(`/${locale}/lawyers/${lawyer.slug}/`);
  }

  const { error: updateError } = await supabase
    .from("change_requests")
    .update({
      status: "approved",
      review_note: note,
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      created_record_id: createdId,
    })
    .eq("id", id);
  if (updateError) return { error: "createFailed" };

  revalidatePath(`/${locale}/admin/`);
  return { error: null, ok: true, decision: "approved" };
}

export type RosterLawyer = {
  id: string;
  name: string;
  slug: string;
  city: string;
  verified: boolean;
  published: boolean;
  suspended: boolean;
  email: string | null;
  hasLogin: boolean;
  serviceCount: number;
};

const MANAGE_INTENTS = [
  "hide",
  "show",
  "verify",
  "unverify",
  "suspend",
  "restore",
  "delete",
  "resetPassword",
] as const;

type ManageIntent = (typeof MANAGE_INTENTS)[number];

function isManageIntent(value: string): value is ManageIntent {
  return (MANAGE_INTENTS as readonly string[]).includes(value);
}

function revalidateLawyer(locale: string, slug: string) {
  revalidatePath("/", "layout");
  revalidatePath(`/${locale}/admin/lawyers/`);
  revalidatePath(`/${locale}/lawyers/`);
  revalidatePath(`/${locale}/lawyers/${slug}/`);
  revalidatePath(`/${locale}/services/`);
}

async function setListingsPublished(
  supabase: Awaited<ReturnType<typeof createClient>>,
  lawyerId: string,
  published: boolean
) {
  await supabase.from("services").update({ published }).eq("lawyer_id", lawyerId);
}

async function setAuthBanned(profileId: string | null, banned: boolean) {
  if (!profileId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(profileId, {
    ban_duration: banned ? "876600h" : "none",
  });
}

export async function manageLawyer(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  const locale = localeOf(formData);
  const adminUser = await requireAdmin(locale);
  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "");
  if (!id || !isManageIntent(intent)) return { error: "manageFailed" };

  const supabase = await createClient();
  const { data: lawyer, error } = await supabase
    .from("lawyers")
    .select("id, slug, name, profile_id, profiles(role)")
    .eq("id", id)
    .maybeSingle();
  if (error || !lawyer) return { error: "manageFailed" };

  const profile = Array.isArray(lawyer.profiles)
    ? lawyer.profiles[0]
    : lawyer.profiles;
  const profileRole =
    profile && typeof profile === "object" && "role" in profile
      ? profile.role
      : null;

  if (profileRole === "admin") return { error: "cannotModifyAdmin" };
  if (lawyer.profile_id && lawyer.profile_id === adminUser.id) {
    return { error: "cannotModifySelf" };
  }

  if (intent === "resetPassword") {
    const password = String(formData.get("password") ?? "");
    if (!lawyer.profile_id) return { error: "noLogin" };
    if (password.length < 8) return { error: "weakPassword" };
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { error: "missingServiceRole" };
    }
    const admin = createAdminClient();
    const { error: passwordError } = await admin.auth.admin.updateUserById(
      lawyer.profile_id,
      { password }
    );
    if (passwordError) return { error: "manageFailed" };
    revalidateLawyer(locale, lawyer.slug);
    return { error: null, ok: true };
  }

  if (intent === "delete") {
    await supabase.from("bookings").delete().eq("lawyer_id", id);
    await supabase.from("orders").delete().eq("lawyer_id", id);
    await supabase.from("services").delete().eq("lawyer_id", id);
    const { error: deleteError } = await supabase
      .from("lawyers")
      .delete()
      .eq("id", id);
    if (deleteError) return { error: "manageFailed" };
    if (lawyer.profile_id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      await admin.auth.admin.deleteUser(lawyer.profile_id);
    }
    revalidateLawyer(locale, lawyer.slug);
    return { error: null, ok: true };
  }

  if (intent === "verify" || intent === "unverify") {
    const { error: updateError } = await supabase
      .from("lawyers")
      .update({ verified: intent === "verify" })
      .eq("id", id);
    if (updateError) return { error: "manageFailed" };
    revalidateLawyer(locale, lawyer.slug);
    return { error: null, ok: true };
  }

  if (intent === "hide" || intent === "show") {
    const published = intent === "show";
    const { error: updateError } = await supabase
      .from("lawyers")
      .update({ published })
      .eq("id", id);
    if (updateError) return { error: "manageFailed" };
    await setListingsPublished(supabase, id, published);
    revalidateLawyer(locale, lawyer.slug);
    return { error: null, ok: true };
  }

  if (intent === "suspend") {
    const { error: updateError } = await supabase
      .from("lawyers")
      .update({ suspended: true, published: false })
      .eq("id", id);
    if (updateError) return { error: "manageFailed" };
    await setListingsPublished(supabase, id, false);
    await setAuthBanned(lawyer.profile_id, true);
    revalidateLawyer(locale, lawyer.slug);
    return { error: null, ok: true };
  }

  const { error: updateError } = await supabase
    .from("lawyers")
    .update({ suspended: false, published: true })
    .eq("id", id);
  if (updateError) return { error: "manageFailed" };
  await setListingsPublished(supabase, id, true);
  await setAuthBanned(lawyer.profile_id, false);
  revalidateLawyer(locale, lawyer.slug);
  return { error: null, ok: true };
}

