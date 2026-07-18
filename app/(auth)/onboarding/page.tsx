import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProviderProfileForm } from "@/components/provider/profile-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding");

  const t = await getTranslations("onboarding");

  const [{ data: profile }, { data: areas }, { data: existing }] =
    await Promise.all([
      supabase.from("profiles").select("role, full_name").eq("id", user.id).single(),
      supabase.from("practice_areas").select("*").order("id"),
      supabase
        .from("provider_profiles")
        .select("*, provider_practice_areas ( practice_area_id )")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

  if (profile?.role !== "provider") redirect("/dashboard");

  const suggestedSlug = (profile.full_name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
        <div className="mt-8">
          <ProviderProfileForm
            fromOnboarding={!existing}
            areas={areas ?? []}
            values={{
              slug: existing?.slug ?? suggestedSlug,
              headline_ka: existing?.headline_ka ?? "",
              headline_en: existing?.headline_en ?? "",
              bio_ka: existing?.bio_ka ?? "",
              bio_en: existing?.bio_en ?? "",
              city: existing?.city ?? "",
              languages: existing?.languages ?? ["ka"],
              years_experience: existing?.years_experience ?? 0,
              accepts_expat: existing?.accepts_expat ?? false,
              is_published: existing?.is_published ?? true,
              practiceAreaIds:
                existing?.provider_practice_areas?.map(
                  (pa: { practice_area_id: number }) => pa.practice_area_id,
                ) ?? [],
            }}
          />
        </div>
      </div>
    </div>
  );
}
