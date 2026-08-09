"use client";

import { type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const t = useTranslations("auth");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
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
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
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

      <Button type="submit" size="lg" className="w-full">
        {t("loginButton")}
      </Button>
    </form>
  );
}
