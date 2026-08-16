import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { requestTitle } from "@/lib/change-requests";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import type { Locale } from "@/i18n/routing";

export default async function PortalRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;
  const t = await getTranslations("portal");
  const lawyer = await getOwnLawyer();

  if (!lawyer) {
    return <p className="font-body text-sm text-espresso/75">{t("noLawyerProfile")}</p>;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("change_requests")
    .select("*")
    .eq("lawyer_id", lawyer.id)
    .order("created_at", { ascending: false });

  const requests = data ?? [];

  return (
    <div>
      <WorkspaceHeading title={t("requestsTitle")} />
      {requests.length === 0 ? (
        <p className="font-body text-sm text-espresso/60">{t("noRequests")}</p>
      ) : (
        <ul className="divide-y divide-espresso/10 border border-espresso/12 border-t-[3px] border-t-burgundy bg-white">
          {requests.map((request) => (
            <li key={request.id} className="px-4 py-4 sm:px-5">
              <p className="font-mono text-sm tracking-wide text-brass">
                {request.kind === "service" ? t("kindService") : t("kindCase")}
                {" · "}
                {request.status === "pending"
                  ? t("statusPending")
                  : request.status === "approved"
                    ? t("statusApproved")
                    : t("statusRejected")}
              </p>
              <p className="mt-2 font-heading font-semibold text-espresso">
                {requestTitle(request.payload, loc)}
              </p>
              {request.review_note && (
                <p className="mt-2 font-body text-sm text-espresso/70">
                  {request.review_note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
