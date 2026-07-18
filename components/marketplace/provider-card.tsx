import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { BadgeCheck, MapPin, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pickLocale, formatGel } from "@/lib/utils";
import type { ProviderListItem } from "@/lib/types";

export async function ProviderCard({ provider }: { provider: ProviderListItem }) {
  const locale = await getLocale();
  const t = await getTranslations("lawyers");
  const tc = await getTranslations("common");

  const name = provider.profiles?.full_name ?? "";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const areas = provider.provider_practice_areas
    .map((pa) => pa.practice_areas)
    .filter(Boolean)
    .slice(0, 3);
  const verifiedCount = provider.cases.length;
  const minPrice = provider.services.length
    ? Math.min(...provider.services.map((s) => Number(s.price_gel)))
    : null;

  return (
    <Link href={`/lawyers/${provider.slug}`} className="group block h-full">
      <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 font-serif font-bold text-brand-800">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-800">
                {name}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                {pickLocale(locale, provider.headline_ka, provider.headline_en)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {areas.map((a) => (
              <Badge key={a!.id} variant="outline">
                {pickLocale(locale, a!.name_ka, a!.name_en)}
              </Badge>
            ))}
            {provider.accepts_expat && (
              <Badge variant="default">
                <Plane className="h-3 w-3" /> Expat
              </Badge>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {provider.city}
            </span>
            {verifiedCount > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {verifiedCount} {t("verifiedCases")}
              </span>
            )}
            {minPrice !== null && (
              <span>
                {t("from")} {formatGel(minPrice, locale)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export const providerListSelect = `
  id, slug, headline_ka, headline_en, city, languages, years_experience, accepts_expat,
  profiles ( full_name, avatar_url ),
  provider_practice_areas ( practice_areas ( id, slug, name_ka, name_en ) ),
  cases ( id ),
  services ( price_gel )
`;

export { type ProviderListItem };
