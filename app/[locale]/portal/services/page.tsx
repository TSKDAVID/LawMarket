import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { getCategories } from "@/data/queries";
import { createClient } from "@/lib/supabase/server";
import { ServiceRequestForm } from "@/components/workspace/portal-forms";
import { ServiceManageCard } from "@/components/workspace/listing-editors";
import { ChangeRequestManageCard } from "@/components/workspace/change-request-editor";
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
  const [{ data }, { data: queued }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("lawyer_id", lawyer.id)
      .order("sort_order"),
    supabase
      .from("change_requests")
      .select("*")
      .eq("lawyer_id", lawyer.id)
      .eq("kind", "service")
      .in("status", ["pending", "rejected"])
      .order("created_at", { ascending: false }),
  ]);

  const services = data ?? [];
  const queue = queued ?? [];

  return (
    <div>
      <WorkspaceHeading title={t("servicesTitle")} />
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
      {services.length === 0 && queue.length === 0 ? (
        <p className="mb-8 font-body text-sm text-espresso/60">{t("noServices")}</p>
      ) : services.length > 0 ? (
        <ul className="divide-y divide-espresso/10 border border-espresso/12 border-t-[3px] border-t-burgundy bg-white">
          {services.map((service) => (
            <ServiceManageCard
              key={service.id}
              service={service}
              categories={categories}
            />
          ))}
        </ul>
      ) : null}
      <ServiceRequestForm categories={categories} />
    </div>
  );
}
