import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const t = await getTranslations("dashboard.nav");
  const isProvider = profile?.role === "provider";

  const items = [
    { href: "/dashboard", label: t("overview"), icon: "LayoutDashboard" },
    ...(isProvider
      ? [
          { href: "/dashboard/profile", label: t("profile"), icon: "UserRound" },
          {
            href: "/dashboard/services",
            label: t("services"),
            icon: "BriefcaseBusiness",
          },
          { href: "/dashboard/cases", label: t("cases"), icon: "FileCheck" },
        ]
      : []),
    { href: "/dashboard/bookings", label: t("bookings"), icon: "CalendarDays" },
    { href: "/dashboard/messages", label: t("messages"), icon: "MessageSquare" },
    ...(!isProvider
      ? [
          {
            href: "/dashboard/applications",
            label: t("applications"),
            icon: "Plane",
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row">
      <aside className="shrink-0 lg:w-56">
        <DashboardNav items={items} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
