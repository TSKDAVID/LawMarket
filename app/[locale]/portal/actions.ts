"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOwnLawyer, requireLawyer } from "@/lib/auth";
import { initialsFromName } from "@/lib/utils";
import { routing } from "@/i18n/routing";

export type PortalState = { error: string | null; ok?: boolean };

function localeOf(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");
  return routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function fallbackEn(ka: string, en: string) {
  return en.trim() ? en.trim() : ka.trim();
}

const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

async function uploadPortrait(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File
) {
  if (file.size > PHOTO_MAX_BYTES) return { error: "photoTooLarge" as const };
  const ext = PHOTO_TYPES[file.type];
  if (!ext) return { error: "photoType" as const };

  const path = `portraits/${userId}/portrait.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });
  if (error) {
    console.error("[portrait]", error.message);
    return { error: "photoUploadFailed" as const };
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: `${data.publicUrl}?v=${Date.now()}` };
}

export async function updateOwnProfile(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "saveFailed" };

  const name = String(formData.get("name") ?? "").trim();
  const headlineKa = String(formData.get("headline_ka") ?? "").trim();
  if (!name || !headlineKa) return { error: "missingKa" };

  const languages = String(formData.get("languages") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "saveFailed" };

  let photoUrl = String(formData.get("photo_url") ?? "").trim() || lawyer.photo_url;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const uploaded = await uploadPortrait(supabase, user.id, photo);
    if (uploaded.error) return { error: uploaded.error };
    photoUrl = uploaded.url ?? photoUrl;
  }

  const { error } = await supabase
    .from("lawyers")
    .update({
      name,
      initials: initialsFromName(name) || lawyer.initials,
      headline_ka: headlineKa,
      headline_en: fallbackEn(
        headlineKa,
        String(formData.get("headline_en") ?? "")
      ),
      bio_ka: String(formData.get("bio_ka") ?? "").trim(),
      bio_en: fallbackEn(
        String(formData.get("bio_ka") ?? ""),
        String(formData.get("bio_en") ?? "")
      ),
      city: String(formData.get("city") ?? "").trim() || lawyer.city,
      languages,
      years_experience: Number(formData.get("years") ?? lawyer.years_experience) || 0,
      phone: String(formData.get("phone") ?? "").trim() || null,
      contact_email: String(formData.get("contact_email") ?? "").trim() || null,
      photo_url: photoUrl || null,
    })
    .eq("id", lawyer.id);

  if (error) return { error: "saveFailed" };

  await supabase
    .from("profiles")
    .update({
      full_name: name,
      phone: String(formData.get("phone") ?? "").trim() || null,
    })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  revalidatePath(`/${locale}/lawyers/${lawyer.slug}/`);
  return { error: null, ok: true };
}

export async function updatePassword(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  await requireLawyer(locale);

  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  if (!current || !next || !confirm) return { error: "missingFields" };
  if (next.length < 8) return { error: "weakPassword" };
  if (next !== confirm) return { error: "passwordMismatch" };
  if (next === current) return { error: "passwordUnchanged" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "saveFailed" };

  const { error: check } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (check) return { error: "currentPasswordWrong" };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { error: "saveFailed" };
  return { error: null, ok: true };
}

export async function submitServiceRequest(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  const user = await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "saveFailed" };

  const titleKa = String(formData.get("title_ka") ?? "").trim();
  const descriptionKa = String(formData.get("description_ka") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  if (!titleKa || !descriptionKa || !categoryId || !(price >= 0)) {
    return { error: "missingKa" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("change_requests").insert({
    kind: "service",
    lawyer_id: lawyer.id,
    submitted_by: user.id,
    payload: {
      title_ka: titleKa,
      title_en: fallbackEn(titleKa, String(formData.get("title_en") ?? "")),
      description_ka: descriptionKa,
      description_en: fallbackEn(
        descriptionKa,
        String(formData.get("description_en") ?? "")
      ),
      category_id: categoryId,
      price,
      duration_minutes: Number(formData.get("duration") ?? 0) || null,
      includes_ka: lines(formData.get("includes_ka")),
      includes_en: (() => {
        const en = lines(formData.get("includes_en"));
        return en.length ? en : lines(formData.get("includes_ka"));
      })(),
    },
  });

  if (error) return { error: "saveFailed" };
  revalidatePath(`/${locale}/admin/`);
  return { error: null, ok: true };
}

export async function submitCaseRequest(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  const user = await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "saveFailed" };

  const titleKa = String(formData.get("title_ka") ?? "").trim();
  const descriptionKa = String(formData.get("description_ka") ?? "").trim();
  if (!titleKa || !descriptionKa) return { error: "missingKa" };

  const yearRaw = String(formData.get("year") ?? "").trim();
  const year = yearRaw ? Number(yearRaw) : null;

  const supabase = await createClient();
  const { error } = await supabase.from("change_requests").insert({
    kind: "case",
    lawyer_id: lawyer.id,
    submitted_by: user.id,
    payload: {
      title_ka: titleKa,
      title_en: fallbackEn(titleKa, String(formData.get("title_en") ?? "")),
      description_ka: descriptionKa,
      description_en: fallbackEn(
        descriptionKa,
        String(formData.get("description_en") ?? "")
      ),
      category_id: String(formData.get("category_id") ?? "").trim() || null,
      year: Number.isFinite(year) ? year : null,
      outcome_ka: String(formData.get("outcome_ka") ?? "").trim(),
      outcome_en: fallbackEn(
        String(formData.get("outcome_ka") ?? ""),
        String(formData.get("outcome_en") ?? "")
      ),
    },
  });

  if (error) return { error: "saveFailed" };
  revalidatePath(`/${locale}/admin/`);
  return { error: null, ok: true };
}

function revalidateListings(
  locale: string,
  lawyerSlug: string,
  serviceSlug?: string
) {
  revalidatePath(`/${locale}/portal/services/`);
  revalidatePath(`/${locale}/portal/cases/`);
  revalidatePath(`/${locale}/lawyers/${lawyerSlug}/`);
  revalidatePath(`/${locale}/services/`);
  if (serviceSlug) revalidatePath(`/${locale}/services/${serviceSlug}/`);
}

export async function updateOwnService(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "saveFailed" };

  const id = String(formData.get("id") ?? "");
  const titleKa = String(formData.get("title_ka") ?? "").trim();
  const descriptionKa = String(formData.get("description_ka") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  if (!id || !titleKa || !descriptionKa || !categoryId || !(price >= 0)) {
    return { error: "missingKa" };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("services")
    .select("slug")
    .eq("id", id)
    .eq("lawyer_id", lawyer.id)
    .maybeSingle();
  if (!existing) return { error: "saveFailed" };

  const { error } = await supabase
    .from("services")
    .update({
      title_ka: titleKa,
      title_en: fallbackEn(titleKa, String(formData.get("title_en") ?? "")),
      description_ka: descriptionKa,
      description_en: fallbackEn(
        descriptionKa,
        String(formData.get("description_en") ?? "")
      ),
      category_id: categoryId,
      price,
      duration_minutes: Number(formData.get("duration") ?? 0) || null,
      includes_ka: lines(formData.get("includes_ka")),
      includes_en: (() => {
        const en = lines(formData.get("includes_en"));
        return en.length ? en : lines(formData.get("includes_ka"));
      })(),
    })
    .eq("id", id)
    .eq("lawyer_id", lawyer.id);

  if (error) return { error: "saveFailed" };
  revalidateListings(locale, lawyer.slug, existing.slug);
  return { error: null, ok: true };
}

export async function deleteOwnService(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "saveFailed" };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "saveFailed" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("services")
    .select("slug")
    .eq("id", id)
    .eq("lawyer_id", lawyer.id)
    .maybeSingle();
  if (!existing) return { error: "saveFailed" };

  const { error, count } = await supabase
    .from("services")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("lawyer_id", lawyer.id);

  if (error) {
    return { error: error.code === "23503" ? "listingInUse" : "saveFailed" };
  }
  if (!count) return { error: "saveFailed" };
  revalidateListings(locale, lawyer.slug, existing.slug);
  return { error: null, ok: true };
}

export async function updateOwnCase(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "saveFailed" };

  const id = String(formData.get("id") ?? "");
  const titleKa = String(formData.get("title_ka") ?? "").trim();
  const descriptionKa = String(formData.get("description_ka") ?? "").trim();
  if (!id || !titleKa || !descriptionKa) return { error: "missingKa" };

  const yearRaw = String(formData.get("year") ?? "").trim();
  const year = yearRaw ? Number(yearRaw) : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("lawyer_cases")
    .update({
      title_ka: titleKa,
      title_en: fallbackEn(titleKa, String(formData.get("title_en") ?? "")),
      description_ka: descriptionKa,
      description_en: fallbackEn(
        descriptionKa,
        String(formData.get("description_en") ?? "")
      ),
      category_id: String(formData.get("category_id") ?? "").trim() || null,
      year: Number.isFinite(year) ? year : null,
      outcome_ka: String(formData.get("outcome_ka") ?? "").trim(),
      outcome_en: fallbackEn(
        String(formData.get("outcome_ka") ?? ""),
        String(formData.get("outcome_en") ?? "")
      ),
    })
    .eq("id", id)
    .eq("lawyer_id", lawyer.id);

  if (error) return { error: "saveFailed" };
  revalidateListings(locale, lawyer.slug);
  return { error: null, ok: true };
}

export async function deleteOwnCase(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const locale = localeOf(formData);
  await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "saveFailed" };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "saveFailed" };

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("lawyer_cases")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("lawyer_id", lawyer.id);

  if (error || !count) return { error: "saveFailed" };
  revalidateListings(locale, lawyer.slug);
  return { error: null, ok: true };
}
