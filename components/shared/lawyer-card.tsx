import { useLocale, useTranslations } from "next-intl";
import { MapPin, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/shared/avatar";
import type { Lawyer } from "@/data/types";
import type { LawyerRating } from "@/data/queries";
import { localizedLawyerHeadline } from "@/data/localize";
import type { Locale } from "@/i18n/routing";

type LawyerCardProps = {
  lawyer: Lawyer;
  rating?: LawyerRating;
};

export function LawyerCard({ lawyer, rating }: LawyerCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  return (
    <Link href={`/lawyers/${lawyer.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-espresso/12 bg-white/85 transition-all duration-200 group-hover:border-burgundy/30 group-hover:shadow-[0_8px_24px_rgba(28,18,16,0.07)]">
        <CardContent className="flex items-center gap-4 p-5 sm:gap-5 sm:p-6">
          <Avatar
            initials={lawyer.initials}
            color={lawyer.avatarColor}
            photoUrl={lawyer.photoUrl}
            alt={lawyer.name}
            size="lg"
            className="border border-espresso/20 transition-colors group-hover:border-burgundy"
          />
          <div className="min-w-0 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-semibold text-espresso">
                {lawyer.name}
              </h3>
              {lawyer.verified && (
                <Badge variant="burgundy" className="text-[0.65rem]">
                  {t("verified")}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 font-body text-sm text-espresso/50">
              {localizedLawyerHeadline(lawyer, locale)}
            </p>
            {rating && rating.count > 0 && (
              <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-espresso/45">
                <Star className="h-3.5 w-3.5 fill-brass text-brass" />
                {rating.average} ({rating.count})
              </p>
            )}
            <p className="mt-2 flex items-center gap-1 font-body text-xs text-espresso/45">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {lawyer.city} · {lawyer.yearsExperience} {t("years")}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
