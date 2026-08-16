import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOwnLawyer } from "@/lib/auth";
import { ProfileForm } from "@/components/workspace/portal-forms";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
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
      <WorkspaceHeading
        title={t("profileTitle")}
        description={t("profileLead")}
        action={
          <Link
            href={`/lawyers/${lawyer.slug}`}
            className="inline-flex h-11 w-full items-center justify-center border border-burgundy px-4 font-mono text-sm tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-cream sm:w-auto"
          >
            {t("publicProfile")}
          </Link>
        }
      />
      <ProfileForm lawyer={lawyer} />
    </div>
  );
}
