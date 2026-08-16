import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOwnLawyer, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

export default async function PortalHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("portal");
  const user = await getSessionUser();
  const lawyer = await getOwnLawyer();

  const supabase = await createClient();
  const { count } = lawyer
    ? await supabase
        .from("change_requests")
        .select("id", { count: "exact", head: true })
        .eq("lawyer_id", lawyer.id)
        .eq("status", "pending")
    : { count: 0 };

  if (!lawyer) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold text-espresso">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-espresso/75">
          {t("noLawyerProfile")}
        </p>
        {user?.profile?.role === "admin" && (
          <Link
            href="/admin"
            className="mt-6 inline-flex h-12 items-center border border-burgundy bg-burgundy px-5 font-mono text-xs uppercase tracking-[0.16em] text-cream"
          >
            {t("goToAdmin")}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-espresso">
        {lawyer.name}
      </h1>
      <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-espresso/75">
        {t("welcomeBody")}
      </p>
      {typeof count === "number" && count > 0 && (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-brass">
          {t("pendingCount", { count })}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/portal/profile"
          className="inline-flex h-12 items-center border border-burgundy bg-burgundy px-5 font-mono text-xs uppercase tracking-[0.16em] text-cream"
        >
          {t("navProfile")}
        </Link>
        <Link
          href={`/lawyers/${lawyer.slug}`}
          className="inline-flex h-12 items-center border border-espresso/20 px-5 font-mono text-xs uppercase tracking-[0.16em] text-espresso"
        >
          {t("publicProfile")}
        </Link>
      </div>
    </div>
  );
}
