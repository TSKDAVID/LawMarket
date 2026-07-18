"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  submitExpatApplication,
  type ExpatFormState,
} from "@/lib/actions/expat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ExpatApplyForm({
  defaults,
}: {
  defaults: { fullName: string; email: string };
}) {
  const t = useTranslations("expat.form");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState<ExpatFormState, FormData>(
    submitExpatApplication,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error === "alreadyPending" ? t("alreadyPending") : tc("error")}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t("fullName")}</Label>
          <Input
            id="full_name"
            name="full_name"
            required
            defaultValue={defaults.fullName}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={defaults.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{t("country")}</Label>
          <Input id="country" name="country" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">{t("topic")}</Label>
        <Input
          id="topic"
          name="topic"
          required
          placeholder={t("topicPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">{t("details")}</Label>
        <Textarea
          id="details"
          name="details"
          rows={5}
          placeholder={t("detailsPlaceholder")}
        />
      </div>

      <Button type="submit" disabled={pending} size="lg">
        {pending ? tc("loading") : t("submit")}
      </Button>
    </form>
  );
}
