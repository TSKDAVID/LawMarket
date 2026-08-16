"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/workspace/field";
import { PricingFields } from "@/components/workspace/pricing-fields";
import {
  FormMessage,
  WorkspacePanel,
} from "@/components/workspace/workspace-shell";
import { Avatar } from "@/components/shared/avatar";
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
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="h-12 w-full rounded-none sm:w-auto"
    >
      {label}
    </Button>
  );
}

function LocaleFields() {
  const locale = useLocale();
  return <input type="hidden" name="locale" value={locale} />;
}

function PhotoPicker({ lawyer }: { lawyer: LawyerRow }) {
  const t = useTranslations("portal");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-4 lg:w-44">
      <p className="font-mono text-sm text-espresso">
        {t("photoLabel")}
      </p>
      <Avatar
        initials={lawyer.initials}
        color={lawyer.avatar_color}
        photoUrl={preview ?? lawyer.photo_url ?? undefined}
        alt={lawyer.name}
        size="xl"
        className="h-36 w-36 border border-espresso/15"
      />
      <div>
        <input type="hidden" name="photo_url" value={lawyer.photo_url ?? ""} />
        <input
          ref={inputRef}
          id="photo"
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview((current) => {
              if (current) URL.revokeObjectURL(current);
              return file ? URL.createObjectURL(file) : null;
            });
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-11 w-full max-w-xs items-center justify-center border border-burgundy px-4 font-mono text-sm tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
        >
          {t("choosePhoto")}
        </button>
        <p className="mt-2 max-w-[12rem] font-body text-xs leading-relaxed text-espresso/55">
          {t("photoHint")}
        </p>
      </div>
    </div>
  );
}

export function ProfileForm({ lawyer }: { lawyer: LawyerRow }) {
  const t = useTranslations("portal");
  const [state, action] = useActionState<PortalState, FormData>(
    updateOwnProfile,
    { error: null }
  );

  return (
    <form action={action} className="space-y-6">
      <LocaleFields />
      <FormMessage
        error={state.error ? t(state.error) : null}
        ok={state.ok}
        okText={t("profileSaved")}
      />

      <WorkspacePanel>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <PhotoPicker lawyer={lawyer} />
          <div className="min-w-0 flex-1 space-y-5">
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
                  lawyer.headline_en === lawyer.headline_ka
                    ? ""
                    : lawyer.headline_en
                }
              />
            </Field>
          </div>
        </div>
      </WorkspacePanel>

      <WorkspacePanel className="space-y-6">
        <h2 className="font-heading text-lg font-semibold text-espresso">
          {t("profileAbout")}
        </h2>
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
            rows={5}
            defaultValue={lawyer.bio_en === lawyer.bio_ka ? "" : lawyer.bio_en}
          />
        </Field>
      </WorkspacePanel>

      <WorkspacePanel className="space-y-6">
        <h2 className="font-heading text-lg font-semibold text-espresso">
          {t("profileDetails")}
        </h2>
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
          <Field id="languages" label={t("languagesLabel")}>
            <Input
              id="languages"
              name="languages"
              defaultValue={(lawyer.languages ?? []).join(", ")}
            />
          </Field>
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
        <SubmitButton label={t("saveProfile")} />
      </WorkspacePanel>
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
    <form action={action} className="space-y-5">
      <WorkspacePanel className="space-y-5">
        <LocaleFields />
        <FormMessage
          error={state.error ? t(state.error) : null}
          ok={state.ok}
          okText={t("passwordChanged")}
        />
        <div className="max-w-md space-y-5">
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
        </div>
      </WorkspacePanel>
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
    <form action={action} className="mt-8 space-y-5">
      <WorkspacePanel className="space-y-5">
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
      <PricingFields />
      <Field id="duration" label={t("durationLabel")}>
        <Input id="duration" name="duration" type="number" min={0} />
      </Field>
      <Field id="includes_ka" label={t("includesKa")}>
        <Textarea id="includes_ka" name="includes_ka" rows={4} />
      </Field>
      <Field id="includes_en" label={t("includesEn")}>
        <Textarea id="includes_en" name="includes_en" rows={4} />
      </Field>
      <SubmitButton label={t("submitForReview")} />
      </WorkspacePanel>
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
    <form action={action} className="mt-8 space-y-5">
      <WorkspacePanel className="space-y-5">
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
      </WorkspacePanel>
    </form>
  );
}
