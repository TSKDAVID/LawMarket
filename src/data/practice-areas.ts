import { PracticeAreaSchema, type PracticeArea } from "@/schemas";

/**
 * Practice areas verbatim from content.md. Parsed at module load —
 * invalid data fails the build, not production.
 */
const raw = [
  {
    id: "civil-law",
    slug: "civil-law",
    name: { ka: "სამოქალაქო სამართალი", en: "Civil Law" },
    order: 1,
  },
  {
    id: "labor-law",
    slug: "labor-law",
    name: { ka: "შრომის სამართალი", en: "Labor Law" },
    order: 2,
  },
  {
    id: "corporate-law",
    slug: "corporate-law",
    name: { ka: "კორპორატიული სამართალი", en: "Corporate Law" },
    order: 3,
  },
] as const;

export const practiceAreas: PracticeArea[] = raw.map((entry) =>
  PracticeAreaSchema.parse(entry),
);
