import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { getCategories } from "@/data/queries";
import { createClient } from "@/lib/supabase/server";
import { ServiceRequestForm } from "@/components/workspace/portal-forms";
import { localizedServiceTitle } from "@/data/localize";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function PortalServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;
  const t = await getTranslations("portal");
  const lawyer = await getOwnLawyer();
  const categories = await getCategories();

  if (!lawyer) {
    return <p className="font-body text-sm text-espresso/75">{t("noLawyerProfile")}</p>;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("lawyer_id", lawyer.id)
    .order("sort_order");

  const services = data ?? [];

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-espresso">
        {t("servicesTitle")}
      </h1>
      {services.length === 0 ? (
        <p className="mt-4 font-body text-sm text-espresso/75">{t("noServices")}</p>
      ) : (
        <ul className="mt-6 divide-y divide-espresso/15 border border-espresso/20 bg-white/70">
          {services.map((service) => (
            <li key={service.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-heading font-semibold text-espresso">
                  {localizedServiceTitle(
                    {
                      id: service.id,
                      slug: service.slug,
                      categoryId: service.category_id,
                      lawyerId: service.lawyer_id,
                      title_en: service.title_en,
                      title_ka: service.title_ka,
                      description_en: service.description_en,
                      description_ka: service.description_ka,
                      price: Number(service.price),
                      currency: "GEL",
                      durationMinutes: service.duration_minutes,
                    },
                    loc
                  )}
                </p>
                <p className="mt-1 font-body text-xs text-espresso/65">
                  {formatPrice(Number(service.price))}
                </p>
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-espresso/70"
              >
                {t("publicProfile")}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <ServiceRequestForm categories={categories} />
    </div>
  );
}
