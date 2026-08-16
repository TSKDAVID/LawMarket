import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/logo-mark";
import { LoginForm } from "@/components/auth/login-form";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("loginTitle") };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("auth");
  const nextPath =
    next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-muted/40 px-6 py-16">
      <div className="w-full max-w-md rounded-card border border-espresso/8 bg-white/70 p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-10 w-10 text-burgundy" />
          <h1 className="mt-4 font-heading text-2xl font-semibold text-espresso">
            {t("loginTitle")}
          </h1>
          <p className="mt-1 font-body text-sm text-espresso/70">
            {t("loginSubtitle")}
          </p>
          <p className="mt-3 max-w-sm font-body text-xs leading-relaxed text-espresso/60">
            {t("lawyerNote")}
          </p>
        </div>

        <LoginForm next={nextPath} />

        <p className="mt-6 text-center font-body text-sm text-espresso/70">
          {t("noAccount")}{" "}
          <Link
            href={nextPath ? `/signup?next=${encodeURIComponent(nextPath)}` : "/signup"}
            className="font-medium text-burgundy hover:text-burgundy-dark"
          >
            {t("signUpLink")}
          </Link>
        </p>

        <p className="mt-6 border-t border-espresso/8 pt-5 text-center font-body text-xs leading-relaxed text-espresso/55">
          {t("note")}
        </p>
      </div>
    </div>
  );
}
