"use client";

import { useActionState, useState } from "react";
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
  removeApprovedSubmission,
  updateChangeRequest,
  updateOwnCase,
  updateOwnService,
  withdrawChangeRequest,
  type PortalState,
} from "@/app/[locale]/portal/actions";
import { payloadText, requestTitle } from "@/lib/change-requests";
import type { Category } from "@/data/types";
import type {
  ChangeRequestRow,
  LawyerCaseRow,
  ServicePricingMode,
  ServiceRow,
} from "@/lib/supabase/database.types";
import type { Locale } from "@/i18n/routing";

function LocaleFields() {
  const locale = useLocale();
  return <input type="hidden" name="locale" value={locale} />;
}

function pricingModeOf(value: string): ServicePricingMode {
  return value === "from" || value === "range" ? value : "fixed";
}

const chrome =
  "inline-flex h-11 min-h-11 w-full items-center justify-center border border-espresso/20 px-3 font-mono text-sm tracking-wide text-espresso transition-colors hover:border-burgundy hover:text-burgundy sm:w-auto sm:px-4";

type ChangeRequestManageCardProps = {
  request: ChangeRequestRow;
  categories: Category[];
  service?: ServiceRow | null;
  caseItem?: LawyerCaseRow | null;
};

export function ChangeRequestManageCard({
  request,
  categories,
  service,
  caseItem,
}: ChangeRequestManageCardProps) {
  const t = useTranslations("portal");
  const locale = useLocale() as Locale;
  const approved = request.status === "approved";
  const rejected = request.status === "rejected";
  const liveListing = approved && (service || caseItem);

  const [editing, setEditing] = useState(rejected && !liveListing);
  const prefix = request.id;
  const payload = request.payload;

  const [queueSaveState, queueSaveAction] = useActionState<PortalState, FormData>(
    updateChangeRequest,
    { error: null }
  );
  const [withdrawState, withdrawAction] = useActionState<PortalState, FormData>(
    withdrawChangeRequest,
    { error: null }
  );
  const [serviceSaveState, serviceSaveAction] = useActionState<PortalState, FormData>(
    updateOwnService,
    { error: null }
  );
  const [caseSaveState, caseSaveAction] = useActionState<PortalState, FormData>(
    updateOwnCase,
    { error: null }
  );
  const [removeState, removeAction] = useActionState<PortalState, FormData>(
    removeApprovedSubmission,
    { error: null }
  );

  const statusLabel = approved
    ? liveListing
      ? t("statusApprovedLive")
      : t("statusApprovedRemoved")
    : rejected
      ? t("statusRejected")
      : t("statusPending");

  const title = liveListing
    ? request.kind === "service" && service
      ? service.title_ka
      : caseItem
        ? caseItem.title_ka
        : requestTitle(payload, locale)
    : requestTitle(payload, locale);

  return (
    <li className="px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm tracking-wide text-brass">
            {request.kind === "service" ? t("kindService") : t("kindCase")}
            {" · "}
            {statusLabel}
          </p>
          <p className="mt-2 break-words font-heading font-semibold text-espresso">
            {title}
          </p>
          {request.review_note && !approved && (
            <p className="mt-2 font-body text-sm text-espresso/70">
              {t("reviewNoteLabel")}: {request.review_note}
            </p>
          )}
          {rejected && (
            <p className="mt-2 font-body text-sm text-burgundy">
              {t("deniedHint")}
            </p>
          )}
          {liveListing && (
            <p className="mt-2 font-body text-sm text-espresso/70">
              {t("approvedLiveHint")}
            </p>
          )}
          {approved && !liveListing && (
            <p className="mt-2 font-body text-sm text-espresso/70">
              {t("approvedRemovedHint")}
            </p>
          )}
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          {liveListing ? (
            <>
              <button
                type="button"
                className={chrome}
                onClick={() => setEditing((open) => !open)}
              >
                {editing ? t("closeEdit") : t("edit")}
              </button>
              {service && (
                <Link href={`/services/${service.slug}`} className={chrome}>
                  {t("publicProfile")}
                </Link>
              )}
              <form action={removeAction} className="col-span-2 sm:col-span-1">
                <LocaleFields />
                <input type="hidden" name="id" value={request.id} />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="h-11 w-full rounded-none sm:w-auto"
                  onClick={(event) => {
                    if (!window.confirm(t("removePublishedConfirm"))) {
                      event.preventDefault();
                    }
                  }}
                >
                  {t("removeFromSite")}
                </Button>
              </form>
            </>
          ) : approved ? (
            <form action={removeAction}>
              <LocaleFields />
              <input type="hidden" name="id" value={request.id} />
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="h-11 w-full rounded-none sm:w-auto"
              >
                {t("dismissHistory")}
              </Button>
            </form>
          ) : (
            <>
              <button
                type="button"
                className={chrome}
                onClick={() => setEditing((open) => !open)}
              >
                {editing ? t("closeEdit") : t("edit")}
              </button>
              <form action={withdrawAction}>
                <LocaleFields />
                <input type="hidden" name="id" value={request.id} />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="h-11 w-full rounded-none sm:w-auto"
                  onClick={(event) => {
                    if (!window.confirm(t("withdrawConfirm"))) {
                      event.preventDefault();
                    }
                  }}
                >
                  {t("withdrawRequest")}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      <FormMessage
        error={
          removeState.error
            ? t(removeState.error)
            : withdrawState.error
              ? t(withdrawState.error)
              : null
        }
        ok={removeState.ok || withdrawState.ok}
        okText={removeState.ok ? t("listingRemoved") : t("requestWithdrawn")}
      />

      {editing && liveListing && service && (
        <form
          action={serviceSaveAction}
          className="mt-5 space-y-5 border-t border-espresso/15 pt-5"
        >
          <LocaleFields />
          <input type="hidden" name="id" value={service.id} />
          <FormMessage
            error={serviceSaveState.error ? t(serviceSaveState.error) : null}
            ok={serviceSaveState.ok}
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
          <Button type="submit" size="sm" className="h-11 w-full rounded-none sm:w-auto">
            {t("saveListing")}
          </Button>
        </form>
      )}

      {editing && liveListing && caseItem && (
        <form
          action={caseSaveAction}
          className="mt-5 space-y-5 border-t border-espresso/15 pt-5"
        >
          <LocaleFields />
          <input type="hidden" name="id" value={caseItem.id} />
          <FormMessage
            error={caseSaveState.error ? t(caseSaveState.error) : null}
            ok={caseSaveState.ok}
            okText={t("listingSaved")}
          />
          <Field id={`${prefix}-title_ka`} label={t("caseTitleKa")}>
            <Input
              id={`${prefix}-title_ka`}
              name="title_ka"
              required
              defaultValue={caseItem.title_ka}
            />
          </Field>
          <Field id={`${prefix}-title_en`} label={t("caseTitleEn")}>
            <Input
              id={`${prefix}-title_en`}
              name="title_en"
              defaultValue={
                caseItem.title_en === caseItem.title_ka ? "" : caseItem.title_en
              }
            />
          </Field>
          <Field id={`${prefix}-description_ka`} label={t("caseDescKa")}>
            <Textarea
              id={`${prefix}-description_ka`}
              name="description_ka"
              rows={5}
              required
              defaultValue={caseItem.description_ka}
            />
          </Field>
          <Field id={`${prefix}-description_en`} label={t("caseDescEn")}>
            <Textarea
              id={`${prefix}-description_en`}
              name="description_en"
              rows={5}
              defaultValue={
                caseItem.description_en === caseItem.description_ka
                  ? ""
                  : caseItem.description_en
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
                defaultValue={caseItem.year ?? ""}
              />
            </Field>
            <Field id={`${prefix}-category_id`} label={t("categoryLabel")}>
              <Select
                id={`${prefix}-category_id`}
                name="category_id"
                defaultValue={caseItem.category_id ?? ""}
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
              defaultValue={caseItem.outcome_ka}
            />
          </Field>
          <Field id={`${prefix}-outcome_en`} label={t("outcomeEn")}>
            <Input
              id={`${prefix}-outcome_en`}
              name="outcome_en"
              defaultValue={
                caseItem.outcome_en === caseItem.outcome_ka
                  ? ""
                  : caseItem.outcome_en
              }
            />
          </Field>
          <Button type="submit" size="sm" className="h-11 w-full rounded-none sm:w-auto">
            {t("saveListing")}
          </Button>
        </form>
      )}

      {editing && !liveListing && !approved && (
        <form
          action={queueSaveAction}
          className="mt-5 space-y-5 border-t border-espresso/15 pt-5"
        >
          <LocaleFields />
          <input type="hidden" name="id" value={request.id} />
          <FormMessage
            error={queueSaveState.error ? t(queueSaveState.error) : null}
            ok={queueSaveState.ok}
            okText={t("requestUpdated")}
          />
          {request.kind === "service" ? (
            <>
              <Field id={`${prefix}-title_ka`} label={t("serviceTitleKa")}>
                <Input
                  id={`${prefix}-title_ka`}
                  name="title_ka"
                  required
                  defaultValue={payloadText(payload, "title_ka")}
                />
              </Field>
              <Field id={`${prefix}-title_en`} label={t("serviceTitleEn")}>
                <Input
                  id={`${prefix}-title_en`}
                  name="title_en"
                  defaultValue={
                    payloadText(payload, "title_en") ===
                    payloadText(payload, "title_ka")
                      ? ""
                      : payloadText(payload, "title_en")
                  }
                />
              </Field>
              <Field id={`${prefix}-description_ka`} label={t("serviceDescKa")}>
                <Textarea
                  id={`${prefix}-description_ka`}
                  name="description_ka"
                  rows={5}
                  required
                  defaultValue={payloadText(payload, "description_ka")}
                />
              </Field>
              <Field id={`${prefix}-description_en`} label={t("serviceDescEn")}>
                <Textarea
                  id={`${prefix}-description_en`}
                  name="description_en"
                  rows={5}
                  defaultValue={
                    payloadText(payload, "description_en") ===
                    payloadText(payload, "description_ka")
                      ? ""
                      : payloadText(payload, "description_en")
                  }
                />
              </Field>
              <Field id={`${prefix}-category_id`} label={t("categoryLabel")}>
                <Select
                  id={`${prefix}-category_id`}
                  name="category_id"
                  required
                  defaultValue={payloadText(payload, "category_id")}
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
                defaultMode={pricingModeOf(payloadText(payload, "pricing_mode"))}
                defaultPrice={payloadText(payload, "price")}
                defaultPriceMax={payloadText(payload, "price_max")}
              />
              <Field id={`${prefix}-duration`} label={t("durationLabel")}>
                <Input
                  id={`${prefix}-duration`}
                  name="duration"
                  type="number"
                  min={0}
                  defaultValue={payloadText(payload, "duration_minutes")}
                />
              </Field>
              <Field id={`${prefix}-includes_ka`} label={t("includesKa")}>
                <Textarea
                  id={`${prefix}-includes_ka`}
                  name="includes_ka"
                  rows={4}
                  defaultValue={payloadText(payload, "includes_ka")}
                />
              </Field>
              <Field id={`${prefix}-includes_en`} label={t("includesEn")}>
                <Textarea
                  id={`${prefix}-includes_en`}
                  name="includes_en"
                  rows={4}
                  defaultValue={
                    payloadText(payload, "includes_en") ===
                    payloadText(payload, "includes_ka")
                      ? ""
                      : payloadText(payload, "includes_en")
                  }
                />
              </Field>
            </>
          ) : (
            <>
              <Field id={`${prefix}-title_ka`} label={t("caseTitleKa")}>
                <Input
                  id={`${prefix}-title_ka`}
                  name="title_ka"
                  required
                  defaultValue={payloadText(payload, "title_ka")}
                />
              </Field>
              <Field id={`${prefix}-title_en`} label={t("caseTitleEn")}>
                <Input
                  id={`${prefix}-title_en`}
                  name="title_en"
                  defaultValue={
                    payloadText(payload, "title_en") ===
                    payloadText(payload, "title_ka")
                      ? ""
                      : payloadText(payload, "title_en")
                  }
                />
              </Field>
              <Field id={`${prefix}-description_ka`} label={t("caseDescKa")}>
                <Textarea
                  id={`${prefix}-description_ka`}
                  name="description_ka"
                  rows={5}
                  required
                  defaultValue={payloadText(payload, "description_ka")}
                />
              </Field>
              <Field id={`${prefix}-description_en`} label={t("caseDescEn")}>
                <Textarea
                  id={`${prefix}-description_en`}
                  name="description_en"
                  rows={5}
                  defaultValue={
                    payloadText(payload, "description_en") ===
                    payloadText(payload, "description_ka")
                      ? ""
                      : payloadText(payload, "description_en")
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
                    defaultValue={payloadText(payload, "year")}
                  />
                </Field>
                <Field id={`${prefix}-category_id`} label={t("categoryLabel")}>
                  <Select
                    id={`${prefix}-category_id`}
                    name="category_id"
                    defaultValue={payloadText(payload, "category_id")}
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
                  defaultValue={payloadText(payload, "outcome_ka")}
                />
              </Field>
              <Field id={`${prefix}-outcome_en`} label={t("outcomeEn")}>
                <Input
                  id={`${prefix}-outcome_en`}
                  name="outcome_en"
                  defaultValue={
                    payloadText(payload, "outcome_en") ===
                    payloadText(payload, "outcome_ka")
                      ? ""
                      : payloadText(payload, "outcome_en")
                  }
                />
              </Field>
            </>
          )}
          <Button type="submit" size="sm" className="h-11 w-full rounded-none sm:w-auto">
            {rejected ? t("resubmitForReview") : t("saveRequest")}
          </Button>
        </form>
      )}
    </li>
  );
}
