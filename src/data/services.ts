import { ServiceSchema, type Service } from "@/schemas";

/**
 * All 15 services VERBATIM from content.md (names, descriptions, prices are
 * approved placeholders — the owner edits this file before launch).
 *
 * Lawyer assignments are a provisional distribution across the real partner
 * lawyers (owner adjusts freely): contracts → Tamta Bibiluridze, family →
 * Liza Gikashvili, corporate/labor → Mariam Zakaidze, litigation → Tia
 * Lashkarishvili, consultations/property/PoA → Ketevan Shaoshvili.
 *
 * Parsed through the zod schema at module load — bad data fails the build.
 */
const raw = [
  // სამოქალაქო სამართალი / CIVIL LAW
  {
    id: "svc-01",
    slug: "legal-consultation",
    number: 1,
    practiceAreaId: "civil-law",
    name: { ka: "იურიდიული კონსულტაცია", en: "Legal Consultation" },
    description: {
      ka: "ერთსაათიანი კონსულტაცია იურისტთან თქვენს საკითხზე",
      en: "A one-hour consultation with a lawyer on your matter",
    },
    priceGel: 80,
    lawyerIds: ["ketevan-shaoshvili"],
    featured: true,
  },
  {
    id: "svc-02",
    slug: "contract-drafting",
    number: 2,
    practiceAreaId: "civil-law",
    name: { ka: "ხელშეკრულების მომზადება", en: "Contract Drafting" },
    description: {
      ka: "ინდივიდუალურად შედგენილი ხელშეკრულება თქვენი გარიგებისთვის",
      en: "A contract drafted individually for your transaction",
    },
    priceGel: 150,
    lawyerIds: ["tamta-bibiluridze"],
    featured: true,
  },
  {
    id: "svc-03",
    slug: "contract-review",
    number: 3,
    practiceAreaId: "civil-law",
    name: { ka: "ხელშეკრულების ანალიზი", en: "Contract Review" },
    description: {
      ka: "არსებული ხელშეკრულების სამართლებრივი შეფასება რისკების მითითებით",
      en: "Legal assessment of an existing contract with identified risks",
    },
    priceGel: 100,
    lawyerIds: ["tamta-bibiluridze"],
  },
  {
    id: "svc-04",
    slug: "demand-letter",
    number: 4,
    practiceAreaId: "civil-law",
    name: { ka: "სამართლებრივი პრეტენზია", en: "Legal Demand Letter" },
    description: {
      ka: "ოფიციალური პრეტენზიის მომზადება და გაგზავნა",
      en: "Preparation and dispatch of a formal demand letter",
    },
    priceGel: 90,
    lawyerIds: ["tia-lashkarishvili"],
  },
  {
    id: "svc-05",
    slug: "court-claim-preparation",
    number: 5,
    practiceAreaId: "civil-law",
    name: { ka: "სარჩელის მომზადება", en: "Court Claim Preparation" },
    description: {
      ka: "სარჩელისა და თანდართული დოკუმენტების მომზადება სასამართლოსთვის",
      en: "Preparation of a claim and supporting documents for court",
    },
    priceGel: 250,
    lawyerIds: ["tia-lashkarishvili"],
  },
  {
    id: "svc-06",
    slug: "divorce-proceedings",
    number: 6,
    practiceAreaId: "civil-law",
    name: { ka: "განქორწინების წარმოება", en: "Divorce Proceedings" },
    description: {
      ka: "განქორწინების საქმის სრული სამართლებრივი წარმოება",
      en: "Full legal handling of a divorce case",
    },
    priceGel: 400,
    lawyerIds: ["liza-gikashvili"],
    featured: true,
  },
  {
    id: "svc-07",
    slug: "child-support-claim",
    number: 7,
    practiceAreaId: "civil-law",
    name: { ka: "ალიმენტის დაკისრება", en: "Child Support Claim" },
    description: {
      ka: "ალიმენტის მოთხოვნის საქმის წარმოება",
      en: "Handling of a child support claim",
    },
    priceGel: 300,
    lawyerIds: ["liza-gikashvili"],
  },
  {
    id: "svc-08",
    slug: "inheritance-registration",
    number: 8,
    practiceAreaId: "civil-law",
    name: { ka: "მემკვიდრეობის გაფორმება", en: "Inheritance Registration" },
    description: {
      ka: "სამკვიდრო მოწმობის მიღება და ქონების გადაფორმება",
      en: "Obtaining the certificate of inheritance and re-registering assets",
    },
    priceGel: 200,
    lawyerIds: ["liza-gikashvili"],
    featured: true,
  },
  {
    id: "svc-09",
    slug: "real-estate-purchase-agreement",
    number: 9,
    practiceAreaId: "civil-law",
    name: { ka: "უძრავი ქონების ნასყიდობა", en: "Real Estate Purchase Agreement" },
    description: {
      ka: "ნასყიდობის ხელშეკრულების მომზადება და რეგისტრაციის თანხლება",
      en: "Purchase agreement drafting and registration support",
    },
    priceGel: 180,
    lawyerIds: ["ketevan-shaoshvili"],
  },
  {
    id: "svc-10",
    slug: "lease-agreement",
    number: 10,
    practiceAreaId: "civil-law",
    name: { ka: "იჯარის ხელშეკრულება", en: "Lease Agreement" },
    description: {
      ka: "საცხოვრებელი ან კომერციული ფართის იჯარის ხელშეკრულება",
      en: "Lease agreement for residential or commercial property",
    },
    priceGel: 120,
    lawyerIds: ["tamta-bibiluridze"],
  },
  {
    id: "svc-11",
    slug: "damages-claim",
    number: 11,
    practiceAreaId: "civil-law",
    name: { ka: "ზიანის ანაზღაურება", en: "Damages Claim" },
    description: {
      ka: "მიყენებული ზიანის ანაზღაურების მოთხოვნის წარმოება",
      en: "Pursuing compensation for damages suffered",
    },
    priceGel: 350,
    lawyerIds: ["tia-lashkarishvili"],
  },
  {
    id: "svc-12",
    slug: "power-of-attorney",
    number: 12,
    practiceAreaId: "civil-law",
    name: { ka: "მინდობილობის მომზადება", en: "Power of Attorney" },
    description: {
      ka: "მინდობილობის ტექსტის მომზადება ნოტარიუსთან დასამოწმებლად",
      en: "Power of attorney text prepared for notarization",
    },
    priceGel: 60,
    lawyerIds: ["ketevan-shaoshvili"],
  },
  // შრომის სამართალი / LABOR LAW
  {
    id: "svc-13",
    slug: "labor-dispute-consultation",
    number: 13,
    practiceAreaId: "labor-law",
    name: { ka: "შრომითი დავის კონსულტაცია", en: "Labor Dispute Consultation" },
    description: {
      ka: "კონსულტაცია სამსახურიდან გათავისუფლების ან შრომითი დავის საკითხზე",
      en: "Consultation on dismissal or a workplace dispute",
    },
    priceGel: 120,
    lawyerIds: ["mariam-zakaidze"],
    featured: true,
  },
  // კორპორატიული სამართალი / CORPORATE LAW
  {
    id: "svc-14",
    slug: "llc-registration",
    number: 14,
    practiceAreaId: "corporate-law",
    name: { ka: "შპს რეგისტრაცია", en: "LLC Registration" },
    description: {
      ka: "შპს-ის სრული რეგისტრაცია საჯარო რეესტრში",
      en: "Full registration of an LLC with the Public Registry",
    },
    priceGel: 250,
    lawyerIds: ["mariam-zakaidze"],
    featured: true,
  },
  {
    id: "svc-15",
    slug: "sole-proprietor-registration",
    number: 15,
    practiceAreaId: "corporate-law",
    name: { ka: "ინდ. მეწარმის რეგისტრაცია", en: "Sole Proprietor Registration" },
    description: {
      ka: "ინდივიდუალური მეწარმის რეგისტრაცია და საწყისი კონსულტაცია",
      en: "Individual entrepreneur registration with initial guidance",
    },
    priceGel: 100,
    lawyerIds: ["mariam-zakaidze"],
  },
] as const;

export const services: Service[] = raw.map((entry) => ServiceSchema.parse(entry));
