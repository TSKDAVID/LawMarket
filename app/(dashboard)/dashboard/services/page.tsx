import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteService,
  saveService,
  toggleService,
} from "@/lib/actions/provider";
import { formatGel, pickLocale } from "@/lib/utils";

export default async function ServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const t = await getTranslations("dashboard.services");
  const tc = await getTranslations("common");

  const [{ data: services }, { data: programs }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("provider_id", user.id)
      .order("created_at"),
    supabase.from("programs").select("*").order("id"),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">
        {t("title")}
      </h1>

      {/* Existing services */}
      <div className="mt-6 space-y-4">
        {(services ?? []).length === 0 && (
          <p className="text-sm text-slate-500">{t("empty")}</p>
        )}
        {(services ?? []).map((s) => (
          <Card key={s.id} className={s.is_active ? "" : "opacity-60"}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {pickLocale(locale, s.title_ka, s.title_en)}
                  </h3>
                  <Badge variant={s.is_active ? "success" : "outline"}>
                    {s.is_active ? t("active") : t("inactive")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {formatGel(Number(s.price_gel), locale)}
                  {s.duration_min ? ` · ${s.duration_min} ${tc("minutes")}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={toggleService}>
                  <input type="hidden" name="id" value={s.id} />
                  <input
                    type="hidden"
                    name="is_active"
                    value={String(s.is_active)}
                  />
                  <Button variant="outline" size="sm" type="submit">
                    {s.is_active ? t("deactivate") : t("activate")}
                  </Button>
                </form>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={s.id} />
                  <Button variant="ghost" size="sm" type="submit">
                    {tc("delete")}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add service */}
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">{t("add")}</h2>
        <form action={saveService} className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="program_id">{t("program")}</Label>
              <Select id="program_id" name="program_id" required>
                {(programs ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {pickLocale(locale, p.name_ka, p.name_en)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="price_gel">{t("price")}</Label>
                <Input
                  id="price_gel"
                  name="price_gel"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_min">{t("duration")}</Label>
                <Input
                  id="duration_min"
                  name="duration_min"
                  type="number"
                  min={0}
                />
              </div>
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
              <Label htmlFor="description_ka">{t("descKa")}</Label>
              <Textarea id="description_ka" name="description_ka" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">{t("descEn")}</Label>
              <Textarea id="description_en" name="description_en" rows={3} />
            </div>
          </div>

          <Button type="submit">{t("add")}</Button>
        </form>
      </div>
    </div>
  );
}
