import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const t = await getTranslations("dashboard");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isProvider = profile?.role === "provider";

  let stats: { label: string; value: number }[] = [];
  let providerProfile: { slug: string; is_published: boolean } | null = null;

  if (isProvider) {
    const [{ data: pp }, services, approved, pending, bookings] =
      await Promise.all([
        supabase
          .from("provider_profiles")
          .select("slug, is_published")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id)
          .eq("is_active", true),
        supabase
          .from("cases")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id)
          .eq("status", "approved"),
        supabase
          .from("cases")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id)
          .eq("status", "pending"),
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id),
      ]);

    providerProfile = pp;
    stats = [
      { label: t("overview.statServices"), value: services.count ?? 0 },
      { label: t("overview.statCasesApproved"), value: approved.count ?? 0 },
      { label: t("overview.statCasesPending"), value: pending.count ?? 0 },
      { label: t("overview.statBookings"), value: bookings.count ?? 0 },
    ];
  } else {
    const [bookings, applications] = await Promise.all([
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("client_id", user.id),
      supabase
        .from("expat_applications")
        .select("id", { count: "exact", head: true })
        .eq("client_id", user.id),
    ]);
    stats = [
      { label: t("overview.statBookings"), value: bookings.count ?? 0 },
      { label: t("nav.applications"), value: applications.count ?? 0 },
    ];
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">
        {t("welcome", { name: profile?.full_name ?? "" })}
      </h1>
      <p className="mt-1 text-slate-500">
        {isProvider ? t("overview.providerHint") : t("overview.clientHint")}
      </p>

      {isProvider && providerProfile && !providerProfile.is_published && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {t("overview.profileUnpublished")}
          <Link href="/dashboard/profile">
            <Button size="sm" variant="outline">
              {t("overview.completeProfile")}
            </Button>
          </Link>
        </div>
      )}

      {isProvider && !providerProfile && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {t("overview.profileUnpublished")}
          <Link href="/onboarding">
            <Button size="sm" variant="outline">
              {t("overview.completeProfile")}
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="font-serif text-3xl font-bold text-brand-900">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {isProvider && providerProfile?.is_published && (
          <Link href={`/lawyers/${providerProfile.slug}`}>
            <Button variant="outline">
              {t("overview.publicProfile")}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {!isProvider && (
          <>
            <Link href="/lawyers">
              <Button>
                {t("overview.findLawyer")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/expat">
              <Button variant="outline">{t("overview.applyExpat")}</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
