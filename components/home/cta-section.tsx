import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { PageShell } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const t = useTranslations("home");
  const tNav = useTranslations("common.nav");

  return (
    <section className="bg-espresso py-10 sm:py-12">
      <PageShell>
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-2 font-body text-cream/70 sm:text-base">
            {t("ctaSubtitle")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {/*
             * Stamped block: no radius, no blur. The hover lifts the button
             * off a hard 4px cream slab and the press seats it back down —
             * the same mechanical move the service cards make.
             */}
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "rounded-none transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--color-cream)] focus-visible:ring-offset-espresso active:translate-x-0 active:translate-y-0 active:shadow-none"
              )}
            >
              {t("ctaButton")}
            </Link>
            <Link
              href="/lawyers"
              className="font-body text-sm font-semibold text-cream/82 transition-colors hover:text-cream"
            >
              {tNav("lawyers")} &rarr;
            </Link>
          </div>
        </div>
      </PageShell>
    </section>
  );
}
