import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import { CmsContactForm } from "@/components/admin/cms-contact-form";
import { getSiteSettings } from "@/lib/cms/settings";
import type { Locale } from "@/i18n/routing";

export default async function AdminContentContactPage({
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
        title={t("contactTitle")}
        description={t("contactBody")}
      />
      <CmsContactForm locale={locale} settings={settings} />
    </>
  );
}
