import { useLocale, useTranslations } from "next-intl";
import { Clock, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/shared/avatar";
import { CategoryIcon } from "@/components/shared/category-icon";
import type { Category, Lawyer, Service } from "@/data/types";
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
  lawyer?: Lawyer;
  className?: string;
};

export function ServiceCard({
  service,
  category,
  lawyer,
  className,
}: ServiceCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn("group block h-full", className)}
    >
      <Card className="relative flex h-full flex-col overflow-hidden border-espresso/12 bg-white/85 transition-all duration-200 group-hover:border-burgundy/30 group-hover:shadow-[0_8px_24px_rgba(28,18,16,0.07)]">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px] bg-burgundy/70 transition-colors group-hover:bg-burgundy"
        />
        <CardContent className="flex flex-1 flex-col pt-5">
          <div className="flex items-start justify-between gap-3">
            {category && (
              <span className="inline-flex items-center gap-1.5 pt-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-burgundy/85">
                <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                {localizedCategoryName(category, locale)}
              </span>
            )}
            <ArrowUpRight className="h-5 w-5 shrink-0 text-espresso/15 transition-colors group-hover:text-burgundy" />
          </div>

          <h3 className="mt-3 font-heading text-lg font-semibold text-espresso">
            {localizedServiceTitle(service, locale)}
          </h3>
          <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-espresso/50 line-clamp-2">
            {localizedServiceDescription(service, locale)}
          </p>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-espresso/8 pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              {lawyer && (
                <Avatar
                  initials={lawyer.initials}
                  color={lawyer.avatarColor}
                  photoUrl={lawyer.photoUrl}
                  alt={lawyer.name}
                  size="sm"
                />
              )}
              <div className="min-w-0 font-body text-xs text-espresso/50">
                {lawyer && (
                  <span className="block truncate font-medium text-espresso/70">
                    {lawyer.name}
                  </span>
                )}
                {service.durationMinutes && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.durationMinutes} {t("minutes")}
                  </span>
                )}
              </div>
            </div>
            <p className="shrink-0 font-heading text-xl font-semibold tracking-tight text-burgundy sm:text-2xl">
              {formatPrice(service.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
