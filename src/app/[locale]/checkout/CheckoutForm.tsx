"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CustomerSchema, georgianPhonePattern, type Locale } from "@/schemas";
import { createOrderAction, type CheckoutFormState } from "./actions";

export interface CheckoutFormStrings {
  clientHeading: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  phoneHint: string;
  submit: string; // price already filled in
  submitting: string;
  consentBefore: string;
  consentTerms: string;
  consentBetween: string;
  consentPrivacy: string;
  consentAfter: string;
  errors: { name: string; email: string; phone: string; server: string };
}

type FieldName = "name" | "email" | "phone";

function validateField(field: FieldName, value: string): boolean {
  if (field === "phone") {
    return georgianPhonePattern.test(value.trim());
  }
  return CustomerSchema.shape[field].safeParse(value).success;
}

function Field({
  field,
  label,
  hint,
  type,
  autoComplete,
  inputMode,
  error,
  errorText,
  onValidate,
}: {
  field: FieldName;
  label: string;
  hint?: string;
  type: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel";
  error: boolean;
  errorText: string;
  onValidate: (field: FieldName, valid: boolean) => void;
}) {
  return (
    <div>
      <label htmlFor={`checkout-${field}`} className="text-[0.9375rem]">
        {label}
      </label>
      <input
        id={`checkout-${field}`}
        name={field}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
        aria-invalid={error || undefined}
        aria-describedby={error ? `checkout-${field}-error` : undefined}
        onBlur={(event) => {
          const value = event.target.value;
          if (value.trim() !== "") {
            onValidate(field, validateField(field, value));
          }
        }}
        onChange={() => onValidate(field, true)}
        className="rule-field mt-1 min-h-[44px] text-[1.0625rem]"
      />
      {error ? (
        <p
          id={`checkout-${field}-error`}
          className="mt-1.5 font-mono text-[0.75rem] leading-relaxed text-stamp"
        >
          {errorText}
        </p>
      ) : hint ? (
        <p className="mt-1.5 font-mono text-[0.6875rem] leading-relaxed tracking-[0.04em] text-ink-70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[48px] w-full select-none items-center justify-center gap-2 bg-stamp px-7 py-2.5 text-center text-[0.9375rem] leading-tight tracking-[0.02em] text-paper transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-press active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-55"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function CheckoutForm({
  serviceSlug,
  locale,
  strings,
  termsHref,
  privacyHref,
}: {
  serviceSlug: string;
  locale: Locale;
  strings: CheckoutFormStrings;
  termsHref: string;
  privacyHref: string;
}) {
  const [state, formAction] = useActionState<CheckoutFormState, FormData>(
    createOrderAction,
    {},
  );
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [clientErrors, setClientErrors] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    phone: false,
  });

  const onValidate = (field: FieldName, valid: boolean) => {
    setClientErrors((previous) =>
      previous[field] === !valid ? previous : { ...previous, [field]: !valid },
    );
  };

  const fieldError = (field: FieldName) =>
    clientErrors[field] || Boolean(state.fieldErrors?.[field]);

  const consentLink =
    "underline decoration-1 underline-offset-[3px] transition-colors duration-150 hover:text-stamp";

  return (
    <form action={formAction} noValidate>
      <h2 className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
        {strings.clientHeading}
      </h2>
      <input type="hidden" name="service" value={serviceSlug} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      <div className="mt-5 grid gap-7">
        <Field
          field="name"
          label={strings.nameLabel}
          type="text"
          autoComplete="name"
          error={fieldError("name")}
          errorText={strings.errors.name}
          onValidate={onValidate}
        />
        <Field
          field="email"
          label={strings.emailLabel}
          type="email"
          autoComplete="email"
          inputMode="email"
          error={fieldError("email")}
          errorText={strings.errors.email}
          onValidate={onValidate}
        />
        <Field
          field="phone"
          label={strings.phoneLabel}
          hint={strings.phoneHint}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          error={fieldError("phone")}
          errorText={strings.errors.phone}
          onValidate={onValidate}
        />
      </div>

      {state.serverError ? (
        <p
          role="alert"
          className="mt-6 border-t border-stamp pt-2 font-mono text-[0.75rem] leading-relaxed text-stamp"
        >
          {strings.errors.server}
        </p>
      ) : null}

      <div className="mt-8">
        <SubmitButton label={strings.submit} pendingLabel={strings.submitting} />
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-70">
          {strings.consentBefore}
          <Link href={termsHref} className={consentLink}>
            {strings.consentTerms}
          </Link>
          {strings.consentBetween}
          <Link href={privacyHref} className={consentLink}>
            {strings.consentPrivacy}
          </Link>
          {strings.consentAfter}
        </p>
      </div>
    </form>
  );
}
