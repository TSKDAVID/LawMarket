import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="page-shell py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/60">
              <CardContent>
                <h2 className="font-heading text-lg font-semibold text-espresso">
                  {t("otherWaysTitle")}
                </h2>
                <ul className="mt-5 space-y-4 font-body text-sm text-espresso/80">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                    <div>
                      <p className="text-espresso/65">{t("emailUs")}</p>
                      <a
                        href="mailto:hello@lawmarket.ge"
                        className="font-medium text-espresso hover:text-burgundy"
                      >
                        hello@lawmarket.ge
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                    <div>
                      <p className="text-espresso/65">{t("callUs")}</p>
                      <a
                        href="tel:+995322000000"
                        className="font-medium text-espresso hover:text-burgundy"
                      >
                        +995 322 000 000
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                    <p className="font-medium text-espresso">Tbilisi, Georgia</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
