import { createBrowserClient } from "@supabase/ssr";
import type { LawyerAvailability } from "./types";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Lawyer availability, read from Supabase by the booking modal.
 *
 * Availability is public data, so this uses the anon key directly and is safe
 * to call from the browser. Callers depend only on the returned
 * `{ lawyerId, availableDates }` shape — never on where the dates came from.
 */

const HORIZON_DAYS = 14;

const SLOT_SETS = [
  ["10:00", "10:30", "14:00", "14:30", "16:00"],
  ["09:00", "11:00", "15:30"],
  ["09:30", "13:00", "16:00", "16:30"],
  ["10:00", "12:00"],
  ["11:00", "11:30", "14:00", "15:00", "17:00"],
  ["09:00", "09:30", "13:30", "15:30"],
  ["14:00", "14:30", "16:30"],
];

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSlotInPast(isoDate: string, slot: string, now: Date): boolean {
  const [h, min] = slot.split(":").map(Number);
  const day = parseISODate(isoDate);
  day.setHours(h ?? 0, min ?? 0, 0, 0);
  return day.getTime() <= now.getTime();
}

/**
 * Real availability for a lawyer, from `lawyer_availability`.
 *
 * Until a lawyer has any future dates entered in the admin panel, this falls
 * back to the generated diary below so the booking flow stays demonstrable.
 * Delete `generateDemoAvailability` once real schedules are being maintained.
 */
export async function getLawyerAvailability(
  lawyerId: string
): Promise<LawyerAvailability> {
  const { url, key } = getSupabasePublicEnv();

  if (url && key) {
    const supabase = createBrowserClient(url, key);
    const today = toISODate(startOfDay(new Date()));
    const { data } = await supabase
      .from("lawyer_availability")
      .select("date, slots")
      .eq("lawyer_id", lawyerId)
      .gte("date", today)
      .order("date");

    if (data && data.length > 0) {
      const now = new Date();
      const availableDates = data
        .map((row) => ({
          date: row.date,
          slots: (row.slots ?? []).filter(
            (slot: string) => !isSlotInPast(row.date, slot, now)
          ),
        }))
        .filter((entry) => entry.slots.length > 0);

      if (availableDates.length > 0) return { lawyerId, availableDates };
    }
  }

  return generateDemoAvailability(lawyerId);
}

async function generateDemoAvailability(
  lawyerId: string
): Promise<LawyerAvailability> {
  const now = new Date();
  const today = startOfDay(now);
  const rand = mulberry32(hashId(lawyerId));
  const availableDates: LawyerAvailability["availableDates"] = [];

  for (let offset = 0; offset < HORIZON_DAYS; offset++) {
    const day = new Date(today);
    day.setDate(today.getDate() + offset);
    const weekday = day.getDay();
    const iso = toISODate(day);

    const emptyRoll = rand();
    const isSunday = weekday === 0;
    const isSaturday = weekday === 6;
    const skip =
      isSunday ||
      (isSaturday && emptyRoll < 0.55) ||
      (!isSaturday && emptyRoll < 0.28);

    if (skip) continue;

    const set = SLOT_SETS[Math.floor(rand() * SLOT_SETS.length)] ?? SLOT_SETS[0];
    const slots = set.filter((slot) => !isSlotInPast(iso, slot, now));
    if (slots.length === 0) continue;

    availableDates.push({ date: iso, slots });
  }

  if (availableDates.length < 4) {
    for (let offset = 1; offset < HORIZON_DAYS && availableDates.length < 4; offset++) {
      const day = new Date(today);
      day.setDate(today.getDate() + offset);
      const iso = toISODate(day);
      if (availableDates.some((entry) => entry.date === iso)) continue;
      const set = SLOT_SETS[offset % SLOT_SETS.length] ?? SLOT_SETS[0];
      const slots = set.filter((slot) => !isSlotInPast(iso, slot, now));
      if (slots.length > 0) availableDates.push({ date: iso, slots });
    }
    availableDates.sort((a, b) => a.date.localeCompare(b.date));
  }

  return { lawyerId, availableDates };
}
