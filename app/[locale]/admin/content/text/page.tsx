import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import { CmsTextForm } from "@/components/admin/cms-text-form";
import { getCmsTextValues } from "@/lib/cms/admin-data";
import type { Locale } from "@/i18n/routing";

export default async function AdminContentTextPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("admin.content");
  const values = await getCmsTextValues();

  return (
    <>
      <WorkspaceHeading
        title={t("textTitle")}
        description={t("textBody")}
      />
      <CmsTextForm locale={locale} values={values} />
    </>
  );
}
