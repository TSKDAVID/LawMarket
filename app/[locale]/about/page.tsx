import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BadgeCheck, Receipt, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  getSitePage,
  localizedPageSubtitle,
  localizedPageTitle,
  localizedSections,
} from "@/lib/cms/pages";
import type { Locale } from "@/i18n/routing";

const valueIcons = [BadgeCheck, Receipt, ShieldCheck];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getSitePage("about");
  return {
    title: locale === "ka" ? page.title_ka : page.title_en,
    description:
      locale === "ka" ? page.subtitle_ka : page.subtitle_en,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("about");
  const page = await getSitePage("about");
  const loc = locale as Locale;
  const sections = localizedSections(page, loc);
  const mission = sections[0];
  const values = sections.slice(1);

  return (
    <>
      <PageHeader
        title={localizedPageTitle(page, loc)}
        subtitle={localizedPageSubtitle(page, loc)}
      />

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {mission && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-semibold text-espresso">
              {mission.title}
            </h2>
            <p className="mt-4 font-body leading-relaxed text-espresso/80">
              {mission.text}
            </p>
          </div>
        )}

        {values.length > 0 && (
          <>
            <h2 className="mt-16 text-center font-heading text-2xl font-semibold text-espresso">
              {t("valuesTitle")}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {values.map((value, index) => {
                const Icon = valueIcons[index] ?? BadgeCheck;
                return (
                  <Card key={value.title} className="bg-white/60 text-center">
                    <CardContent className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-tint text-burgundy-dark">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-lg font-semibold text-espresso">
                        {value.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-espresso/75">
                        {value.text}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
