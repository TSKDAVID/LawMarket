import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  BadgeCheck,
  Briefcase,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  MessageSquare,
  Plane,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerifiedSeal } from "@/components/shared/verified-seal";
import { startConversation } from "@/lib/actions/messaging";
import { formatGel, pickLocale } from "@/lib/utils";
import type { Case, PracticeArea, Service } from "@/lib/types";

type ProviderProfile = {
  id: string;
  slug: string;
  headline_ka: string;
  headline_en: string;
  bio_ka: string;
  bio_en: string;
  city: string;
  languages: string[];
  years_experience: number;
  website: string | null;
  accepts_expat: boolean;
  profiles: { full_name: string; avatar_url: string | null } | null;
  provider_practice_areas: { practice_areas: PracticeArea | null }[];
};

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("provider");
  const tc = await getTranslations("common");
  const tb = await getTranslations("booking");
  const supabase = await createClient();

  const { data } = await supabase
    .from("provider_profiles")
    .select(
      `id, slug, headline_ka, headline_en, bio_ka, bio_en, city, languages,
       years_experience, website, accepts_expat,
       profiles ( full_name, avatar_url ),
       provider_practice_areas ( practice_areas ( id, slug, name_ka, name_en ) )`,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) notFound();
  const provider = data as unknown as ProviderProfile;

  const [{ data: servicesData }, { data: casesData }, { data: auth }] =
    await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("provider_id", provider.id)
        .eq("is_active", true)
        .order("price_gel"),
      supabase
        .from("cases")
        .select(
          "id, provider_id, case_number, title_ka, title_en, summary_ka, summary_en, year, registry_url, status, rejection_reason, practice_areas ( id, slug, name_ka, name_en )",
        )
        .eq("provider_id", provider.id)
        .eq("status", "approved")
        .order("year", { ascending: false }),
      supabase.auth.getUser(),
    ]);

  const services = (servicesData ?? []) as Service[];
  const cases = (casesData ?? []) as unknown as Case[];
  const isLoggedIn = Boolean(auth.user);

  const name = provider.profiles?.full_name ?? "";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-50 font-serif text-2xl font-bold text-brand-800">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {name}
            </h1>
            <p className="mt-1 text-lg text-slate-600">
              {pickLocale(locale, provider.headline_ka, provider.headline_en)}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {provider.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-4 w-4" /> {provider.years_experience}{" "}
                {tc("years")}
              </span>
              <span className="inline-flex items-center gap-1 uppercase">
                <Globe className="h-4 w-4" />
                {provider.languages.join(", ")}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {provider.provider_practice_areas
                .map((pa) => pa.practice_areas)
                .filter(Boolean)
                .map((a) => (
                  <Link key={a!.id} href={`/lawyers?area=${a!.slug}`}>
                    <Badge variant="outline" className="hover:border-brand-300">
                      {pickLocale(locale, a!.name_ka, a!.name_en)}
                    </Badge>
                  </Link>
                ))}
              {provider.accepts_expat && (
                <Badge>
                  <Plane className="h-3 w-3" /> {t("expatBadge")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {isLoggedIn ? (
            <form action={startConversation}>
              <input type="hidden" name="provider_id" value={provider.id} />
              <input type="hidden" name="provider_slug" value={provider.slug} />
              <Button type="submit">
                <MessageSquare className="h-4 w-4" />
                {t("message")}
              </Button>
            </form>
          ) : (
            <Link href={`/login?next=/lawyers/${provider.slug}`}>
              <Button variant="outline">{t("loginToContact")}</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {/* About */}
          <section>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              {t("about")}
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
              {pickLocale(locale, provider.bio_ka, provider.bio_en)}
            </p>
          </section>

          {/* Verified cases */}
          <section>
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-slate-900">
              <BadgeCheck className="h-5 w-5 text-emerald-600" />
              {t("cases")}
            </h2>
            {cases.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">{t("casesEmpty")}</p>
            ) : (
              <div className="mt-4 space-y-4">
                {cases.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {pickLocale(locale, c.title_ka, c.title_en)}
                        </h3>
                        <VerifiedSeal />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {pickLocale(locale, c.summary_ka, c.summary_en)}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>
                          {t("caseNumber")}: {c.case_number}
                        </span>
                        {c.year && <span>{c.year}</span>}
                        {c.practice_areas && (
                          <span>
                            {pickLocale(
                              locale,
                              c.practice_areas.name_ka,
                              c.practice_areas.name_en,
                            )}
                          </span>
                        )}
                        {c.registry_url && (
                          <a
                            href={c.registry_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-700 hover:underline"
                          >
                            {t("registryLink")}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Services */}
        <aside>
          <h2 className="font-serif text-xl font-bold text-slate-900">
            {t("services")}
          </h2>
          {services.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">{t("servicesEmpty")}</p>
          ) : (
            <div className="mt-4 space-y-4">
              {services.map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-slate-900">
                      {pickLocale(locale, s.title_ka, s.title_en)}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-500">
                      {pickLocale(locale, s.description_ka, s.description_en)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-lg font-bold text-brand-900">
                        {formatGel(Number(s.price_gel), locale)}
                        {s.duration_min && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-slate-400">
                            <Clock className="h-3 w-3" />
                            {s.duration_min} {tc("minutes")}
                          </span>
                        )}
                      </div>
                      {isLoggedIn ? (
                        <Link href={`/lawyers/${provider.slug}/book/${s.id}`}>
                          <Button size="sm">{t("book")}</Button>
                        </Link>
                      ) : (
                        <Link href={`/login?next=/lawyers/${provider.slug}`}>
                          <Button size="sm" variant="outline">
                            {tb("loginRequired")}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
