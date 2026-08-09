import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/data/types";
import { localizedServiceTitle } from "@/data/localize";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

type CompactServiceListProps = {
  services: Service[];
};

export function CompactServiceList({ services }: CompactServiceListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("lawyerProfile");

  if (services.length === 0) {
    return (
      <p className="font-body text-sm text-espresso/50">{t("noServices")}</p>
    );
  }

  return (
    <ul className="divide-y divide-espresso/8 rounded-[var(--radius-card)] border border-espresso/12 bg-white/80">
      {services.map((service) => (
        <li key={service.id}>
          <Link
            href={`/services/${service.slug}`}
            className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream-muted/40"
          >
            <div className="min-w-0">
              <p className="font-heading font-semibold text-espresso transition-colors group-hover:text-burgundy">
                {localizedServiceTitle(service, locale)}
              </p>
              {service.durationMinutes && (
                <p className="mt-0.5 font-body text-xs text-espresso/45">
                  {service.durationMinutes} min
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-heading text-base font-semibold text-burgundy">
                {formatPrice(service.price)}
              </span>
              <ArrowUpRight className="h-4 w-4 text-espresso/20 transition-colors group-hover:text-burgundy" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
