import { LawyerSchema, type Lawyer } from "@/schemas";

/**
 * LawMarket's REAL partner lawyers (owner-provided, 2026-08-11).
 *
 * Service assignments are provisional — the owner distributes them later.
 * GBA bar numbers are omitted until the real numbers arrive (the UI hides
 * the field). Case and review registers stay EMPTY on purpose: they fill
 * from live data as guaranteed services complete — nothing is fabricated
 * about real people.
 */
const raw = [
  {
    id: "tamta-bibiluridze",
    slug: "tamta-bibiluridze",
    name: { ka: "თამთა ბიბილურიძე", en: "Tamta Bibiluridze" },
    initials: { ka: "თბ", en: "TB" },
    specialty: { ka: "სახელშეკრულებო სამართალი", en: "Contract Law" },
    experience: {
      ka: "ხელშეკრულებების მომზადება, ანალიზი და იჯარის გაფორმება",
      en: "Contract drafting, review, and lease agreements",
    },
    practiceAreaIds: ["civil-law"],
    cases: [],
    reviews: [],
  },
  {
    id: "liza-gikashvili",
    slug: "liza-gikashvili",
    name: { ka: "ლიზა გიკაშვილი", en: "Liza Gikashvili" },
    initials: { ka: "ლგ", en: "LG" },
    specialty: { ka: "საოჯახო სამართალი", en: "Family Law" },
    experience: {
      ka: "განქორწინების, ალიმენტისა და მემკვიდრეობის საქმეები",
      en: "Divorce, child support, and inheritance matters",
    },
    practiceAreaIds: ["civil-law"],
    cases: [],
    reviews: [],
  },
  {
    id: "mariam-zakaidze",
    slug: "mariam-zakaidze",
    name: { ka: "მარიამ ზაკაიძე", en: "Mariam Zakaidze" },
    initials: { ka: "მზ", en: "MZ" },
    specialty: {
      ka: "კორპორატიული და შრომის სამართალი",
      en: "Corporate & Labor Law",
    },
    experience: {
      ka: "კომპანიების რეგისტრაცია და შრომითი დავები",
      en: "Company registrations and workplace disputes",
    },
    practiceAreaIds: ["corporate-law", "labor-law"],
    cases: [],
    reviews: [],
  },
  {
    id: "tia-lashkarishvili",
    slug: "tia-lashkarishvili",
    name: { ka: "თია ლაშქარიშვილი", en: "Tia Lashkarishvili" },
    initials: { ka: "თლ", en: "TL" },
    specialty: { ka: "სასამართლო დავები", en: "Litigation" },
    experience: {
      ka: "პრეტენზიები, სარჩელები და ზიანის ანაზღაურების საქმეები",
      en: "Demand letters, court claims, and damages cases",
    },
    practiceAreaIds: ["civil-law"],
    cases: [],
    reviews: [],
  },
  {
    id: "ketevan-shaoshvili",
    slug: "ketevan-shaoshvili",
    name: { ka: "ქეთევან შაოშვილი", en: "Ketevan Shaoshvili" },
    initials: { ka: "ქშ", en: "KS" },
    specialty: { ka: "სამოქალაქო სამართალი", en: "Civil Law" },
    experience: {
      ka: "კონსულტაციები, უძრავი ქონება და მინდობილობები",
      en: "Consultations, real estate, and powers of attorney",
    },
    practiceAreaIds: ["civil-law"],
    cases: [],
    reviews: [],
  },
] as const;

export const lawyers: Lawyer[] = raw.map((entry) => LawyerSchema.parse(entry));
