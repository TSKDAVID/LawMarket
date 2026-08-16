import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { CasesChrome } from "@/components/cases/cases-chrome";
import { getOwnLawyer, getSessionUser } from "@/lib/auth";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function CasesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const user = await getSessionUser();
  const lawyer = await getOwnLawyer();
  const isLawyer = Boolean(lawyer) || user?.profile?.role === "admin";

  return (
    <div className="paper-grain min-h-[70vh] bg-cream">
      <CasesChrome signedIn={Boolean(user)} isLawyer={isLawyer} />
      {children}
    </div>
  );
}
