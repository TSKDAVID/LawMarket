import { useLocale, useTranslations } from "next-intl";
import { Clock } from "lucide-react";
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
  /** Lead card: larger title, full description, permanent burgundy strip. */
  featured?: boolean;
  /** Compact cards skip the clipped description entirely. */
  showDescription?: boolean;
};

export function ServiceCard({
  service,
  category,
  lawyer,
  className,
  featured = false,
  showDescription = true,
}: ServiceCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn("group block h-full", className)}
    >
      <Card className="relative flex h-full flex-col overflow-hidden transition-all duration-200 group-hover:border-espresso/35 group-hover:shadow-[0_6px_20px_rgba(28,18,16,0.08)]">
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 h-[2px] bg-burgundy transition-opacity",
            featured ? "opacity-80" : "opacity-0 group-hover:opacity-80"
          )}
        />
        <CardContent className="flex flex-1 flex-col pt-5">
          {category && (
            <span className="inline-flex items-center gap-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-brass">
              <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
              {localizedCategoryName(category, locale)}
            </span>
          )}

          <h3
            className={cn(
              "mt-3 font-heading font-semibold text-espresso",
              featured ? "text-xl sm:text-2xl" : "text-lg"
            )}
          >
            {localizedServiceTitle(service, locale)}
          </h3>
          {featured ? (
            <p className="mt-2 max-w-xl flex-1 font-body text-sm leading-relaxed text-espresso/55">
              {localizedServiceDescription(service, locale)}
            </p>
          ) : showDescription ? (
            <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-espresso/50 line-clamp-2">
              {localizedServiceDescription(service, locale)}
            </p>
          ) : (
            <span className="flex-1" />
          )}

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
            <p className="shrink-0 font-heading text-xl font-semibold tracking-tight text-espresso sm:text-2xl">
              {formatPrice(service.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
