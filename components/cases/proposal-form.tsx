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
  submitProposal,
  type CaseState,
} from "@/app/[locale]/cases/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="h-12 w-full rounded-none sm:w-auto"
    >
      {label}
    </Button>
  );
}

export function ProposalForm({ caseId }: { caseId: string }) {
  const t = useTranslations("cases");
  const locale = useLocale();
  const [state, formAction] = useActionState<CaseState, FormData>(
    submitProposal,
    { error: null }
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="case_id" value={caseId} />

      <FormMessage
        error={state.error ? t(`errors.${state.error}`) : null}
        ok={state.ok}
        okText={t("proposalSent")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="proposal-price" label={`${t("proposalPrice")} (GEL)`}>
          <Input
            id="proposal-price"
            name="price"
            type="number"
            inputMode="decimal"
            min={0}
            step="1"
            required
          />
        </Field>
        <Field id="proposal-days" label={t("proposalDuration")}>
          <Input
            id="proposal-days"
            name="duration_days"
            type="number"
            inputMode="numeric"
            min={1}
            step="1"
            placeholder="3"
          />
        </Field>
      </div>

      <Field id="proposal-message" label={t("proposalMessage")}>
        <Textarea
          id="proposal-message"
          name="message"
          required
          minLength={20}
          maxLength={4000}
          rows={6}
          placeholder={t("proposalMessagePlaceholder")}
        />
      </Field>

      <SubmitButton label={t("sendProposal")} />
    </form>
  );
}
