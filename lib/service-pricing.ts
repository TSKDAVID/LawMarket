import type { ServicePricingMode } from "@/lib/supabase/database.types";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export type { ServicePricingMode };

export type PricedService = {
  price: number;
  priceMax?: number | null;
  pricingMode?: ServicePricingMode | null;
};

export function servicePricingMode(
  service: PricedService
): ServicePricingMode {
  const mode = service.pricingMode;
  if (mode === "from" || mode === "range") return mode;
  return "fixed";
}

export function formatServicePrice(
  service: PricedService,
  locale: Locale = "en"
) {
  const mode = servicePricingMode(service);
  const min = formatPrice(service.price);
  if (mode === "from") {
    return locale === "ka" ? `${min}-დან` : `from ${min}`;
  }
  if (mode === "range" && service.priceMax != null) {
    return `${min}–${formatPrice(service.priceMax)}`;
  }
  return min;
}

export function parseServicePricing(formData: FormData): {
  pricing_mode: ServicePricingMode;
  price: number;
  price_max: number | null;
} | null {
  const raw = String(formData.get("pricing_mode") ?? "fixed");
  const pricing_mode: ServicePricingMode =
    raw === "from" || raw === "range" ? raw : "fixed";
  const price = Number(formData.get("price") ?? "");
  if (!Number.isFinite(price) || price < 0) return null;

  if (pricing_mode !== "range") {
    return { pricing_mode, price, price_max: null };
  }

  const price_max = Number(formData.get("price_max") ?? "");
  if (!Number.isFinite(price_max) || price_max < price) return null;
  return { pricing_mode, price, price_max };
}
