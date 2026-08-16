"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Field } from "@/components/workspace/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ServicePricingMode } from "@/lib/service-pricing";

export function PricingFields({
  idPrefix = "",
  defaultMode = "fixed",
  defaultPrice,
  defaultPriceMax,
}: {
  idPrefix?: string;
  defaultMode?: ServicePricingMode;
  defaultPrice?: number | string;
  defaultPriceMax?: number | string | null;
}) {
  const t = useTranslations("portal");
  const [mode, setMode] = useState<ServicePricingMode>(defaultMode);
  const priceId = `${idPrefix}price`;
  const maxId = `${idPrefix}price_max`;
  const modeId = `${idPrefix}pricing_mode`;

  return (
    <div className="space-y-5">
      <Field id={modeId} label={t("pricingModeLabel")}>
        <Select
          id={modeId}
          name="pricing_mode"
          value={mode}
          onChange={(event) =>
            setMode(event.target.value as ServicePricingMode)
          }
        >
          <option value="fixed">{t("pricingFixed")}</option>
          <option value="from">{t("pricingFrom")}</option>
          <option value="range">{t("pricingRange")}</option>
        </Select>
      </Field>
      <p className="font-body text-xs leading-relaxed text-espresso/55">
        {t("pricingHint")}
      </p>
      <div className={mode === "range" ? "grid grid-cols-1 gap-5 sm:grid-cols-2" : ""}>
        <Field
          id={priceId}
          label={mode === "fixed" ? t("priceLabel") : t("priceMinLabel")}
        >
          <Input
            id={priceId}
            name="price"
            type="number"
            min={0}
            step="1"
            required
            defaultValue={defaultPrice ?? ""}
          />
        </Field>
        {mode === "range" ? (
          <Field id={maxId} label={t("priceMaxLabel")}>
            <Input
              id={maxId}
              name="price_max"
              type="number"
              min={0}
              step="1"
              required
              defaultValue={defaultPriceMax ?? ""}
            />
          </Field>
        ) : null}
      </div>
    </div>
  );
}
