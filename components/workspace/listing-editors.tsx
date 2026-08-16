"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/workspace/field";
import { PricingFields } from "@/components/workspace/pricing-fields";
import { FormMessage } from "@/components/workspace/workspace-shell";
import {
  deleteOwnCase,
  deleteOwnService,
  updateOwnCase,
  updateOwnService,
  type PortalState,
} from "@/app/[locale]/portal/actions";
import type { Category } from "@/data/types";
import type { LawyerCaseRow, ServiceRow } from "@/lib/supabase/database.types";
import { localizedCaseTitle, localizedServiceTitle } from "@/data/localize";
import { formatServicePrice } from "@/lib/service-pricing";
import type { Locale } from "@/i18n/routing";

function LocaleFields() {
  const locale = useLocale();
  return <input type="hidden" name="locale" value={locale} />;
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} className="h-11 w-full rounded-none sm:w-auto">
      {label}
    </Button>
  );
}

function DeleteButton({ label, confirm }: { label: string; confirm: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      variant="outline"
      disabled={pending}
      className="h-11 w-full rounded-none sm:w-auto"
      onClick={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
    >
      {label}
    </Button>
  );
}

const chrome =
  "inline-flex h-11 min-h-11 w-full items-center justify-center border border-espresso/20 px-3 font-mono text-sm tracking-wide text-espresso transition-colors hover:border-burgundy hover:text-burgundy sm:w-auto sm:px-4";

export function ServiceManageCard({
  service,
  categories,
}: {
  service: ServiceRow;
  categories: Category[];
}) {
  const t = useTranslations("portal");
  const locale = useLocale() as Locale;
  const [editing, setEditing] = useState(false);
  const [saveState, saveAction] = useActionState<PortalState, FormData>(
    updateOwnService,
    { error: null }
  );
  const [deleteState, deleteAction] = useActionState<PortalState, FormData>(
    deleteOwnService,
    { error: null }
  );
  const prefix = service.id;

  return (
    <li className="px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words font-heading font-semibold text-espresso">
            {localizedServiceTitle(
              {
                id: service.id,
                slug: service.slug,
                categoryId: service.category_id,
                lawyerId: service.lawyer_id,
                title_en: service.title_en,
                title_ka: service.title_ka,
                description_en: service.description_en,
                description_ka: service.description_ka,
                price: Number(service.price),
                currency: "GEL",
                durationMinutes: service.duration_minutes,
              },
              locale
            )}
          </p>
          <p className="mt-1 font-body text-xs text-espresso/65">
            {formatServicePrice(
              {
                price: Number(service.price),
                priceMax: service.price_max,
                pricingMode: service.pricing_mode,
              },
              locale
            )}
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <button
            type="button"
            className={chrome}
            onClick={() => setEditing((open) => !open)}
          >
            {editing ? t("closeEdit") : t("edit")}
          </button>
          <Link href={`/services/${service.slug}`} className={chrome}>
            {t("publicProfile")}
          </Link>
          <form action={deleteAction} className="col-span-2 sm:col-span-1">
            <LocaleFields />
            <input type="hidden" name="id" value={service.id} />
            <DeleteButton
              label={t("deleteListing")}
              confirm={t("deleteServiceConfirm")}
            />
          </form>
        </div>
      </div>
      <FormMessage
        error={deleteState.error ? t(deleteState.error) : null}
        ok={deleteState.ok}
        okText={t("listingDeleted")}
      />
      {editing && (
        <form action={saveAction} className="mt-5 space-y-5 border-t border-espresso/15 pt-5">
          <LocaleFields />
          <input type="hidden" name="id" value={service.id} />
          <FormMessage
            error={saveState.error ? t(saveState.error) : null}
            ok={saveState.ok}
            okText={t("listingSaved")}
          />
          <Field id={`${prefix}-title_ka`} label={t("serviceTitleKa")}>
            <Input
              id={`${prefix}-title_ka`}
              name="title_ka"
              required
              defaultValue={service.title_ka}
            />
          </Field>
          <Field id={`${prefix}-title_en`} label={t("serviceTitleEn")}>
            <Input
              id={`${prefix}-title_en`}
              name="title_en"
              defaultValue={
                service.title_en === service.title_ka ? "" : service.title_en
              }
            />
          </Field>
          <Field id={`${prefix}-description_ka`} label={t("serviceDescKa")}>
            <Textarea
              id={`${prefix}-description_ka`}
              name="description_ka"
              rows={5}
              required
              defaultValue={service.description_ka}
            />
          </Field>
          <Field id={`${prefix}-description_en`} label={t("serviceDescEn")}>
            <Textarea
              id={`${prefix}-description_en`}
              name="description_en"
              rows={5}
              defaultValue={
                service.description_en === service.description_ka
                  ? ""
                  : service.description_en
              }
            />
          </Field>
          <Field id={`${prefix}-category_id`} label={t("categoryLabel")}>
            <Select
              id={`${prefix}-category_id`}
              name="category_id"
              required
              defaultValue={service.category_id}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_ka}
                </option>
              ))}
            </Select>
          </Field>
          <PricingFields
            idPrefix={`${prefix}-`}
            defaultMode={service.pricing_mode}
            defaultPrice={Number(service.price)}
            defaultPriceMax={
              service.price_max == null ? "" : Number(service.price_max)
            }
          />
          <Field id={`${prefix}-duration`} label={t("durationLabel")}>
            <Input
              id={`${prefix}-duration`}
              name="duration"
              type="number"
              min={0}
              defaultValue={service.duration_minutes ?? ""}
            />
          </Field>
          <Field id={`${prefix}-includes_ka`} label={t("includesKa")}>
            <Textarea
              id={`${prefix}-includes_ka`}
              name="includes_ka"
              rows={4}
              defaultValue={(service.includes_ka ?? []).join("\n")}
            />
          </Field>
          <Field id={`${prefix}-includes_en`} label={t("includesEn")}>
            <Textarea
              id={`${prefix}-includes_en`}
              name="includes_en"
              rows={4}
              defaultValue={
                (service.includes_en ?? []).join("\n") ===
                (service.includes_ka ?? []).join("\n")
                  ? ""
                  : (service.includes_en ?? []).join("\n")
              }
            />
          </Field>
          <SaveButton label={t("saveListing")} />
        </form>
      )}
    </li>
  );
}

