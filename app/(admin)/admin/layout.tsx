import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/cases");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const t = await getTranslations("admin");

  if (profile?.role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-slate-600">{t("noAccess")}</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-brand-800 hover:underline"
        >
          ← {t("title")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-bold text-slate-900">
        {t("title")}
      </h1>
      <div className="mt-6">
        <AdminNav
          items={[
            { href: "/admin/cases", label: t("casesQueue") },
            { href: "/admin/applications", label: t("applicationsQueue") },
          ]}
        />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
