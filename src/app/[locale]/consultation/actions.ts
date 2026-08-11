"use server";

import { z } from "zod";
import { LocaleSchema, georgianPhonePattern } from "@/schemas";
import { consultationStore } from "@/lib/orders/store";

export interface ConsultationFormState {
  fieldErrors?: { name?: boolean; email?: boolean; phone?: boolean };
  serverError?: boolean;
  /** Set on success — the document-style receipt handle. */
  reference?: string;
}

const ConsultationInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(georgianPhonePattern),
  matter: z
    .string()
    .trim()
    .max(600)
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});

/** Registers a free 15-minute consultation request (no payment involved). */
export async function createConsultationAction(
  _previous: ConsultationFormState,
  formData: FormData,
): Promise<ConsultationFormState> {
  const localeParse = LocaleSchema.safeParse(formData.get("locale"));
  const locale = localeParse.success ? localeParse.data : "ka";
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");
  if (!idempotencyKey) return { serverError: true };

  const parsed = ConsultationInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    matter: formData.get("matter") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: ConsultationFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "phone") {
        fieldErrors[field] = true;
      }
    }
    return { fieldErrors };
  }

  try {
    const request = await consultationStore.create({
      ...parsed.data,
      locale,
      idempotencyKey,
    });
    return { reference: request.reference };
  } catch {
    return { serverError: true };
  }
}
