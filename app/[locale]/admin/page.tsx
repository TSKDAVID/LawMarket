import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { requestTitle } from "@/lib/change-requests";
import type { Locale } from "@/i18n/routing";

export default async function AdminInboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;
  const t = await getTranslations("admin");
  const tPortal = await getTranslations("portal");
  const supabase = await createClient();

  const { data } = await supabase
    .from("change_requests")
    .select("*, lawyers(name, slug)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const requests = data ?? [];

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-espresso">
        {t("inboxTitle")}
      </h1>
      {requests.length === 0 ? (
        <p className="mt-4 font-body text-sm text-espresso/75">{t("inboxEmpty")}</p>
      ) : (
        <ul className="mt-6 divide-y divide-espresso/15 border border-espresso/20 bg-white/70">
          {requests.map((request) => {
            const lawyer = Array.isArray(request.lawyers)
              ? request.lawyers[0]
              : request.lawyers;
            return (
              <li key={request.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-brass">
                    {request.kind === "service"
                      ? tPortal("kindService")
                      : tPortal("kindCase")}
                    {lawyer && typeof lawyer === "object" && "name" in lawyer
                      ? ` · ${lawyer.name}`
                      : ""}
                  </p>
                  <p className="mt-2 font-heading font-semibold text-espresso">
                    {requestTitle(request.payload, loc)}
                  </p>
                </div>
                <Link
                  href={`/admin/requests/${request.id}`}
                  className="font-mono text-[11px] uppercase tracking-[0.14em] text-burgundy"
                >
                  {t("review")}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
