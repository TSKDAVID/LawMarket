import type { LawyerAvailability } from "./types";

/**
 * Mock lawyer availability.
 *
 * Swap the body of `getLawyerAvailability` for a real API request later.
 * Callers must depend only on the returned `{ lawyerId, availableDates }`
 * shape — never on how the dates are produced.
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
 * Returns mock availability for a lawyer over the next ~two weeks.
 * Days with no slots are omitted. Remaining days vary in density so the
 * calendar reads like a working diary, not a generated grid.
 */
export async function getLawyerAvailability(
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
