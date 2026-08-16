"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/workspace/field";
import { FormMessage } from "@/components/workspace/workspace-shell";
import {
  submitCaseRequest,
  submitServiceRequest,
  updateOwnProfile,
  updatePassword,
  type PortalState,
} from "@/app/[locale]/portal/actions";
import type { Category } from "@/data/types";
import type { LawyerRow } from "@/lib/supabase/database.types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {label}
    </Button>
  );
}

function LocaleFields() {
  const locale = useLocale();
  return <input type="hidden" name="locale" value={locale} />;
}

export function ProfileForm({ lawyer }: { lawyer: LawyerRow }) {
  const t = useTranslations("portal");
  const [state, action] = useActionState<PortalState, FormData>(
    updateOwnProfile,
    { error: null }
  );

  return (
    <form action={action} className="space-y-5">
      <LocaleFields />
      <FormMessage
        error={state.error ? t(state.error) : null}
        ok={state.ok}
        okText={t("profileSaved")}
      />
      <Field id="name" label={t("nameLabel")}>
        <Input id="name" name="name" required defaultValue={lawyer.name} />
      </Field>
      <Field id="headline_ka" label={t("headlineKa")}>
        <Input
          id="headline_ka"
          name="headline_ka"
          required
          defaultValue={lawyer.headline_ka}
        />
      </Field>
      <Field id="headline_en" label={t("headlineEn")}>
        <Input
          id="headline_en"
          name="headline_en"
          defaultValue={
            lawyer.headline_en === lawyer.headline_ka ? "" : lawyer.headline_en
          }
        />
      </Field>
      <Field id="bio_ka" label={t("bioKa")}>
        <Textarea
          id="bio_ka"
          name="bio_ka"
          rows={6}
          defaultValue={lawyer.bio_ka}
        />
      </Field>
      <Field id="bio_en" label={t("bioEn")}>
        <Textarea
          id="bio_en"
          name="bio_en"
          rows={6}
          defaultValue={lawyer.bio_en === lawyer.bio_ka ? "" : lawyer.bio_en}
        />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="city" label={t("cityLabel")}>
          <Input id="city" name="city" defaultValue={lawyer.city} />
        </Field>
        <Field id="years" label={t("yearsLabel")}>
          <Input
            id="years"
            name="years"
            type="number"
            min={0}
            defaultValue={lawyer.years_experience}
          />
        </Field>
      </div>
      <Field id="languages" label={t("languagesLabel")}>
        <Input
          id="languages"
          name="languages"
          defaultValue={(lawyer.languages ?? []).join(", ")}
        />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="phone" label={t("phoneLabel")}>
          <Input id="phone" name="phone" defaultValue={lawyer.phone ?? ""} />
        </Field>
        <Field id="contact_email" label={t("emailLabel")}>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={lawyer.contact_email ?? ""}
          />
        </Field>
      </div>
      <Field id="photo_url" label={t("photoLabel")}>
        <Input
          id="photo_url"
          name="photo_url"
          defaultValue={lawyer.photo_url ?? ""}
        />
      </Field>
      <SubmitButton label={t("saveProfile")} />
    </form>
  );
}

export function PasswordForm() {
  const t = useTranslations("portal");
  const [state, action] = useActionState<PortalState, FormData>(
    updatePassword,
    { error: null }
  );

  return (
    <form action={action} className="mt-12 space-y-5 border-t border-espresso/15 pt-10">
      <LocaleFields />
      <h2 className="font-heading text-xl font-semibold text-espresso">
        {t("passwordTitle")}
      </h2>
      <p className="font-body text-sm text-espresso/75">{t("passwordBody")}</p>
      <FormMessage
        error={state.error ? t(state.error) : null}
        ok={state.ok}
        okText={t("passwordChanged")}
      />
      <Field id="current_password" label={t("currentPassword")}>
        <Input
          id="current_password"
          name="current_password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Field id="new_password" label={t("newPassword")}>
        <Input
          id="new_password"
          name="new_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <Field id="confirm_password" label={t("confirmPassword")}>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <SubmitButton label={t("savePassword")} />
    </form>
  );
}

