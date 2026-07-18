import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  BadgeCheck,
  MessageSquare,
  Plane,
  Search,
  Scale,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  ProviderCard,
  providerListSelect,
} from "@/components/marketplace/provider-card";
import { pickLocale } from "@/lib/utils";
import type { ProviderListItem } from "@/lib/types";

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const supabase = await createClient();

  const [{ data: providers }, { data: areas }, { count: caseCount }] =
    await Promise.all([
      supabase
        .from("provider_profiles")
        .select(providerListSelect)
        .eq("is_published", true)
        .limit(3),
      supabase.from("practice_areas").select("*").order("id"),
      supabase
        .from("cases")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved"),
    ]);

  const featured = (providers ?? []) as unknown as ProviderListItem[];

  const steps = [
    { icon: Search, title: t("how1Title"), text: t("how1Text") },
    { icon: BadgeCheck, title: t("how2Title"), text: t("how2Text") },
    { icon: MessageSquare, title: t("how3Title"), text: t("how3Text") },
  ];

  const trust = [
    { icon: BadgeCheck, title: t("trust1Title"), text: t("trust1Text") },
    { icon: Wallet, title: t("trust2Title"), text: t("trust2Text") },
    { icon: MessageSquare, title: t("trust3Title"), text: t("trust3Text") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-medium text-brand-800">
              <Scale className="h-3.5 w-3.5" />
              LawMarket
            </div>
            <h1 className="animate-fade-up delay-100 mt-5 font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="animate-fade-up delay-200 mt-5 max-w-xl text-lg text-slate-600">
              {t("heroSubtitle")}
            </p>
            <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-3">
              <Link href="/lawyers">
                <Button size="lg">
                  {t("ctaFind")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  {t("ctaProvider")}
                </Button>
              </Link>
            </div>

            <dl className="animate-fade-up delay-300 mt-12 flex gap-10">
              {[
                [featured.length >= 3 ? "50+" : String(featured.length), t("statsProviders")],
                [String(caseCount ?? 0), t("statsCases")],
                [String(areas?.length ?? 0), t("statsAreas")],
              ].map(([num, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-serif text-3xl font-bold text-brand-900">
                    {num}
                  </dd>
                  <dd className="mt-1 text-sm text-slate-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-serif text-3xl font-bold text-slate-900">
          {t("trustTitle")}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {trust.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-100 bg-white p-8 transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Practice areas */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {t("areasTitle")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {(areas ?? []).map((area) => (
              <Link
                key={area.id}
                href={`/lawyers?area=${area.slug}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-800"
              >
                {pickLocale(locale, area.name_ka, area.name_en)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured providers */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              {t("featuredTitle")}
            </h2>
            <Link
              href="/lawyers"
              className="text-sm font-medium text-brand-800 hover:underline"
            >
              {t("ctaFind")} →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </section>
      )}

      {/* Steps */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center font-serif text-3xl font-bold text-slate-900">
            {t("howTitle")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="relative text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-3 block text-xs font-semibold uppercase tracking-wider text-brand-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expat CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-brand-900 px-8 py-14 text-center sm:px-16">
          <Plane className="mx-auto h-8 w-8 text-brand-300" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-white">
            {t("expatTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            {t("expatText")}
          </p>
          <Link href="/expat" className="mt-8 inline-block">
            <Button size="lg" variant="secondary">
              {t("expatCta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
