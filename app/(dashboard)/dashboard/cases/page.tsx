import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { deleteCase, submitCase } from "@/lib/actions/provider";
import { pickLocale } from "@/lib/utils";

const STATUS_VARIANT = {
  approved: "success",
  pending: "warning",
  rejected: "destructive",
} as const;

export default async function CasesPage({
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
  const t = await getTranslations("dashboard.cases");
  const tc = await getTranslations("common");

  const [{ data: cases }, { data: areas }] = await Promise.all([
    supabase
      .from("cases")
      .select("*")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("practice_areas").select("*").order("id"),
  ]);

  const statusLabel = {
    approved: tc("approved"),
    pending: tc("pending"),
    rejected: tc("rejected"),
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">
        {t("title")}
      </h1>

      {submitted === "1" && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {t("submitted")}
        </p>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        {t("note")}
      </p>

      <div className="mt-6 space-y-4">
        {(cases ?? []).length === 0 && (
          <p className="text-sm text-slate-500">{t("empty")}</p>
        )}
        {(cases ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">
                  {pickLocale(locale, c.title_ka, c.title_en)}
                </h3>
                <Badge
                  variant={
                    STATUS_VARIANT[c.status as keyof typeof STATUS_VARIANT]
                  }
                >
                  {statusLabel[c.status as keyof typeof statusLabel]}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {t("caseNumber")}: {c.case_number}
                {c.year ? ` · ${c.year}` : ""}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {pickLocale(locale, c.summary_ka, c.summary_en)}
              </p>
              {c.status === "rejected" && c.rejection_reason && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {t("rejectionReason")}: {c.rejection_reason}
                </p>
              )}
              {c.status === "pending" && (
                <form action={deleteCase} className="mt-3">
                  <input type="hidden" name="id" value={c.id} />
                  <Button variant="ghost" size="sm" type="submit">
                    {tc("delete")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit case */}
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">{t("add")}</h2>
        <form action={submitCase} className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="case_number">{t("caseNumber")}</Label>
              <Input id="case_number" name="case_number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="practice_area_id">{t("practiceArea")}</Label>
              <Select id="practice_area_id" name="practice_area_id">
                <option value="">—</option>
                {(areas ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {pickLocale(locale, a.name_ka, a.name_en)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">{t("year")}</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={1990}
                max={2100}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title_ka">{t("titleKa")}</Label>
              <Input id="title_ka" name="title_ka" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">{t("titleEn")}</Label>
              <Input id="title_en" name="title_en" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="summary_ka">{t("summaryKa")}</Label>
              <Textarea id="summary_ka" name="summary_ka" rows={3} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary_en">{t("summaryEn")}</Label>
              <Textarea id="summary_en" name="summary_en" rows={3} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registry_url">{t("registryUrl")}</Label>
            <Input
              id="registry_url"
              name="registry_url"
              type="url"
              placeholder="https://ecd.court.ge/..."
            />
          </div>

          <Button type="submit">{tc("submit")}</Button>
        </form>
      </div>
    </div>
  );
}
