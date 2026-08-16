import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ConsultationClockIcon,
  DossierIcon,
} from "@/components/shared/dossier-icon";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type ServiceCardProps = {
  category: string;
  title: string;
  description: string;
  price: string | number;
  hasFreeConsultation: boolean;
  detailsUrl: string;
  /** 1-based catalog index — rendered as 01, 02, 03… */
  index?: number;
  /** Category motif key (briefcase, stamp, shield, …). */
  icon?: string;
  className?: string;
};

export function ServiceCard({
  category,
  title,
  description,
  price,
  hasFreeConsultation,
  detailsUrl,
  index,
  icon,
  className,
}: ServiceCardProps) {
  const t = useTranslations("common");
  const displayPrice =
    typeof price === "number" ? formatPrice(price) : price;
  const indexLabel =
    typeof index === "number"
      ? String(index).padStart(2, "0")
      : undefined;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-none bg-[#fdfbf6] p-6 sm:p-7",
        "border border-[color-mix(in_srgb,var(--color-brass)_28%,var(--color-espresso)_12%)]",
        "shadow-[0_6px_18px_-8px_rgba(28,18,16,0.04)]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-brass/55",
        "hover:shadow-[0_14px_28px_-12px_rgba(28,18,16,0.12)]",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        {indexLabel && (
          <span className="font-heading text-[13px] leading-none tracking-[0.04em] text-brass">
            {indexLabel}
          </span>
        )}
        <DossierIcon name={icon} className="mt-px h-4 w-4 text-brass" />
      </div>

      {category && (
        <p className="mt-4 w-fit font-heading text-[11px] font-medium tracking-[0.08em] text-brass underline decoration-brass/40 decoration-1 underline-offset-[5px]">
          {category}
        </p>
      )}

      <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-espresso sm:text-xl">
        <Link
          href={detailsUrl}
          className="rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
        >
          {title}
        </Link>
      </h3>

      <p className="mt-2 min-h-[2.85rem] flex-1 font-body text-sm leading-relaxed text-espresso/60 line-clamp-2">
        {description}
      </p>

      <Link
        href={detailsUrl}
        className={cn(
          "relative mt-3 w-fit pb-0.5 font-body text-sm font-semibold text-espresso",
          "after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-burgundy",
          "after:transition-[width] after:duration-300 after:ease-out",
          "hover:text-burgundy hover:after:w-full",
          "group-hover:text-burgundy group-hover:after:w-full",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
        )}
      >
        {t("viewDetails")}
        <span aria-hidden="true"> →</span>
      </Link>

      <div className="mt-5 border-t border-brass/25 pt-5">
        {hasFreeConsultation && (
          <Link
            href={`${detailsUrl}#consult`}
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2.5 rounded-none",
              "border-[1.5px] border-burgundy bg-transparent px-3",
              "font-body text-[13px] font-semibold text-burgundy sm:text-sm",
              "transition-colors duration-200 ease-out",
              "hover:bg-burgundy hover:text-cream",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            )}
          >
            <ConsultationClockIcon className="h-4 w-4" />
            {t("bookFreeConsultation")}
          </Link>
        )}

        <div
          className={cn(
            "flex items-baseline justify-between gap-3",
            hasFreeConsultation ? "mt-2.5" : "mt-0"
          )}
        >
          <p className="font-heading text-[14px] font-medium tracking-tight text-espresso">
            {displayPrice}
          </p>
          <Link
            href={detailsUrl}
            className={cn(
              "font-body text-[13px] font-normal text-espresso/55 no-underline",
              "hover:text-espresso hover:underline hover:decoration-brass hover:decoration-1 hover:underline-offset-4",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            )}
          >
            {t("buyNow")}
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
