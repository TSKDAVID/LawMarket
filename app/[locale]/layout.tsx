import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getMessagesForLocale } from "@/i18n/messages";
import "@/lib/fonts";
import { GlobalBanner } from "@/components/layout/global-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { IntlProvider } from "@/components/providers/intl-provider";
import { getSessionUser } from "@/lib/auth";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Catalog and site copy live in Supabase. Pages are cached and refreshed at
 * most once a minute; admin writes additionally revalidate their paths, so
 * edits normally appear immediately.
 */
export const revalidate = 60;

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
      ? "იპოვეთ იურისტები საქართველოში ფიქსირებული ფასებითა და კმაყოფილების გარანტიით."
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
  const user = await getSessionUser();

  return (
    <html lang={locale} data-locale={locale} data-scroll-behavior="smooth">
        {locale === "ka" && (
        <>
          <link
            rel="preload"
            href="/fonts/alk-sanet.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/alk-rex-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </>
      )}
      <body className="flex min-h-screen flex-col bg-cream font-body text-espresso antialiased">
        <IntlProvider locale={locale} messages={messages}>
          <GlobalBanner />
          <Header
            signedIn={Boolean(user)}
            role={user?.profile?.role ?? null}
            label={user?.profile?.full_name ?? user?.email ?? null}
          />
          <main className="flex-1">{children}</main>
          <Footer />
        </IntlProvider>
      </body>
    </html>
  );
}
