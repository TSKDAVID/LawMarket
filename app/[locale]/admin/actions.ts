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
      headline_ka: "",
      headline_en: "",
      bio_ka: "",
      bio_en: "",
      published: true,
      verified: true,
    });
    if (lawyerError) return { error: "createFailed" };
  }

  revalidatePath("/", "layout");
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
