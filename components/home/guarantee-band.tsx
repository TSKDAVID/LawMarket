import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GuaranteeSeal } from "@/components/brand/guarantee-seal";
import { PageShell } from "@/components/layout/page-shell";

export function GuaranteeBand() {
  const t = useTranslations("home");

  return (
    /*
     * Transition strip: full-bleed ink rules top and bottom. The bottom rule
     * meets the espresso roster below it, so the two read as one seam rather
     * than two stacked sections.
     */
    <section className="border-y border-espresso bg-cream-muted">
      <PageShell className="flex flex-col items-start gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-7">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-espresso">
            <GuaranteeSeal className="h-7 w-7 text-brass" />
          </div>
          <div>
            <p className="font-heading text-base font-semibold text-espresso sm:text-lg">
              {t("guaranteeTitle")}
            </p>
            <p className="mt-0.5 font-body text-sm text-espresso/65">
              {t("guaranteeSubtitle")}
            </p>
          </div>
        </div>
        <Link
          href="/how-it-works"
          className="shrink-0 font-body text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
        >
          {t("guaranteeLink")} &rarr;
        </Link>
      </PageShell>
    </section>
  );
}
