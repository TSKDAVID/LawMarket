import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { CaseStatus } from "@/components/cases/case-ui";
import { getSessionUser, getOwnLawyer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/data/queries";
import { localizedCategoryName } from "@/data/localize";
import type { Locale } from "@/i18n/routing";
import type { ClientCaseRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return { title: t("platformKicker") };
}

function formatPosted(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function statusLabel(
  status: ClientCaseRow["status"],
  t: (key: string) => string
) {
  if (status === "closed") return t("statusClosed");
  if (status === "matched") return t("statusMatched");
  return t("statusOpen");
}

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("cases");
  const user = await getSessionUser();
  const lawyer = await getOwnLawyer();
  const role = user?.profile?.role;
  const isLawyerView = Boolean(lawyer) || role === "admin";
  const loc = locale as Locale;

  if (!user) {
    return (
      <PageShell className="py-12 sm:py-16">
        <h1 className="max-w-3xl font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-espresso">
          {t("guestTitle")}
        </h1>
        <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-espresso/75">
          {t("guestSubtitle")}
        </p>
        <p className="mt-3 max-w-xl font-body text-sm text-espresso/55">
          {t("privacyNote")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/login?next=/${locale}/cases/new/`}
            className="inline-flex h-12 items-center justify-center rounded-none border border-burgundy bg-burgundy px-5 font-mono text-sm tracking-wide text-cream hover:border-espresso hover:bg-espresso"
          >
            {t("guestLogin")}
          </Link>
          <Link
            href={`/signup?next=/${locale}/cases/new/`}
            className="inline-flex h-12 items-center justify-center rounded-none border border-burgundy px-5 font-mono text-sm tracking-wide text-burgundy hover:bg-burgundy hover:text-cream"
          >
            {t("guestSignup")}
          </Link>
        </div>
      </PageShell>
    );
  }

  const supabase = await createClient();
  const categories = await getCategories();
  const categoryName = (id: string | null) => {
    if (!id) return null;
    const category = categories.find((item) => item.id === id);
    return category ? localizedCategoryName(category, loc) : null;
  };

  const query = supabase
    .from("client_cases")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: rows } = isLawyerView
    ? await query.eq("status", "open")
    : await query.eq("client_id", user.id);
  const cases = (rows ?? []) as ClientCaseRow[];

  return (
    <PageShell className="py-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
            {isLawyerView ? t("boardTitle") : t("myTitle")}
          </h1>
          <p className="mt-2 font-body text-sm leading-relaxed text-espresso/70 sm:text-base">
            {isLawyerView ? t("boardSubtitle") : t("mySubtitle")}
          </p>
        </div>
        {!isLawyerView && (
          <Link
            href="/cases/new"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-none border border-burgundy bg-burgundy px-5 font-mono text-sm tracking-wide text-cream hover:border-espresso hover:bg-espresso"
          >
            {t("postCta")}
          </Link>
        )}
      </div>

      {cases.length === 0 ? (
        <p className="border border-espresso/15 bg-white px-6 py-16 text-center font-body text-sm text-espresso/60">
          {isLawyerView ? t("emptyBoard") : t("emptyMine")}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cases.map((row) => {
            const category = categoryName(row.category_id);
            return (
              <li key={row.id}>
                <Link
                  href={`/cases/${row.id}`}
                  className="group flex h-full flex-col border border-espresso/15 bg-white p-5 transition-colors hover:border-burgundy sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-heading text-lg font-semibold leading-snug text-espresso group-hover:text-burgundy">
                      {row.title}
                    </h2>
                    <CaseStatus
                      status={row.status}
                      label={statusLabel(row.status, t)}
                    />
                  </div>
                  <p className="mt-3 flex-1 line-clamp-3 font-body text-sm leading-relaxed text-espresso/70">
                    {row.description}
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-espresso/45">
                    {formatPosted(row.created_at, loc)}
                    {row.city ? ` · ${row.city}` : ""}
                    {category ? ` · ${category}` : ""}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
