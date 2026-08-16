"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/workspace/field";
import { FormMessage } from "@/components/workspace/workspace-shell";
import {
  createLawyerAccount,
  reviewChangeRequest,
  type AdminState,
} from "@/app/[locale]/admin/actions";

function CreateSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {label}
    </Button>
  );
}

function ReviewButtons() {
  const t = useTranslations("admin");
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="submit"
        name="decision"
        value="approved"
        size="lg"
        disabled={pending}
      >
        {t("approve")}
      </Button>
      <Button
        type="submit"
        name="decision"
        value="rejected"
        size="lg"
        variant="outline"
        disabled={pending}
      >
        {t("reject")}
      </Button>
    </div>
  );
}

export function CreateLawyerForm() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [state, action] = useActionState<AdminState, FormData>(
    createLawyerAccount,
    { error: null }
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <FormMessage
        error={state.error ? t(state.error) : null}
        ok={state.ok}
        okText={t("created")}
      />
      <Field id="lawyer-name" label={t("nameLabel")}>
        <Input id="lawyer-name" name="name" required />
      </Field>
      <Field id="lawyer-email" label={t("emailLabel")}>
        <Input id="lawyer-email" name="email" type="email" required />
      </Field>
      <Field id="lawyer-password" label={t("passwordLabel")}>
        <Input
          id="lawyer-password"
          name="password"
          type="password"
          minLength={8}
          required
        />
      </Field>
      <CreateSubmit label={t("create")} />
    </form>
  );
}

export function ReviewForm({ id }: { id: string }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [state, action] = useActionState<AdminState, FormData>(
    reviewChangeRequest,
    { error: null }
  );

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="id" value={id} />
      <FormMessage
        error={state.error ? t(state.error) : null}
        ok={state.ok}
        okText={state.decision === "rejected" ? t("rejected") : t("approved")}
      />
      <Field id="review_note" label={t("rejectNote")}>
        <Textarea id="review_note" name="review_note" rows={3} />
      </Field>
      <ReviewButtons />
    </form>
  );
}
