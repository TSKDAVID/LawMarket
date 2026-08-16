import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { getCategories } from "@/data/queries";
import { createClient } from "@/lib/supabase/server";
import { CaseRequestForm } from "@/components/workspace/portal-forms";
import { localizedCaseTitle } from "@/data/localize";
import type { Locale } from "@/i18n/routing";

export default async function PortalCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;
  const t = await getTranslations("portal");
  const lawyer = await getOwnLawyer();
  const categories = await getCategories();

  if (!lawyer) {
    return <p className="font-body text-sm text-espresso/75">{t("noLawyerProfile")}</p>;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("lawyer_cases")
    .select("*")
    .eq("lawyer_id", lawyer.id)
    .order("year", { ascending: false });

  const cases = data ?? [];

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-espresso">
        {t("casesTitle")}
      </h1>
      {cases.length === 0 ? (
        <p className="mt-4 font-body text-sm text-espresso/75">{t("noCases")}</p>
      ) : (
        <ul className="mt-6 divide-y divide-espresso/15 border border-espresso/20 bg-white/70">
          {cases.map((item) => (
            <li key={item.id} className="px-5 py-4">
              <p className="font-heading font-semibold text-espresso">
                {localizedCaseTitle(
                  {
                    id: item.id,
                    lawyerId: item.lawyer_id,
                    categoryId: item.category_id ?? undefined,
                    title_en: item.title_en,
                    title_ka: item.title_ka,
                    description_en: item.description_en,
                    description_ka: item.description_ka,
                    year: item.year,
                    outcome_en: item.outcome_en,
                    outcome_ka: item.outcome_ka,
                  },
                  loc
                )}
              </p>
              {item.year && (
                <p className="mt-1 font-body text-xs text-espresso/65">{item.year}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <CaseRequestForm categories={categories} />
    </div>
  );
}
