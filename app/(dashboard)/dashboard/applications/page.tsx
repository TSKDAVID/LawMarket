import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const STATUS_VARIANT = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
} as const;

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const t = await getTranslations("dashboard.applications");
  const tc = await getTranslations("common");
  const te = await getTranslations("expat.form");

  const { data: applications } = await supabase
    .from("expat_applications")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const statusLabel = {
    pending: tc("pending"),
    accepted: tc("accepted"),
    rejected: tc("rejected"),
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          {t("title")}
        </h1>
        <Link href="/expat/apply">
          <Button size="sm" variant="outline">
            {t("apply")}
          </Button>
        </Link>
      </div>

      {submitted === "1" && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {te("success")}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {(applications ?? []).length === 0 && (
          <p className="text-sm text-slate-500">{t("empty")}</p>
        )}
        {(applications ?? []).map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{a.topic}</h3>
                <Badge
                  variant={
                    STATUS_VARIANT[a.status as keyof typeof STATUS_VARIANT]
                  }
                >
                  {statusLabel[a.status as keyof typeof statusLabel]}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {a.country} · {formatDate(a.created_at, locale)}
              </p>
              {a.details && (
                <p className="mt-2 text-sm text-slate-600">{a.details}</p>
              )}
              {a.decision_note && (
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {t("decisionNote")}: {a.decision_note}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
