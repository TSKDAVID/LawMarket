"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/workspace/field";
import { FormMessage } from "@/components/workspace/workspace-shell";
import {
  createClientCase,
  updateClientCase,
  type CaseState,
} from "@/app/[locale]/cases/actions";
import { localizedCategoryName } from "@/data/localize";
import type { Category } from "@/data/types";
import type { Locale } from "@/i18n/routing";
import type { ClientCaseRow } from "@/lib/supabase/database.types";

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

export function CaseForm({
  categories,
  existing,
  onCancel,
}: {
  categories: Category[];
  existing?: ClientCaseRow;
  onCancel?: () => void;
}) {
  const t = useTranslations("cases");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const action = existing ? updateClientCase : createClientCase;
  const [state, formAction] = useActionState<CaseState, FormData>(action, {
    error: null,
  });

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {existing ? <input type="hidden" name="id" value={existing.id} /> : null}

      <FormMessage
        error={state.error ? t(`errors.${state.error}`) : null}
        ok={state.ok}
        okText={t("saved")}
      />

      <Field id="case-title" label={t("titleLabel")}>
        <Input
          id="case-title"
          name="title"
          required
          minLength={8}
          maxLength={160}
          defaultValue={existing?.title ?? ""}
          placeholder={t("titlePlaceholder")}
        />
      </Field>

      <Field id="case-description" label={t("descriptionLabel")}>
        <Textarea
          id="case-description"
          name="description"
          required
          minLength={40}
          maxLength={8000}
          rows={existing ? 5 : 8}
          defaultValue={existing?.description ?? ""}
          placeholder={t("descriptionPlaceholder")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="case-category" label={t("categoryLabel")}>
          <Select
            id="case-category"
            name="category_id"
            defaultValue={existing?.category_id ?? ""}
          >
            <option value="">{t("categoryNone")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {localizedCategoryName(category, locale)}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="case-city" label={t("cityLabel")}>
          <Input
            id="case-city"
            name="city"
            defaultValue={existing?.city ?? ""}
            placeholder={t("cityPlaceholder")}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={existing ? t("save") : t("submit")} />
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="h-12 px-2 font-mono text-sm tracking-wide text-espresso/60 hover:text-espresso"
          >
            {t("cancelEdit")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
