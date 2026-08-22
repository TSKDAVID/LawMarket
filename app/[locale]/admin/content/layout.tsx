import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ContentSubnav } from "@/components/admin/content-subnav";

export default async function AdminContentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "en" | "ka");

  const supabase = await createClient();
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("handled", false);

  return (
    <div>
      <ContentSubnav messageCount={count ?? 0} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
