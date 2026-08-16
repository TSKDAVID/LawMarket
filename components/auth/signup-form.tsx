"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp, type AuthState } from "@/app/[locale]/auth-actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {label}
    </Button>
  );
}

export function SignupForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, formAction] = useActionState<AuthState, FormData>(signUp, {
    error: null,
  });

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {next && <input type="hidden" name="next" value={next} />}

      {state.error && (
        <p
          role="alert"
          className="border-l-[3px] border-burgundy bg-burgundy-tint px-4 py-3 font-body text-sm text-burgundy-dark"
        >
          {t(`errors.${state.error}`)}
        </p>
      )}

      <div>
        <label
          htmlFor="signup-name"
          className="mb-2 block font-mono text-sm text-espresso"
        >
          {t("fullNameLabel")}
        </label>
        <Input id="signup-name" required name="name" autoComplete="name" />
      </div>
      <div>
        <label
          htmlFor="signup-email"
          className="mb-2 block font-mono text-sm text-espresso"
        >
          {t("emailLabel")}
        </label>
        <Input
          id="signup-email"
          required
          type="email"
          name="email"
          autoComplete="email"
        />
      </div>
      <div>
        <label
          htmlFor="signup-password"
          className="mb-2 block font-mono text-sm text-espresso"
        >
          {t("passwordLabel")}
        </label>
        <Input
          id="signup-password"
          required
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
        />
      </div>
      <div>
        <label
          htmlFor="signup-confirm-password"
          className="mb-2 block font-mono text-sm text-espresso"
        >
          {t("confirmPasswordLabel")}
        </label>
        <Input
          id="signup-confirm-password"
          required
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      <SubmitButton label={t("signupButton")} />
    </form>
  );
}