export function ServiceRequestForm({ categories }: { categories: Category[] }) {
  const t = useTranslations("portal");
  const [state, action] = useActionState<PortalState, FormData>(
    submitServiceRequest,
    { error: null }
  );

  return (
    <form action={action} className="mt-8 space-y-5 border border-espresso/20 bg-parchment p-6">
      <LocaleFields />
      <h2 className="font-heading text-lg font-semibold text-espresso">
        {t("addService")}
      </h2>
      <FormMessage
        error={state.error ? t(state.error) : null}
        ok={state.ok}
        okText={t("submitted")}
      />
      <Field id="title_ka" label={t("serviceTitleKa")}>
        <Input id="title_ka" name="title_ka" required />
      </Field>
      <Field id="title_en" label={t("serviceTitleEn")}>
        <Input id="title_en" name="title_en" />
      </Field>
      <Field id="description_ka" label={t("serviceDescKa")}>
        <Textarea id="description_ka" name="description_ka" rows={5} required />
      </Field>
      <Field id="description_en" label={t("serviceDescEn")}>
        <Textarea id="description_en" name="description_en" rows={5} />
      </Field>
      <Field id="category_id" label={t("categoryLabel")}>
        <Select id="category_id" name="category_id" required defaultValue="">
          <option value="" disabled>
            —
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name_ka}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="price" label={t("priceLabel")}>
          <Input id="price" name="price" type="number" min={0} step="1" required />
        </Field>
        <Field id="duration" label={t("durationLabel")}>
          <Input id="duration" name="duration" type="number" min={0} />
        </Field>
      </div>
      <Field id="includes_ka" label={t("includesKa")}>
        <Textarea id="includes_ka" name="includes_ka" rows={4} />
      </Field>
      <Field id="includes_en" label={t("includesEn")}>
        <Textarea id="includes_en" name="includes_en" rows={4} />
      </Field>
      <SubmitButton label={t("submitForReview")} />
    </form>
  );
}

export function CaseRequestForm({ categories }: { categories: Category[] }) {
  const t = useTranslations("portal");
  const [state, action] = useActionState<PortalState, FormData>(
    submitCaseRequest,
    { error: null }
  );

  return (
    <form action={action} className="mt-8 space-y-5 border border-espresso/20 bg-parchment p-6">
      <LocaleFields />
      <h2 className="font-heading text-lg font-semibold text-espresso">
        {t("addCase")}
      </h2>
      <FormMessage
        error={state.error ? t(state.error) : null}
        ok={state.ok}
        okText={t("submitted")}
      />
      <Field id="case_title_ka" label={t("caseTitleKa")}>
        <Input id="case_title_ka" name="title_ka" required />
      </Field>
      <Field id="case_title_en" label={t("caseTitleEn")}>
        <Input id="case_title_en" name="title_en" />
      </Field>
      <Field id="case_description_ka" label={t("caseDescKa")}>
        <Textarea
          id="case_description_ka"
          name="description_ka"
          rows={5}
          required
        />
      </Field>
      <Field id="case_description_en" label={t("caseDescEn")}>
        <Textarea id="case_description_en" name="description_en" rows={5} />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="year" label={t("yearLabel")}>
          <Input id="year" name="year" type="number" min={1990} max={2100} />
        </Field>
        <Field id="case_category_id" label={t("categoryLabel")}>
          <Select id="case_category_id" name="category_id" defaultValue="">
            <option value="">—</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_ka}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field id="outcome_ka" label={t("outcomeKa")}>
        <Input id="outcome_ka" name="outcome_ka" />
      </Field>
      <Field id="outcome_en" label={t("outcomeEn")}>
        <Input id="outcome_en" name="outcome_en" />
      </Field>
      <SubmitButton label={t("submitForReview")} />
    </form>
  );
}
