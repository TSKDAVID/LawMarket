import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { VerifiedSeal } from "@/components/marketplace/VerifiedSeal";

export default async function HomePage(): Promise<React.JSX.Element> {
  const t = await getTranslations("home");

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 100% 0%, var(--color-paper-alt) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, var(--color-brass-bg) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16 lg:py-28">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              LawMarket · საქართველო
            </p>
            <h1 className="whitespace-pre-line text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              {t("headline")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {t("subhead")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/providers">{t("ctaPrimary")}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/expat-consultations">{t("ctaSecondary")}</Link>
              </Button>
            </div>
          </div>

          <aside className="flex flex-col items-start gap-4 border border-border bg-paper/80 p-6 lg:justify-self-end lg:p-8">
            <VerifiedSeal size={64} />
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brass">{t("statValue")}</p>
              <p className="mt-2 max-w-[18ch] text-sm leading-relaxed text-ink-muted">{t("statLabel")}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">{t("sectionHowTitle")}</h2>
          <p className="mt-3 text-ink-muted">{t("sectionHowBody")}</p>
        </div>
        <ol className="mt-12 grid gap-8 border-t border-border pt-12 md:grid-cols-3">
          {[
            { n: "01", title: t("step1Title"), body: t("step1Body") },
            { n: "02", title: t("step2Title"), body: t("step2Body") },
            { n: "03", title: t("step3Title"), body: t("step3Body") },
          ].map((step) => (
            <li key={step.n} className="border-l border-border pl-4 md:border-l-0 md:border-t-0 md:pl-0">
              <p className="font-mono text-xs text-ink-muted">{step.n}</p>
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
