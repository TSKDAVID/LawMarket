import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BadgeCheck, Receipt, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("about");

  const values = [
    { icon: BadgeCheck, title: t("value1Title"), text: t("value1Text") },
    { icon: Receipt, title: t("value2Title"), text: t("value2Text") },
    { icon: ShieldCheck, title: t("value3Title"), text: t("value3Text") },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold text-espresso">
            {t("missionTitle")}
          </h2>
          <p className="mt-4 font-body leading-relaxed text-espresso/65">
            {t("missionText")}
          </p>
        </div>

        <h2 className="mt-16 text-center font-heading text-2xl font-semibold text-espresso">
          {t("valuesTitle")}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} className="bg-white/60 text-center">
              <CardContent className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-tint text-burgundy-dark">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-espresso">
                  {value.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-espresso/60">
                  {value.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
