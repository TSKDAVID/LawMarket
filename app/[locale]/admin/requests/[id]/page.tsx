import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/workspace/admin-forms";
import { payloadLines, requestTitle } from "@/lib/change-requests";
import type { Locale } from "@/i18n/routing";

export default async function AdminReviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;
  const t = await getTranslations("admin");
  const tPortal = await getTranslations("portal");
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("change_requests")
    .select("*, lawyers(name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (!request) notFound();

  const lawyer = Array.isArray(request.lawyers)
    ? request.lawyers[0]
    : request.lawyers;

  return (
    <div>
      <Link
        href="/admin"
        className="font-mono text-[11px] uppercase tracking-[0.14em] text-espresso/70"
      >
        ← {t("navInbox")}
      </Link>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-brass">
        {request.kind === "service" ? tPortal("kindService") : tPortal("kindCase")}
        {lawyer && typeof lawyer === "object" && "name" in lawyer
          ? ` · ${lawyer.name}`
          : ""}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-espresso">
        {requestTitle(request.payload, loc)}
      </h1>
      <p className="mt-2 font-body text-sm text-espresso/70">{t("payload")}</p>
      <dl className="mt-4 space-y-3 border border-espresso/20 bg-white/70 p-5">
        {payloadLines(request.payload).map((line) => (
          <div key={line.label}>
            <dt className="font-mono text-sm text-espresso">
              {line.label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap font-body text-sm text-espresso">
              {line.value}
            </dd>
          </div>
        ))}
      </dl>
      {request.status === "approved" ? (
        <p className="mt-6 font-body text-sm text-espresso/75">
          {t("approved")}
        </p>
      ) : (
        <>
          {request.status === "rejected" && (
            <p className="mt-6 font-body text-sm text-burgundy">
              {t("previouslyRejected")}
            </p>
          )}
          {request.review_note && request.status === "rejected" && (
            <p className="mt-2 font-body text-sm text-espresso/70">
              {request.review_note}
            </p>
          )}
          <ReviewForm id={request.id} />
        </>
      )}
    </div>
  );
}
