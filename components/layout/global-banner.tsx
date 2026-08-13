import { useTranslations } from "next-intl";

/**
 * Ledger strip above the masthead, carried on every route. It is the one place
 * burgundy fills a whole band rather than marking an action, so it reads as
 * stamped onto the document rather than part of the navigation.
 */
export function GlobalBanner() {
  const t = useTranslations("common");

  return (
    <div className="w-full border-b border-espresso bg-burgundy">
      <p className="flex items-center justify-center px-4 py-2 text-center font-mono text-[0.625rem] uppercase leading-snug tracking-[0.12em] text-cream sm:text-xs sm:tracking-[0.22em]">
        {t("banner")}
      </p>
    </div>
  );
}
