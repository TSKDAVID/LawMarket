import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Search, GitCompareArrows, CalendarCheck, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  getSitePage,
  localizedPageSubtitle,
  localizedPageTitle,
  localizedSections,
} from "@/lib/cms/pages";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const stepIcons = [Search, GitCompareArrows, CalendarCheck];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getSitePage("how-it-works");
  return {
    title: locale === "ka" ? page.title_ka : page.title_en,
    description:
      locale === "ka" ? page.subtitle_ka : page.subtitle_en,
  };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("howItWorks");
  const page = await getSitePage("how-it-works");
  const loc = locale as Locale;
  const steps = localizedSections(page, loc);

  return (
    <>
      <PageHeader
        title={localizedPageTitle(page, loc)}
        subtitle={localizedPageSubtitle(page, loc)}
      />

      <div className="page-shell py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = stepIcons[i] ?? Search;
            return (
              <div key={step.title} className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-burgundy-tint text-burgundy-dark">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="absolute -top-2 left-10 flex h-7 w-7 items-center justify-center rounded-full bg-espresso font-heading text-xs font-semibold text-cream">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-espresso">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-espresso/75">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 rounded-card border border-burgundy/15 bg-burgundy-tint/60 p-8 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-espresso">
              {t("guaranteeTitle")}
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-espresso/80">
              {t("guaranteeText")}
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="font-heading text-2xl font-semibold text-espresso">
            {t("ctaTitle")}
          </h2>
          <Link
            href="/services"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </>
  );
}
