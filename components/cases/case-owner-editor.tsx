"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CaseForm } from "@/components/cases/case-form";
import { closeClientCase } from "@/app/[locale]/cases/actions";
import type { Category } from "@/data/types";
import type { ClientCaseRow } from "@/lib/supabase/database.types";

export function CaseOwnerEditor({
  row,
  categories,
  canEdit,
  locale,
  editUntil,
  meta,
}: {
  row: ClientCaseRow;
  categories: Category[];
  canEdit: boolean;
  locale: string;
  editUntil: string;
  meta: string;
}) {
  const t = useTranslations("cases");
  const [editing, setEditing] = useState(false);

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-espresso/15 px-5 py-5 sm:px-7 sm:py-6">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-espresso/50">
            {meta}
          </p>
          <h1 className="mt-2 max-w-3xl font-heading text-2xl font-semibold leading-snug tracking-tight text-espresso sm:text-3xl">
            {row.title}
          </h1>
        </div>
        {canEdit && !editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-none border border-espresso bg-espresso px-3.5 font-mono text-xs tracking-wide text-cream hover:border-burgundy hover:bg-burgundy"
          >
            {t("editToggle")}
          </button>
        ) : null}
      </header>

      <div className="px-5 py-6 sm:px-7">
        {editing && canEdit ? (
          <div>
            <p className="mb-5 font-body text-sm text-espresso/60">
              {t("editWindow", { time: editUntil })}
            </p>
            <CaseForm
              categories={categories}
              existing={row}
              onCancel={() => setEditing(false)}
            />
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap font-body text-[15px] leading-relaxed text-espresso/80">
              {row.description}
            </p>
            {row.status === "open" ? (
              <form action={closeClientCase} className="mt-6">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={row.id} />
                <button
                  type="submit"
                  className="font-mono text-sm tracking-wide text-espresso/50 underline-offset-4 hover:text-espresso hover:underline"
                >
                  {t("closeCase")}
                </button>
              </form>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
