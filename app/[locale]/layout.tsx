import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getMessagesForLocale } from "@/i18n/messages";
import { fontVariables } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { IntlProvider } from "@/components/providers/intl-provider";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKa = locale === "ka";

  return {
    metadataBase: new URL("https://lawmarket.ge"),
    title: {
      default: isKa
        ? "Law Market — იურიდიული დახმარება გარანტიით"
        : "Law Market — Legal Help, Guaranteed",
      template: "%s | Law Market",
    },
    description: isKa
      ? "იპოვეთ დადასტურებული იურისტები საქართველოში ფიქსირებული ფასებითა და კმაყოფილების გარანტიით."
      : "Find verified lawyers in Georgia with fixed pricing and a satisfaction guarantee.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);
  const messages = getMessagesForLocale(locale as Locale);

  return (
    <html
      lang={locale}
      data-locale={locale}
      data-scroll-behavior="smooth"
      className={fontVariables}
    >
      <body className="flex min-h-screen flex-col bg-cream font-body text-espresso antialiased">
        <IntlProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </IntlProvider>
      </body>
    </html>
  );
}
