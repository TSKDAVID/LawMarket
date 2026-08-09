"use client";

import { type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const t = useTranslations("auth");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <p className="mb-2 font-body text-sm font-medium text-espresso/70">
          {t("roleLabel")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="role"
              value="client"
              defaultChecked
              className="peer sr-only"
            />
            <span className="block rounded-xl border border-espresso/15 px-3 py-3 text-center font-body text-xs font-medium text-espresso/60 transition-colors peer-checked:border-burgundy peer-checked:bg-burgundy-tint peer-checked:text-burgundy-dark">
              {t("roleClient")}
            </span>
          </label>
          <label className="cursor-pointer">
            <input type="radio" name="role" value="lawyer" className="peer sr-only" />
            <span className="block rounded-xl border border-espresso/15 px-3 py-3 text-center font-body text-xs font-medium text-espresso/60 transition-colors peer-checked:border-burgundy peer-checked:bg-burgundy-tint peer-checked:text-burgundy-dark">
              {t("roleLawyer")}
            </span>
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="signup-name"
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
        >
          {t("fullNameLabel")}
        </label>
        <Input id="signup-name" required name="name" autoComplete="name" />
      </div>
      <div>
        <label
          htmlFor="signup-email"
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
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
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
        >
          {t("passwordLabel")}
        </label>
        <Input
          id="signup-password"
          required
          type="password"
          name="password"
          autoComplete="new-password"
        />
      </div>
      <div>
        <label
          htmlFor="signup-confirm-password"
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
        >
          {t("confirmPasswordLabel")}
        </label>
        <Input
          id="signup-confirm-password"
          required
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" size="lg" className="w-full">
        {t("signupButton")}
      </Button>
    </form>
  );
}
