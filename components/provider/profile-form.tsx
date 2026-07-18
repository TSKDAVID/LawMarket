"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  saveProviderProfile,
  type ProviderFormState,
} from "@/lib/actions/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pickLocale } from "@/lib/utils";
import type { PracticeArea } from "@/lib/types";

export type ProfileFormValues = {
  slug: string;
  headline_ka: string;
  headline_en: string;
  bio_ka: string;
  bio_en: string;
  city: string;
  languages: string[];
  years_experience: number;
  accepts_expat: boolean;
  is_published: boolean;
  practiceAreaIds: number[];
};

export function ProviderProfileForm({
  values,
  areas,
  fromOnboarding = false,
}: {
  values: ProfileFormValues;
  areas: PracticeArea[];
  fromOnboarding?: boolean;
}) {
  const t = useTranslations("onboarding");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [state, action, pending] = useActionState<ProviderFormState, FormData>(
    saveProviderProfile,
    null,
  );

  return (
    <form action={action} className="space-y-6">
      {fromOnboarding && (
        <input type="hidden" name="from_onboarding" value="1" />
      )}

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error === "slugTaken" ? t("slugTaken") : tc("error")}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {tc("saved")}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="slug">{t("slug")}</Label>
        <Input
          id="slug"
          name="slug"
          required
          pattern="[a-z0-9-]+"
          defaultValue={values.slug}
          placeholder="nino-beridze"
        />
        <p className="text-xs text-slate-400">{t("slugHint")}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="headline_ka">{t("headlineKa")}</Label>
          <Input
            id="headline_ka"
            name="headline_ka"
            required
            defaultValue={values.headline_ka}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headline_en">{t("headlineEn")}</Label>
          <Input
            id="headline_en"
            name="headline_en"
            defaultValue={values.headline_en}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bio_ka">{t("bioKa")}</Label>
          <Textarea
            id="bio_ka"
            name="bio_ka"
            rows={5}
            defaultValue={values.bio_ka}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio_en">{t("bioEn")}</Label>
          <Textarea
            id="bio_en"
            name="bio_en"
            rows={5}
            defaultValue={values.bio_en}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">{t("city")}</Label>
          <Input id="city" name="city" required defaultValue={values.city} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="languages">{t("languages")}</Label>
          <Input
            id="languages"
            name="languages"
            defaultValue={values.languages.join(", ")}
            placeholder="ka, en"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="years_experience">{t("yearsExperience")}</Label>
          <Input
            id="years_experience"
            name="years_experience"
            type="number"
            min={0}
            max={70}
            defaultValue={values.years_experience}
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <Label>{t("practiceAreas")}</Label>
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <label
              key={area.id}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 has-checked:border-brand-800 has-checked:bg-brand-50 has-checked:text-brand-900"
            >
              <input
                type="checkbox"
                name="practice_areas"
                value={area.id}
                defaultChecked={values.practiceAreaIds.includes(area.id)}
                className="accent-brand-900"
              />
              {pickLocale(locale, area.name_ka, area.name_en)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3 rounded-lg bg-slate-50 p-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="accepts_expat"
            defaultChecked={values.accepts_expat}
            className="h-4 w-4 accent-brand-900"
          />
          {t("acceptsExpat")}
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={values.is_published}
            className="h-4 w-4 accent-brand-900"
          />
          {t("publish")}
        </label>
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? tc("loading") : fromOnboarding ? t("submit") : tc("save")}
      </Button>
    </form>
  );
}
