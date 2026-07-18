import type { Metadata } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import "./globals.css";

const notoSans = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  variable: "--font-noto-sans",
});

const notoSerif = Noto_Serif_Georgian({
  subsets: ["georgian", "latin"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: {
    default: "LawMarket — იურიდიული ბაზარი საქართველოსთვის",
    template: "%s | LawMarket",
  },
  description:
    "იპოვე ვერიფიცირებული იურისტი საქართველოში. გამჭვირვალე ფასები, ვერიფიცირებული საქმეები, პირდაპირი კომუნიკაცია.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${notoSans.variable} ${notoSerif.variable} flex min-h-screen flex-col font-sans`}
      >
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
