import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();
  const { count } = await supabase
    .from("change_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <WorkspaceShell
      title={t("title")}
      items={[
        { href: "/admin", label: t("navInbox"), count: count ?? 0 },
        { href: "/admin/lawyers", label: t("navLawyers") },
      ]}
    >
      {children}
    </WorkspaceShell>
  );
}
