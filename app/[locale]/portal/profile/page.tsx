import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { ProfileForm, PasswordForm } from "@/components/workspace/portal-forms";
import type { Locale } from "@/i18n/routing";

export default async function PortalProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("portal");
  const lawyer = await getOwnLawyer();

  if (!lawyer) {
    return <p className="font-body text-sm text-espresso/75">{t("noLawyerProfile")}</p>;
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl font-semibold text-espresso">
        {t("profileTitle")}
      </h1>
      <ProfileForm lawyer={lawyer} />
      <PasswordForm />
    </div>
  );
}
