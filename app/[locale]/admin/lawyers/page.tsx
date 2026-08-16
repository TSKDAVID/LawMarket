import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CreateLawyerForm } from "@/components/workspace/admin-forms";
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

  const { data } = await supabase
    .from("lawyers")
    .select("id, name, slug, verified, published, profiles(email)")
    .order("created_at", { ascending: false });

  const lawyers = data ?? [];

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
      <ul className="mt-4 divide-y divide-espresso/15 border border-espresso/20 bg-white/70">
        {lawyers.map((lawyer) => {
          const profile = Array.isArray(lawyer.profiles)
            ? lawyer.profiles[0]
            : lawyer.profiles;
          const email =
            profile && typeof profile === "object" && "email" in profile
              ? profile.email
              : null;
          return (
            <li key={lawyer.id} className="px-5 py-4">
              <p className="font-heading font-semibold text-espresso">
                {lawyer.name}
              </p>
              <p className="mt-1 font-body text-xs text-espresso/65">
                {email ?? lawyer.slug}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
