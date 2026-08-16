import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "start" });
  return { title: t("title") };
}

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("start");

  return (
    <section className="paper-grain bg-cream">
      <PageShell className="py-16 sm:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-espresso/55">
          Law Market
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-espresso">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl border-l border-espresso/25 pl-4 font-body text-base text-espresso/70">
          {t("subtitle")}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="flex flex-col border border-espresso bg-parchment p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass">
              01
            </p>
            <h2 className="mt-4 font-heading text-2xl font-semibold text-espresso sm:text-3xl">
              {t("clientTitle")}
            </h2>
            <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-espresso/75">
              {t("clientBody")}
            </p>
            <Link
              href="/services"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-none border border-burgundy bg-burgundy px-5 font-mono text-xs uppercase tracking-[0.16em] text-cream transition-colors hover:border-espresso hover:bg-espresso"
            >
              {t("clientCta")}
            </Link>
            <Link
              href="/signup"
              className="mt-3 inline-flex h-12 items-center justify-center rounded-none border border-espresso/20 font-mono text-xs uppercase tracking-[0.16em] text-espresso transition-colors hover:border-espresso"
            >
              {t("clientSecondary")}
            </Link>
          </article>

          <article className="flex flex-col border border-espresso bg-espresso p-8 text-cream">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass">
              02
            </p>
            <h2 className="mt-4 font-heading text-2xl font-semibold sm:text-3xl">
              {t("lawyerTitle")}
            </h2>
            <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-cream/80">
              {t("lawyerBody")}
            </p>
            <Link
              href={`/login?next=/${locale}/portal/profile/`}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-none border border-cream bg-cream px-5 font-mono text-xs uppercase tracking-[0.16em] text-espresso transition-colors hover:bg-burgundy hover:text-cream"
            >
              {t("lawyerCta")}
            </Link>
            <p className="mt-4 font-body text-xs leading-relaxed text-cream/70">
              {t("lawyerNote")}
            </p>
          </article>
        </div>
      </PageShell>
    </section>
  );
}
