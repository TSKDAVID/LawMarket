"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { login, signup, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {t("invalidCredentials")}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required autoFocus />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {t("loginButton")}
      </Button>
      <p className="text-center text-sm text-slate-500">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-medium text-brand-800 hover:underline">
          {t("signupButton")}
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signup,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {t("signupError")}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="full_name">{t("fullName")}</Label>
        <Input id="full_name" name="full_name" required autoFocus />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
        />
        <p className="text-xs text-slate-400">{t("passwordHint")}</p>
      </div>

      <fieldset className="space-y-2">
        <Label>{t("iAm")}</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { value: "client", label: t("roleClient") },
            { value: "provider", label: t("roleProvider") },
          ].map((role, i) => (
            <label
              key={role.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700",
                "has-checked:border-brand-800 has-checked:bg-brand-50 has-checked:text-brand-900",
              )}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                defaultChecked={i === 0}
                className="accent-brand-900"
              />
              {role.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {t("signupButton")}
      </Button>
      <p className="text-center text-sm text-slate-500">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-brand-800 hover:underline">
          {t("loginButton")}
        </Link>
      </p>
    </form>
  );
}
