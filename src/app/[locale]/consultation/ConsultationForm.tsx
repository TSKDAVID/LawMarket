"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CustomerSchema, georgianPhonePattern, type Locale } from "@/schemas";
import {
  createConsultationAction,
  type ConsultationFormState,
} from "./actions";
import { Seal } from "@/components/Seal";

export interface ConsultationFormStrings {
  formHeading: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  phoneHint: string;
  matterLabel: string;
  submit: string;
  submitting: string;
  successEyebrow: string;
  successTitle: string;
  successBody: string;
  refLabel: string;
  sealAria: string;
  errors: { name: string; email: string; phone: string; server: string };
}

type FieldName = "name" | "email" | "phone";

function validateField(field: FieldName, value: string): boolean {
  if (field === "phone") return georgianPhonePattern.test(value.trim());
  return CustomerSchema.shape[field].safeParse(value).success;
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[48px] w-full select-none items-center justify-center bg-stamp px-7 py-2.5 text-[0.9375rem] leading-tight tracking-[0.02em] text-paper transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-press active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-55"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function ConsultationForm({
  locale,
  strings,
}: {
  locale: Locale;
  strings: ConsultationFormStrings;
}) {
  const [state, formAction] = useActionState<ConsultationFormState, FormData>(
    createConsultationAction,
    {},
  );
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [clientErrors, setClientErrors] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    phone: false,
  });

  /* The registered request — the form gives way to the stamped receipt. */
  if (state.reference) {
    return (
      <div aria-live="polite" className="border-t-2 border-ink pt-5">
        <p className="font-mono text-[0.6875rem] tracking-eyebrow text-brass">
          {strings.successEyebrow}
        </p>
        <h2 className="mt-3 font-display text-display-md">{strings.successTitle}</h2>
        <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-70">
          {strings.successBody}
        </p>
        <div className="mt-6 flex items-end justify-between gap-6 border-b border-t border-ink/20 py-4">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
              {strings.refLabel}
            </p>
            <p className="mt-1 font-mono text-[1.2rem] tracking-[0.04em]">
              {state.reference}
            </p>
          </div>
          <Seal size={84} rotate={-10} label={strings.sealAria} className="animate-stamp" />
        </div>
      </div>
    );
  }

  const onValidate = (field: FieldName, valid: boolean) => {
    setClientErrors((previous) =>
      previous[field] === !valid ? previous : { ...previous, [field]: !valid },
    );
  };

  const fieldError = (field: FieldName) =>
    clientErrors[field] || Boolean(state.fieldErrors?.[field]);

  const fields: {
    field: FieldName;
    label: string;
    type: string;
    autoComplete: string;
    inputMode?: "email" | "tel";
    hint?: string;
    errorText: string;
  }[] = [
    {
      field: "name",
      label: strings.nameLabel,
      type: "text",
      autoComplete: "name",
      errorText: strings.errors.name,
    },
    {
      field: "email",
      label: strings.emailLabel,
      type: "email",
      autoComplete: "email",
      inputMode: "email",
      errorText: strings.errors.email,
    },
    {
      field: "phone",
      label: strings.phoneLabel,
      type: "tel",
      autoComplete: "tel",
      inputMode: "tel",
      hint: strings.phoneHint,
      errorText: strings.errors.phone,
    },
  ];

  return (
    <form action={formAction} noValidate>
      <h2 className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
        {strings.formHeading}
      </h2>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      <div className="mt-5 grid gap-7">
        {fields.map(({ field, label, type, autoComplete, inputMode, hint, errorText }) => {
          const invalid = fieldError(field);
          return (
            <div key={field}>
              <label htmlFor={`consult-${field}`} className="text-[0.9375rem]">
                {label}
              </label>
              <input
                id={`consult-${field}`}
                name={field}
                type={type}
                autoComplete={autoComplete}
                inputMode={inputMode}
                required
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? `consult-${field}-error` : undefined}
                onBlur={(event) => {
                  const value = event.target.value;
                  if (value.trim() !== "") {
                    onValidate(field, validateField(field, value));
                  }
                }}
                onChange={() => onValidate(field, true)}
                className="rule-field mt-1 min-h-[44px] text-[1.0625rem]"
              />
              {invalid ? (
                <p
                  id={`consult-${field}-error`}
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
        })}

        <div>
          <label htmlFor="consult-matter" className="text-[0.9375rem]">
            {strings.matterLabel}
          </label>
          <textarea
            id="consult-matter"
            name="matter"
            rows={3}
            maxLength={600}
            className="rule-field mt-1 resize-y text-[1.0625rem]"
          />
        </div>
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
      </div>
    </form>
  );
}
