import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { getCategories } from "@/data/queries";
import { createClient } from "@/lib/supabase/server";
import { CaseRequestForm } from "@/components/workspace/portal-forms";
import { CaseManageCard } from "@/components/workspace/listing-editors";
import { ChangeRequestManageCard } from "@/components/workspace/change-request-editor";
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
  const [{ data }, { data: queued }] = await Promise.all([
    supabase
      .from("lawyer_cases")
      .select("*")
      .eq("lawyer_id", lawyer.id)
      .order("year", { ascending: false }),
    supabase
      .from("change_requests")
      .select("*")
      .eq("lawyer_id", lawyer.id)
      .eq("kind", "case")
      .in("status", ["pending", "rejected"])
      .order("created_at", { ascending: false }),
  ]);

  const cases = data ?? [];
  const queue = queued ?? [];

  return (
    <div>
      <WorkspaceHeading title={t("casesTitle")} />
      {queue.length > 0 && (
        <ul className="mb-8 divide-y divide-espresso/10 border border-espresso/12 border-t-[3px] border-t-burgundy bg-white">
          {queue.map((request) => (
            <ChangeRequestManageCard
              key={request.id}
              request={request}
              categories={categories}
            />
          ))}
        </ul>
      )}
      {cases.length === 0 && queue.length === 0 ? (
        <p className="mb-8 font-body text-sm text-espresso/60">{t("noCases")}</p>
      ) : cases.length > 0 ? (
        <ul className="divide-y divide-espresso/10 border border-espresso/12 border-t-[3px] border-t-burgundy bg-white">
          {cases.map((item) => (
            <CaseManageCard
              key={item.id}
              item={item}
              categories={categories}
            />
          ))}
        </ul>
      ) : null}
      <CaseRequestForm categories={categories} />
    </div>
  );
}
