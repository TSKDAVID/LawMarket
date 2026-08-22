import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer, requireLawyer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireLawyer(locale);
  const lawyer = await getOwnLawyer();
  const t = await getTranslations("portal");

  const supabase = await createClient();
  const { count } = lawyer
    ? await supabase
        .from("change_requests")
        .select("id", { count: "exact", head: true })
        .eq("lawyer_id", lawyer.id)
        .in("status", ["pending", "rejected"])
    : { count: 0 };

  return (
    <WorkspaceShell
      title={t("title")}
      items={[
        { href: "/portal/profile", label: t("navProfile") },
        { href: "/portal/password", label: t("navPassword") },
        { href: "/portal/services", label: t("navServices") },
        { href: "/portal/cases", label: t("navCases") },
        { href: "/portal/bookings", label: t("navBookings") },
        { href: "/cases", label: t("navOpenCases") },
        {
          href: "/portal/requests",
          label: t("navRequests"),
          count: count ?? 0,
        },
      ]}
    >
      {children}
    </WorkspaceShell>
  );
}
