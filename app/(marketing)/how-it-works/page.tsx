import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  BadgeCheck,
  CalendarCheck,
  FileCheck,
  MessageSquare,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const t = await getTranslations("howItWorks");
  return { title: t("title") };
}

export default async function HowItWorksPage() {
  const t = await getTranslations("howItWorks");

  const clientSteps = [
    { icon: Search, title: t("client1Title"), text: t("client1Text") },
    { icon: BadgeCheck, title: t("client2Title"), text: t("client2Text") },
    { icon: CalendarCheck, title: t("client3Title"), text: t("client3Text") },
  ];

  const providerSteps = [
    { icon: UserPlus, title: t("provider1Title"), text: t("provider1Text") },
    { icon: FileCheck, title: t("provider2Title"), text: t("provider2Text") },
    { icon: Users, title: t("provider3Title"), text: t("provider3Text") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{t("subtitle")}</p>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {t("clientsTitle")}
          </h2>
          <ol className="mt-8 space-y-8">
            {clientSteps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {i + 1}. {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {t("providersTitle")}
          </h2>
          <ol className="mt-8 space-y-8">
            {providerSteps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {i + 1}. {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-20 rounded-2xl border border-slate-100 bg-slate-50/60 p-8 sm:p-12">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              {t("verificationTitle")}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
              {t("verificationText")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="flex items-center justify-center gap-2 font-serif text-2xl font-bold text-slate-900">
          <MessageSquare className="h-6 w-6 text-brand-800" />
          {t("ctaTitle")}
        </h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/lawyers">
            <Button size="lg">{t("ctaClient")}</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              {t("ctaProvider")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
