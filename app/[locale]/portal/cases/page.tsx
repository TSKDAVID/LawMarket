import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { getCategories } from "@/data/queries";
import { createClient } from "@/lib/supabase/server";
import { CaseRequestForm } from "@/components/workspace/portal-forms";
import { CaseManageCard } from "@/components/workspace/listing-editors";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import type { Locale } from "@/i18n/routing";

export default async function PortalCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
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
      <WorkspaceHeading title={t("casesTitle")} />
      {cases.length === 0 ? (
        <p className="mb-8 font-body text-sm text-espresso/60">{t("noCases")}</p>
      ) : (
        <ul className="divide-y divide-espresso/10 border border-espresso/12 border-t-[3px] border-t-burgundy bg-white">
          {cases.map((item) => (
            <CaseManageCard
              key={item.id}
              item={item}
              categories={categories}
            />
          ))}
        </ul>
      )}
      <CaseRequestForm categories={categories} />
    </div>
  );
}
