import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { getCategories } from "@/data/queries";
import { createClient } from "@/lib/supabase/server";
import { ServiceRequestForm } from "@/components/workspace/portal-forms";
import { ServiceManageCard } from "@/components/workspace/listing-editors";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import type { Locale } from "@/i18n/routing";

export default async function PortalServicesPage({
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
    .from("services")
    .select("*")
    .eq("lawyer_id", lawyer.id)
    .order("sort_order");

  const services = data ?? [];

  return (
    <div>
      <WorkspaceHeading title={t("servicesTitle")} />
      {services.length === 0 ? (
        <p className="mb-8 font-body text-sm text-espresso/60">{t("noServices")}</p>
      ) : (
        <ul className="divide-y divide-espresso/10 border border-espresso/12 border-t-[3px] border-t-burgundy bg-white">
          {services.map((service) => (
            <ServiceManageCard
              key={service.id}
              service={service}
              categories={categories}
            />
          ))}
        </ul>
      )}
      <ServiceRequestForm categories={categories} />
    </div>
  );
}
