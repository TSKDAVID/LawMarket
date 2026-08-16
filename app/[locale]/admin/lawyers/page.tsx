import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CreateLawyerForm } from "@/components/workspace/admin-forms";
import { LawyerRoster } from "@/components/workspace/lawyer-roster";
import type { RosterLawyer } from "@/app/[locale]/admin/actions";
import type { Locale } from "@/i18n/routing";

export default async function AdminLawyersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  let { data, error } = await supabase
    .from("lawyers")
    .select(
      "id, name, slug, city, verified, published, suspended, profile_id, profiles(email)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    const fallback = await supabase
      .from("lawyers")
      .select(
        "id, name, slug, city, verified, published, profile_id, profiles(email)"
      )
      .order("created_at", { ascending: false });
    data = (fallback.data ?? []).map((lawyer) => ({
      ...lawyer,
      suspended: false,
    }));
  }

  const rows = data ?? [];
  const ids = rows.map((lawyer) => lawyer.id);
  const { data: serviceRows } =
    ids.length > 0
      ? await supabase.from("services").select("lawyer_id").in("lawyer_id", ids)
      : { data: [] };

  const serviceCountByLawyer = new Map<string, number>();
  for (const row of serviceRows ?? []) {
    serviceCountByLawyer.set(
      row.lawyer_id,
      (serviceCountByLawyer.get(row.lawyer_id) ?? 0) + 1
    );
  }

  const lawyers: RosterLawyer[] = rows.map((lawyer) => {
    const profile = Array.isArray(lawyer.profiles)
      ? lawyer.profiles[0]
      : lawyer.profiles;
    const email =
      profile && typeof profile === "object" && "email" in profile
        ? (profile.email as string | null)
        : null;
    return {
      id: lawyer.id,
      name: lawyer.name,
      slug: lawyer.slug,
      city: lawyer.city,
      verified: lawyer.verified,
      published: lawyer.published,
      suspended: lawyer.suspended,
      email,
      hasLogin: Boolean(lawyer.profile_id),
      serviceCount: serviceCountByLawyer.get(lawyer.id) ?? 0,
    };
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-espresso">
        {t("createLawyer")}
      </h1>
      <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-espresso/75">
        {t("createLawyerBody")}
      </p>
      <div className="mt-8 max-w-lg">
        <CreateLawyerForm />
      </div>

      <h2 className="mt-12 font-heading text-xl font-semibold text-espresso">
        {t("existingLawyers")}
      </h2>
      <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-espresso/75">
        {t("manageLawyersBody")}
      </p>
      <LawyerRoster lawyers={lawyers} />
    </div>
  );
}
