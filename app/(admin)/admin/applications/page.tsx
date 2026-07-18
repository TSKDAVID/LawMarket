import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { reviewApplication } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("admin");

  const { data: applications } = await supabase
    .from("expat_applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at");

  return (
    <div>
      <p className="text-sm text-slate-500">{t("pendingOnly")}</p>

      <div className="mt-4 space-y-4">
        {(applications ?? []).length === 0 && (
          <p className="text-sm text-slate-500">{t("applicationsEmpty")}</p>
        )}
        {(applications ?? []).map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{a.topic}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {t("applicant")}: {a.full_name} ({a.email}
                    {a.phone ? `, ${a.phone}` : ""}) · {a.country} ·{" "}
                    {formatDate(a.created_at, locale)}
                  </p>
                </div>
              </div>

              {a.details && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {a.details}
                </p>
              )}

              <form
                action={reviewApplication}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                <input type="hidden" name="id" value={a.id} />
                <Input
                  name="reason"
                  placeholder={t("reasonPlaceholder")}
                  className="max-w-xs"
                />
                <Button type="submit" name="decision" value="accepted" size="sm">
                  {t("accept")}
                </Button>
                <Button
                  type="submit"
                  name="decision"
                  value="rejected"
                  variant="destructive"
                  size="sm"
                >
                  {t("reject")}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
