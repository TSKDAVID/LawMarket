import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/lib/actions/booking";
import { formatGel, pickLocale } from "@/lib/utils";

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ slug: string; serviceId: string }>;
}) {
  const { slug, serviceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/lawyers/${slug}/book/${serviceId}`);

  const locale = await getLocale();
  const t = await getTranslations("booking");
  const tc = await getTranslations("common");

  const { data: service } = await supabase
    .from("services")
    .select(
      `id, title_ka, title_en, description_ka, description_en, price_gel, duration_min,
       provider_profiles ( slug, profiles ( full_name ) )`,
    )
    .eq("id", serviceId)
    .eq("is_active", true)
    .maybeSingle();

  if (!service) notFound();

  const providerRel = service.provider_profiles as unknown as {
    slug: string;
    profiles: { full_name: string } | null;
  } | null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
        {t("title")}
      </h1>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5">
          <h2 className="font-semibold text-slate-900">
            {pickLocale(locale, service.title_ka, service.title_en)}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {providerRel?.profiles?.full_name}
          </p>
          <p className="mt-3 text-2xl font-bold text-brand-900">
            {formatGel(Number(service.price_gel), locale)}
            {service.duration_min && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                {service.duration_min} {tc("minutes")}
              </span>
            )}
          </p>
        </div>

        <form action={createBooking} className="mt-5 space-y-5">
          <input type="hidden" name="service_id" value={service.id} />
          <div className="space-y-2">
            <Label htmlFor="note">{t("note")}</Label>
            <Textarea
              id="note"
              name="note"
              rows={4}
              placeholder={t("notePlaceholder")}
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            {t("confirm")}
          </Button>
        </form>
      </div>
    </div>
  );
}
