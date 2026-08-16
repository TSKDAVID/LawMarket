import { getTranslations, setRequestLocale } from "next-intl/server";
import { PasswordForm } from "@/components/workspace/portal-forms";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import type { Locale } from "@/i18n/routing";

export default async function PortalPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("portal");

  return (
    <div>
      <WorkspaceHeading
        title={t("passwordTitle")}
        description={t("passwordBody")}
      />
      <PasswordForm />
    </div>
  );
}
