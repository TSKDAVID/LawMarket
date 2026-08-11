import { z } from "zod";

/** The two site locales. Georgian is the primary language. */
export const LocaleSchema = z.enum(["ka", "en"]);
export type Locale = z.infer<typeof LocaleSchema>;

/** Every content entity carries both locales in its data fields (ENGINEERING.md §5). */
export const LocalizedTextSchema = z.object({
  ka: z.string().min(1),
  en: z.string().min(1),
});
export type LocalizedText = z.infer<typeof LocalizedTextSchema>;

export const PracticeAreaSchema = z.object({
  /** Stable explicit id — becomes a database key later. */
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: LocalizedTextSchema,
  /** Order of appearance in the ledger. */
  order: z.number().int().positive(),
});
export type PracticeArea = z.infer<typeof PracticeAreaSchema>;

export const ServiceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Clause number in the § index, e.g. 1 renders as "§ 01". */
  number: z.number().int().min(1).max(99),
  practiceAreaId: z.string().min(1),
  name: LocalizedTextSchema,
  description: LocalizedTextSchema,
  /** Fixed price in GEL — transparent pricing IS the product. */
  priceGel: z.number().int().positive(),
  /** Lawyers assigned to perform this service. */
  lawyerIds: z.array(z.string().min(1)).min(1),
});
export type Service = z.infer<typeof ServiceSchema>;

export const CaseEntrySchema = z.object({
  id: z.string().min(1),
  /** Document-style case code, mono, e.g. "LM-2026-00019". */
  code: z.string().regex(/^LM-\d{4}-\d{5}$/),
  serviceId: z.string().min(1),
  /** ISO date the case completed. */
  completedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** True while the register is seeded with placeholder entries. */
  placeholder: z.boolean(),
});
export type CaseEntry = z.infer<typeof CaseEntrySchema>;

/**
 * Review shape for the profile register. Per content.md the data set stays
 * EMPTY until real reviews exist — the schema only prepares the layout.
 */
export const ReviewSchema = z.object({
  id: z.string().min(1),
  lawyerId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  quote: LocalizedTextSchema,
  clientName: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Review = z.infer<typeof ReviewSchema>;

export const LawyerSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: LocalizedTextSchema,
  /** Monogram initials for the engraved device, per script. */
  initials: LocalizedTextSchema,
  /** Georgian Bar Association number — omitted until the real number arrives. */
  barNumber: z.string().min(1).optional(),
  /** Specialisation shown in the register (e.g. "საოჯახო სამართალი"). */
  specialty: LocalizedTextSchema,
  /** Practice line — the lawyer's scope of services on the register. */
  experience: LocalizedTextSchema,
  practiceAreaIds: z.array(z.string().min(1)).min(1),
  cases: z.array(CaseEntrySchema),
  reviews: z.array(ReviewSchema),
});
export type Lawyer = z.infer<typeof LawyerSchema>;

/* ----------------------------- Orders ----------------------------- */

/** Fulfilment status (ENGINEERING.md §2). Payment state is tracked separately. */
export const OrderStatusSchema = z.enum([
  "received",
  "in_progress",
  "completed",
  "refunded",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const PaymentStatusSchema = z.enum([
  "pending",
  "paid",
  "declined",
  "cancelled",
  "failed",
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

/**
 * Georgian phone, mobile format. Accepts "+995 5XX XX XX XX", "5XXXXXXXX",
 * spaces/dashes tolerated. Normalise before storing.
 */
export const georgianPhonePattern = /^(\+?995[\s-]?)?5\d{2}([\s-]?\d{2}){3}$/;

export const CustomerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(georgianPhonePattern),
});
export type Customer = z.infer<typeof CustomerSchema>;

export const OrderSchema = z.object({
  id: z.string().min(1),
  /** Document-style receipt handle, e.g. "LM-2026-00042". */
  reference: z.string().regex(/^LM-\d{4}-\d{5}$/),
  serviceId: z.string().min(1),
  /** Price snapshot read from the repository at order creation — never from the client. */
  priceGel: z.number().int().positive(),
  currency: z.literal("GEL"),
  customer: CustomerSchema,
  locale: LocaleSchema,
  status: OrderStatusSchema,
  payment: PaymentStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;

/* ----------------------- Consultation requests ----------------------- */

/** The free 15-minute consultation — the second standing offer. */
export const ConsultationRequestSchema = z.object({
  id: z.string().min(1),
  /** e.g. "LMC-2026-00007" */
  reference: z.string().regex(/^LMC-\d{4}-\d{5}$/),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(georgianPhonePattern),
  matter: z.string().trim().max(600).optional(),
  locale: LocaleSchema,
  status: z.enum(["received", "contacted"]),
  createdAt: z.string(),
});
export type ConsultationRequest = z.infer<typeof ConsultationRequestSchema>;
