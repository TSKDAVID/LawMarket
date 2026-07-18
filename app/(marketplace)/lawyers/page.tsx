import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import {
  ProviderCard,
  providerListSelect,
} from "@/components/marketplace/provider-card";
import { pickLocale } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ProviderListItem } from "@/lib/types";
import Link from "next/link";

export async function generateMetadata() {
  const t = await getTranslations("lawyers");
  return { title: t("title") };
}

const LANGUAGE_LABELS: Record<string, string> = {
  ka: "ქართული / Georgian",
  en: "English",
  ru: "Русский",
  tr: "Türkçe",
};

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; city?: string; lang?: string; expat?: string }>;
}) {
  const { area, city, lang, expat } = await searchParams;
  const t = await getTranslations("lawyers");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: areas } = await supabase
    .from("practice_areas")
    .select("*")
    .order("id");

  let providerIdsForArea: string[] | null = null;
  if (area) {
    const selectedArea = areas?.find((a) => a.slug === area);
    if (selectedArea) {
      const { data: links } = await supabase
        .from("provider_practice_areas")
        .select("provider_id")
        .eq("practice_area_id", selectedArea.id);
      providerIdsForArea = (links ?? []).map((l) => l.provider_id);
    }
  }

  let query = supabase
    .from("provider_profiles")
    .select(providerListSelect)
    .eq("is_published", true)
    .order("years_experience", { ascending: false });

  if (providerIdsForArea !== null) {
    query = query.in("id", providerIdsForArea.length ? providerIdsForArea : ["00000000-0000-0000-0000-000000000000"]);
  }
  if (city) query = query.eq("city", city);
  if (lang) query = query.contains("languages", [lang]);
  if (expat === "1") query = query.eq("accepts_expat", true);

  const { data } = await query;
  const providers = (data ?? []) as unknown as ProviderListItem[];

  const { data: allProviders } = await supabase
    .from("provider_profiles")
    .select("city, languages")
    .eq("is_published", true);

  const cities = [...new Set((allProviders ?? []).map((p) => p.city).filter(Boolean))];
  const languages = [
    ...new Set((allProviders ?? []).flatMap((p) => p.languages ?? [])),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900">
        {t("title")}
      </h1>
      <p className="mt-3 text-lg text-slate-600">{t("subtitle")}</p>

      <form
        method="get"
        className="mt-8 grid gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Select name="area" defaultValue={area ?? ""} aria-label={t("filters.practiceArea")}>
          <option value="">
            {t("filters.practiceArea")}: {t("filters.all")}
          </option>
          {(areas ?? []).map((a) => (
            <option key={a.id} value={a.slug}>
              {pickLocale(locale, a.name_ka, a.name_en)}
            </option>
          ))}
        </Select>

        <Select name="city" defaultValue={city ?? ""} aria-label={t("filters.city")}>
          <option value="">
            {t("filters.city")}: {t("filters.all")}
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select name="lang" defaultValue={lang ?? ""} aria-label={t("filters.language")}>
          <option value="">
            {t("filters.language")}: {t("filters.all")}
          </option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {LANGUAGE_LABELS[l] ?? l}
            </option>
          ))}
        </Select>

        <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
          <input
            type="checkbox"
            name="expat"
            value="1"
            defaultChecked={expat === "1"}
            className="h-4 w-4 accent-brand-900"
          />
          {t("filters.expatOnly")}
        </label>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {t("filters.search")}
          </Button>
          <Link href="/lawyers" className="shrink-0">
            <Button type="button" variant="ghost">
              {t("filters.reset")}
            </Button>
          </Link>
        </div>
      </form>

      {providers.length === 0 ? (
        <p className="mt-16 text-center text-slate-500">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}
