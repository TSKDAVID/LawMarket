import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Check, Clock, Info, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/shared/avatar";
import { CategoryIcon } from "@/components/shared/category-icon";
import { ServiceCard } from "@/components/shared/service-card";
import { ConsultationBooking } from "@/components/booking/consultation-booking";
import { PurchaseButton } from "@/components/purchase/purchase-button";
import { ServiceFaqList } from "@/components/services/service-faq-list";
import {
  getCategoryById,
  getLawyerById,
  getRelatedServices,
  getServiceBySlug,
} from "@/data/queries";
import {
  localizedCategoryName,
  localizedLawyerHeadline,
  localizedServiceDescription,
  localizedServiceFaq,
  localizedServiceIncludes,
  localizedServiceTitle,
} from "@/data/localize";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: localizedServiceTitle(service, locale as Locale),
    description: localizedServiceDescription(service, locale as Locale),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;

  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [category, lawyer, related, t, tCommon] = await Promise.all([
    getCategoryById(service.categoryId),
    getLawyerById(service.lawyerId),
    getRelatedServices(service, 3),
    getTranslations("serviceDetail"),
    getTranslations("common"),
  ]);
  const includes = localizedServiceIncludes(service, loc);
  const faq = localizedServiceFaq(service, loc);

  return (
    <div className="page-shell py-10 lg:py-12">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 font-body text-sm font-medium text-espresso/65 transition-colors hover:text-burgundy"
      >
        <ArrowLeft className="h-4 w-4" />
        {tCommon("backToServices")}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {category && (
            <Badge variant="burgundy" size="md">
              <CategoryIcon name={category.icon} className="h-4 w-4" />
              {localizedCategoryName(category, loc)}
            </Badge>
          )}
          <h1 className="mt-4 font-heading text-3xl font-semibold text-espresso sm:text-4xl">
            {localizedServiceTitle(service, loc)}
          </h1>

          <div className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-espresso">
              {t("about")}
            </h2>
            <p className="mt-3 font-body leading-relaxed text-espresso/65">
              {localizedServiceDescription(service, loc)}
            </p>
          </div>

          {includes.length > 0 && (
            <div className="mt-10">
              <h2 className="brand-rule font-heading text-lg font-semibold text-espresso">
                {t("whatsIncluded")}
              </h2>
              <ul className="mt-5 space-y-3">
                {includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-sm text-espresso/65"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {faq.length > 0 && (
            <div className="mt-10">
              <h2 className="brand-rule font-heading text-lg font-semibold text-espresso">
                {t("faq")}
              </h2>
              <div className="mt-5">
                <ServiceFaqList items={faq} />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-espresso/12 bg-white/85">
            <CardContent>
              <p className="font-body text-sm text-espresso/65">
                {tCommon("from")}
              </p>
              <p className="mt-1 font-heading text-3xl font-semibold text-burgundy">
                {formatPrice(service.price)}
              </p>

              {service.durationMinutes && (
                <p className="mt-3 flex items-center gap-2 font-body text-sm text-espresso/65">
                  <Clock className="h-4 w-4" />
                  {t("duration")}: {service.durationMinutes} {tCommon("minutes")}
                </p>
              )}

              {lawyer && (
                <Link
                  href={`/lawyers/${lawyer.slug}`}
                  className="group mt-6 flex items-center gap-3 border-t border-espresso/8 pt-5"
                >
                  <Avatar
                    initials={lawyer.initials}
                    color={lawyer.avatarColor}
                    photoUrl={lawyer.photoUrl}
                    alt={lawyer.name}
                    size="md"
                    className="border border-espresso/20 transition-colors group-hover:border-burgundy"
                  />
                  <div>
                    <p className="font-body text-xs text-espresso/60">
                      {t("providedBy")}
                    </p>
                    <p className="font-heading font-semibold text-espresso group-hover:text-burgundy">
                      {lawyer.name}
                    </p>
                    <p className="font-body text-xs text-espresso/65">
                      {localizedLawyerHeadline(lawyer, loc)}
                    </p>
                  </div>
                </Link>
              )}

              {lawyer && (
                <>
                  {/* Buy is the primary action; the free call sits under it. */}
                  <PurchaseButton
                    serviceTitle={localizedServiceTitle(service, loc)}
                    price={service.price}
                    lawyer={{
                      id: lawyer.id,
                      name: lawyer.name,
                      initials: lawyer.initials,
                      avatarColor: lawyer.avatarColor,
                      photoUrl: lawyer.photoUrl,
                    }}
                    className="mt-6"
                  />
                  <ConsultationBooking
                    lawyer={{
                      id: lawyer.id,
                      name: lawyer.name,
                      initials: lawyer.initials,
                      avatarColor: lawyer.avatarColor,
                      photoUrl: lawyer.photoUrl,
                    }}
                    className="mt-2.5"
                  />
                </>
              )}

              <p className="mt-4 flex items-start gap-2 font-body text-xs leading-relaxed text-espresso/60">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("bookingNote")}
              </p>

              <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-control)] bg-cream-muted/60 p-3 font-body text-xs leading-relaxed text-espresso/65">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                {t("guaranteeNote")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-espresso/8 pt-12">
          <h2 className="brand-rule font-heading text-2xl font-semibold text-espresso">
            {t("relatedServices")}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedService, index) => (
              <ServiceCard
                key={relatedService.id}
                category={
                  category ? localizedCategoryName(category, loc) : ""
                }
                title={localizedServiceTitle(relatedService, loc)}
                description={localizedServiceDescription(relatedService, loc)}
                price={relatedService.price}
                hasFreeConsultation
                detailsUrl={`/services/${relatedService.slug}`}
                index={index + 1}
                icon={category?.icon}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
