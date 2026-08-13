import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/shared/category-icon";
import type { Category, Service } from "@/data/types";
import {
  localizedCategoryName,
  localizedServiceDescription,
  localizedServiceTitle,
} from "@/data/localize";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  service: Service;
  category?: Category;
  className?: string;
  /** Lead card: larger title, permanent burgundy strip. */
  featured?: boolean;
};

export function ServiceCard({
  service,
  category,
  className,
  featured = false,
}: ServiceCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy",
        className
      )}
    >
      {/*
       * Ledger block: strict 1px ink frame, ruled zones, and a mechanical
       * hover — the card lifts toward the cursor and casts a hard offset
       * shadow, like a stamped file pulled off the stack.
       */}
      <Card className="relative flex h-full flex-col rounded-none border-espresso bg-parchment shadow-none transition-transform duration-150 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0_0_#1c1210]">
        {featured && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] bg-burgundy"
          />
        )}

        {/* Zone 1 — dossier header: category label */}
        <div className="border-b border-espresso/20 px-5 py-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brass">
            {category ? (
              <>
                <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                {localizedCategoryName(category, locale)}
              </>
            ) : (
              <>&nbsp;</>
            )}
          </span>
        </div>

        {/* Zone 2 — title and clamped ledger note */}
        <div className="flex flex-1 flex-col px-5 py-4">
          <h3
            className={cn(
              "font-heading font-semibold text-espresso",
              featured ? "text-xl sm:text-2xl" : "text-lg"
            )}
          >
            {localizedServiceTitle(service, locale)}
          </h3>
          {/*
           * Layout lock: min-height reserves exactly two lines
           * (2 × 0.875rem × 1.625 ≈ 2.85rem) so a one-line description
           * cannot pull the footer rule out of alignment with row siblings.
           */}
          <div className="mt-2 min-h-[2.85rem] flex-1">
            <p className="line-clamp-2 font-body text-sm leading-relaxed text-espresso/70">
              {localizedServiceDescription(service, locale)}
            </p>
          </div>
        </div>

        {/*
         * Zone 3 — ledger row: consultation note left, price right. The note is
         * capped at 60% so it breaks under itself instead of crowding the
         * price, and both columns resolve to 2rem (min-h-8 / leading-8) so the
         * footer keeps identical height across the row however the note wraps.
         */}
        <div className="flex items-center justify-between gap-3 border-t border-espresso/20 px-5 py-3.5">
          <p className="flex min-h-8 min-w-0 max-w-[60%] items-center font-mono text-xs leading-4 tracking-[0.08em] text-espresso/55">
            {t("freeConsultation")}
          </p>
          <p className="shrink-0 text-right font-heading text-xl font-bold leading-8 tracking-tight text-espresso sm:text-2xl">
            {formatPrice(service.price)}
          </p>
        </div>

        {/* Zone 4 — action strip: inverts hard on hover */}
        <div
          aria-hidden="true"
          className="flex items-center justify-between border-t border-espresso/20 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-burgundy transition-colors group-hover:bg-burgundy group-hover:text-cream"
        >
          <span>{t("viewDetails")}</span>
          <span>&rarr;</span>
        </div>
      </Card>
    </Link>
  );
}
