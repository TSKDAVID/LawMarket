import { getLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { reviewCase } from "@/lib/actions/admin";
import { formatDate, pickLocale } from "@/lib/utils";

export default async function AdminCasesPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("admin");
  const tp = await getTranslations("provider");

  const { data: cases } = await supabase
    .from("cases")
    .select(
      `id, case_number, title_ka, title_en, summary_ka, summary_en, year,
       registry_url, evidence_path, consent_path, created_at,
       provider_profiles ( slug, profiles ( full_name ) ),
       practice_areas ( name_ka, name_en )`,
    )
    .eq("status", "pending")
    .order("created_at");

  return (
    <div>
      <p className="text-sm text-slate-500">{t("pendingOnly")}</p>

      <div className="mt-4 space-y-4">
        {(cases ?? []).length === 0 && (
          <p className="text-sm text-slate-500">{t("casesEmpty")}</p>
        )}
        {(cases ?? []).map((c) => {
          const provider = c.provider_profiles as unknown as {
            slug: string;
            profiles: { full_name: string } | null;
          } | null;
          const area = c.practice_areas as unknown as {
            name_ka: string;
            name_en: string;
          } | null;

          return (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {pickLocale(locale, c.title_ka, c.title_en)}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {t("provider")}: {provider?.profiles?.full_name} ·{" "}
                      {tp("caseNumber")}: {c.case_number}
                      {c.year ? ` · ${c.year}` : ""}
                      {area
                        ? ` · ${pickLocale(locale, area.name_ka, area.name_en)}`
                        : ""}{" "}
                      · {formatDate(c.created_at, locale)}
                    </p>
                  </div>
                  {c.registry_url && (
                    <a
                      href={c.registry_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline"
                    >
                      {tp("registryLink")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {pickLocale(locale, c.summary_ka, c.summary_en)}
                </p>

                <form
                  action={reviewCase}
                  className="mt-4 flex flex-wrap items-center gap-2"
                >
                  <input type="hidden" name="id" value={c.id} />
                  <Input
                    name="reason"
                    placeholder={t("reasonPlaceholder")}
                    className="max-w-xs"
                  />
                  <Button
                    type="submit"
                    name="decision"
                    value="approved"
                    size="sm"
                  >
                    {t("approve")}
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
          );
        })}
      </div>
    </div>
  );
}
