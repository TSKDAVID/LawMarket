import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ProviderProfileForm } from "@/components/provider/profile-form";

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const t = await getTranslations("dashboard.profile");

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

  if (profile?.role !== "provider") {
    return <p className="text-slate-500">{t("notProvider")}</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          {t("title")}
        </h1>
        {existing && (
          <Badge variant={existing.is_published ? "success" : "warning"}>
            {existing.is_published ? t("published") : t("unpublished")}
          </Badge>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <ProviderProfileForm
          areas={areas ?? []}
          values={{
            slug: existing?.slug ?? "",
            headline_ka: existing?.headline_ka ?? "",
            headline_en: existing?.headline_en ?? "",
            bio_ka: existing?.bio_ka ?? "",
            bio_en: existing?.bio_en ?? "",
            city: existing?.city ?? "",
            languages: existing?.languages ?? ["ka"],
            years_experience: existing?.years_experience ?? 0,
            accepts_expat: existing?.accepts_expat ?? false,
            is_published: existing?.is_published ?? false,
            practiceAreaIds:
              existing?.provider_practice_areas?.map(
                (pa: { practice_area_id: number }) => pa.practice_area_id,
              ) ?? [],
          }}
        />
      </div>
    </div>
  );
}