export function CaseManageCard({
  item,
  categories,
}: {
  item: LawyerCaseRow;
  categories: Category[];
}) {
  const t = useTranslations("portal");
  const locale = useLocale() as Locale;
  const [editing, setEditing] = useState(false);
  const [saveState, saveAction] = useActionState<PortalState, FormData>(
    updateOwnCase,
    { error: null }
  );
  const [deleteState, deleteAction] = useActionState<PortalState, FormData>(
    deleteOwnCase,
    { error: null }
  );
  const prefix = item.id;

  return (
    <li className="px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words font-heading font-semibold text-espresso">
            {localizedCaseTitle(
              {
                id: item.id,
                lawyerId: item.lawyer_id,
                categoryId: item.category_id ?? undefined,
                title_en: item.title_en,
                title_ka: item.title_ka,
                description_en: item.description_en,
                description_ka: item.description_ka,
                year: item.year,
                outcome_en: item.outcome_en,
                outcome_ka: item.outcome_ka,
              },
              locale
            )}
          </p>
          {item.year && (
            <p className="mt-1 font-body text-xs text-espresso/65">{item.year}</p>
          )}
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <button
            type="button"
            className={chrome}
            onClick={() => setEditing((open) => !open)}
          >
            {editing ? t("closeEdit") : t("edit")}
          </button>
          <form action={deleteAction}>
            <LocaleFields />
            <input type="hidden" name="id" value={item.id} />
            <DeleteButton
              label={t("deleteListing")}
              confirm={t("deleteCaseConfirm")}
            />
          </form>
        </div>
      </div>
      <FormMessage
        error={deleteState.error ? t(deleteState.error) : null}
        ok={deleteState.ok}
        okText={t("listingDeleted")}
      />
      {editing && (
        <form action={saveAction} className="mt-5 space-y-5 border-t border-espresso/15 pt-5">
          <LocaleFields />
          <input type="hidden" name="id" value={item.id} />
          <FormMessage
            error={saveState.error ? t(saveState.error) : null}
            ok={saveState.ok}
            okText={t("listingSaved")}
          />
          <Field id={`${prefix}-title_ka`} label={t("caseTitleKa")}>
            <Input
              id={`${prefix}-title_ka`}
              name="title_ka"
              required
              defaultValue={item.title_ka}
            />
          </Field>
          <Field id={`${prefix}-title_en`} label={t("caseTitleEn")}>
            <Input
              id={`${prefix}-title_en`}
              name="title_en"
              defaultValue={item.title_en === item.title_ka ? "" : item.title_en}
            />
          </Field>
          <Field id={`${prefix}-description_ka`} label={t("caseDescKa")}>
            <Textarea
              id={`${prefix}-description_ka`}
              name="description_ka"
              rows={5}
              required
              defaultValue={item.description_ka}
            />
          </Field>
          <Field id={`${prefix}-description_en`} label={t("caseDescEn")}>
            <Textarea
              id={`${prefix}-description_en`}
              name="description_en"
              rows={5}
              defaultValue={
                item.description_en === item.description_ka
                  ? ""
                  : item.description_en
              }
            />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id={`${prefix}-year`} label={t("yearLabel")}>
              <Input
                id={`${prefix}-year`}
                name="year"
                type="number"
                min={1990}
                max={2100}
                defaultValue={item.year ?? ""}
              />
            </Field>
            <Field id={`${prefix}-category_id`} label={t("categoryLabel")}>
              <Select
                id={`${prefix}-category_id`}
                name="category_id"
                defaultValue={item.category_id ?? ""}
              >
                <option value="">—</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_ka}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field id={`${prefix}-outcome_ka`} label={t("outcomeKa")}>
            <Input
              id={`${prefix}-outcome_ka`}
              name="outcome_ka"
              defaultValue={item.outcome_ka}
            />
          </Field>
          <Field id={`${prefix}-outcome_en`} label={t("outcomeEn")}>
            <Input
              id={`${prefix}-outcome_en`}
              name="outcome_en"
              defaultValue={
                item.outcome_en === item.outcome_ka ? "" : item.outcome_en
              }
            />
          </Field>
          <SaveButton label={t("saveListing")} />
        </form>
      )}
    </li>
  );
}
