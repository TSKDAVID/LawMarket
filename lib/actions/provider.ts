"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProviderFormState = { error?: string; success?: boolean } | null;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function saveProviderProfile(
  _prev: ProviderFormState,
  formData: FormData,
): Promise<ProviderFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const slug = slugify(String(formData.get("slug") ?? ""));
  if (!slug) return { error: "generic" };

  const { data: taken } = await supabase
    .from("provider_profiles")
    .select("id")
    .eq("slug", slug)
    .neq("id", user.id)
    .maybeSingle();

  if (taken) return { error: "slugTaken" };

  const languages = String(formData.get("languages") ?? "")
    .split(",")
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean);

  const payload = {
    id: user.id,
    slug,
    headline_ka: String(formData.get("headline_ka") ?? "").trim(),
    headline_en: String(formData.get("headline_en") ?? "").trim(),
    bio_ka: String(formData.get("bio_ka") ?? "").trim(),
    bio_en: String(formData.get("bio_en") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    languages,
    years_experience: Number(formData.get("years_experience") ?? 0) || 0,
    accepts_expat: formData.get("accepts_expat") === "on",
    is_published: formData.get("is_published") === "on",
  };

  const { error } = await supabase
    .from("provider_profiles")
    .upsert(payload, { onConflict: "id" });

  if (error) return { error: "generic" };

  const areaIds = formData
    .getAll("practice_areas")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);

  await supabase
    .from("provider_practice_areas")
    .delete()
    .eq("provider_id", user.id);
  if (areaIds.length > 0) {
    await supabase.from("provider_practice_areas").insert(
      areaIds.map((practice_area_id) => ({
        provider_id: user.id,
        practice_area_id,
      })),
    );
  }

  revalidatePath("/dashboard", "layout");

  if (formData.get("from_onboarding") === "1") {
    redirect("/dashboard");
  }
  return { success: true };
}

export async function saveService(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const payload = {
    provider_id: user.id,
    program_id: Number(formData.get("program_id")),
    title_ka: String(formData.get("title_ka") ?? "").trim(),
    title_en: String(formData.get("title_en") ?? "").trim(),
    description_ka: String(formData.get("description_ka") ?? "").trim(),
    description_en: String(formData.get("description_en") ?? "").trim(),
    price_gel: Number(formData.get("price_gel") ?? 0) || 0,
    duration_min: Number(formData.get("duration_min")) || null,
  };

  if (id) {
    await supabase.from("services").update(payload).eq("id", id);
  } else {
    await supabase.from("services").insert(payload);
  }

  revalidatePath("/dashboard/services");
}

export async function toggleService(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("is_active") === "true";

  await supabase.from("services").update({ is_active: !isActive }).eq("id", id);
  revalidatePath("/dashboard/services");
}

export async function deleteService(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("services")
    .delete()
    .eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/dashboard/services");
}

export async function submitCase(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("cases").insert({
    provider_id: user.id,
    case_number: String(formData.get("case_number") ?? "").trim(),
    title_ka: String(formData.get("title_ka") ?? "").trim(),
    title_en: String(formData.get("title_en") ?? "").trim(),
    summary_ka: String(formData.get("summary_ka") ?? "").trim(),
    summary_en: String(formData.get("summary_en") ?? "").trim(),
    practice_area_id: Number(formData.get("practice_area_id")) || null,
    year: Number(formData.get("year")) || null,
    registry_url: String(formData.get("registry_url") ?? "").trim() || null,
  });

  revalidatePath("/dashboard/cases");
  redirect("/dashboard/cases?submitted=1");
}

export async function deleteCase(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("cases")
    .delete()
    .eq("id", String(formData.get("id") ?? ""))
    .eq("status", "pending");
  revalidatePath("/dashboard/cases");
}
