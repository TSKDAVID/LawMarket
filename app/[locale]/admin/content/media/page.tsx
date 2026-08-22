import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import { CmsMediaForm } from "@/components/admin/cms-media-form";
import { getSiteSettings } from "@/lib/cms/settings";
import type { Locale } from "@/i18n/routing";

export default async function AdminContentMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("admin.content");
  const settings = await getSiteSettings();

  return (
    <>
      <WorkspaceHeading
        title={t("mediaTitle")}
        description={t("mediaBody")}
      />
      <CmsMediaForm locale={locale} settings={settings} />
    </>
  );
}
