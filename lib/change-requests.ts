import type { Json } from "@/lib/supabase/database.types";
import type { Locale } from "@/i18n/routing";

export function asRecord(payload: Json): Record<string, Json | undefined> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }
  return payload as Record<string, Json | undefined>;
}

export function requestTitle(payload: Json, locale: Locale) {
  const rec = asRecord(payload);
  const ka = String(rec.title_ka ?? "");
  const en = String(rec.title_en ?? "");
  return locale === "ka" ? ka || en : en || ka;
}

export function payloadLines(payload: Json): { label: string; value: string }[] {
  const rec = asRecord(payload);
  const lines: { label: string; value: string }[] = [];
  for (const [key, value] of Object.entries(rec)) {
    if (value === null || value === undefined || value === "") continue;
    const text = Array.isArray(value) ? value.join(", ") : String(value);
    if (!text.trim()) continue;
    lines.push({ label: key, value: text });
  }
  return lines;
}
