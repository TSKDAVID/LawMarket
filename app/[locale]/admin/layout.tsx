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
  const [{ count: inboxCount }, { count: messageCount }] = await Promise.all([
    supabase
      .from("change_requests")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "rejected"]),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("handled", false),
  ]);

  return (
    <WorkspaceShell
      title={t("title")}
      items={[
        { href: "/admin", label: t("navInbox"), count: inboxCount ?? 0 },
        { href: "/admin/lawyers", label: t("navLawyers") },
        { href: "/admin/content", label: t("navContent") },
        {
          href: "/admin/content/messages",
          label: t("navMessages"),
          count: messageCount ?? 0,
        },
        { href: "/admin/password", label: t("navPassword") },
      ]}
    >
      {children}
    </WorkspaceShell>
  );
}
