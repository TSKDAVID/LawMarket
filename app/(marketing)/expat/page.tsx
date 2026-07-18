import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Building2, Landmark, Percent } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  ProviderCard,
  providerListSelect,
} from "@/components/marketplace/provider-card";
import type { ProviderListItem } from "@/lib/types";

export async function generateMetadata() {
  const t = await getTranslations("expat");
  return { title: t("title") };
}

export default async function ExpatPage() {
  const t = await getTranslations("expat");
  const supabase = await createClient();

  const [{ data: providers }, { data: auth }] = await Promise.all([
    supabase
      .from("provider_profiles")
      .select(providerListSelect)
      .eq("is_published", true)
      .eq("accepts_expat", true)
      .limit(6),
    supabase.auth.getUser(),
  ]);

  const programProviders = (providers ?? []) as unknown as ProviderListItem[];
  const isLoggedIn = Boolean(auth.user);

  const points = [
    { icon: Building2, title: t("point1Title"), text: t("point1Text") },
    { icon: Landmark, title: t("point2Title"), text: t("point2Text") },
    { icon: Percent, title: t("point3Title"), text: t("point3Text") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{t("subtitle")}</p>
        <Link href={isLoggedIn ? "/expat/apply" : "/login?next=/expat/apply"}>
          <Button size="lg" className="mt-8">
            {isLoggedIn ? t("applyCta") : t("loginToApply")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {points.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-100 bg-white p-8"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-slate-50/80 p-8 sm:p-12">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          {t("howTitle")}
        </h2>
        <ol className="mt-6 space-y-4">
          {[t("how1"), t("how2"), t("how3")].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {programProviders.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {t("providersTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programProviders.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
