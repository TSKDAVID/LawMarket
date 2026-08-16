import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/page-shell";
import { CaseForm } from "@/components/cases/case-form";
import { getSessionUser } from "@/lib/auth";
import { getCategories } from "@/data/queries";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return { title: t("newTitle") };
}

export default async function NewCasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("cases");
  const user = await getSessionUser();

  if (!user) {
    redirect(`/${locale}/login/?next=/${locale}/cases/new/`);
  }
  if (user.profile?.role === "lawyer") {
    redirect(`/${locale}/cases/`);
  }

  const categories = await getCategories();

  return (
    <PageShell className="py-8 sm:py-10">
      <div className="mx-auto max-w-2xl border border-espresso/15 bg-white">
        <div className="border-b border-espresso/15 px-5 py-6 sm:px-8 sm:py-7">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
            {t("newTitle")}
          </h1>
          <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-espresso/70">
            {t("newSubtitle")}
          </p>
          <p className="mt-3 font-body text-xs leading-relaxed text-espresso/50">
            {t("privacyNote")}
          </p>
        </div>
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <CaseForm categories={categories} />
        </div>
      </div>
    </PageShell>
  );
}
