"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { homePathForRole, mapAuthError, pathFromNextParam } from "@/lib/auth-paths";

export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("missingFields");
      setPending(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        setError(authError ? mapAuthError(authError) : "signInFailed");
        setPending(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      const dest =
        pathFromNextParam(next) ?? homePathForRole(profile?.role);

      router.replace(dest);
      router.refresh();
    } catch {
      setError("signInFailed");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />

      {error && (
        <p
          role="alert"
          className="border-l-[3px] border-burgundy bg-burgundy-tint px-4 py-3 font-body text-sm text-burgundy-dark"
        >
          {t(`errors.${error}`)}
        </p>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block font-body text-sm font-medium text-espresso/80"
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
          className="mb-2 block font-body text-sm font-medium text-espresso/80"
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

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {t("loginButton")}
      </Button>
    </form>
  );
}
