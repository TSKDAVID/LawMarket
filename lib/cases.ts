import { routing } from "@/i18n/routing";
import type { ClientCaseRow } from "@/lib/supabase/database.types";

export const CASE_EDIT_WINDOW_MS = 2 * 60 * 60 * 1000;

export function localeOf(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");
  return routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;
}

export function caseStillEditable(row: Pick<ClientCaseRow, "created_at" | "status">) {
  if (row.status !== "open") return false;
  return Date.now() < new Date(row.created_at).getTime() + CASE_EDIT_WINDOW_MS;
}

export function editDeadline(createdAt: string) {
  return new Date(new Date(createdAt).getTime() + CASE_EDIT_WINDOW_MS);
}

export function daysToMinutes(days: number) {
  return Math.round(days * 24 * 60);
}

export function minutesToDays(minutes: number | null) {
  if (!minutes || minutes <= 0) return null;
  return Math.max(1, Math.round(minutes / (24 * 60)));
}
