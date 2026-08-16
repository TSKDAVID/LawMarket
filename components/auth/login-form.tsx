"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, type AuthState } from "@/app/[locale]/auth-actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {label}
    </Button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, formAction] = useActionState<AuthState, FormData>(signIn, {
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
          htmlFor="login-email"
          className="mb-2 block font-mono text-sm text-espresso"
        >
          {t("emailLabel")}
        </label>
        <Input
          id="login-email"
          required
          type="email"
          name="email"
          autoComplete="email"
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block font-mono text-sm text-espresso"
        >
          {t("passwordLabel")}
        </label>
        <Input
          id="login-password"
          required
          type="password"
          name="password"
          autoComplete="current-password"
        />
      </div>

      <SubmitButton label={t("loginButton")} />
    </form>
  );
}
