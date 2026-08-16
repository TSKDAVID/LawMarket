import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { requestTitle } from "@/lib/change-requests";
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
      <h1 className="font-heading text-3xl font-semibold text-espresso">
        {t("requestsTitle")}
      </h1>
      {requests.length === 0 ? (
        <p className="mt-4 font-body text-sm text-espresso/75">{t("noRequests")}</p>
      ) : (
        <ul className="mt-6 divide-y divide-espresso/15 border border-espresso/20 bg-white/70">
          {requests.map((request) => (
            <li key={request.id} className="px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-brass">
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
