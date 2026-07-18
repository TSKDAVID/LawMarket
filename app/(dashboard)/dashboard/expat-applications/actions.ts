"use server";

import { revalidatePath } from "next/cache";
import { submitExpatApplication } from "@/lib/data/expat-applications";

export type ExpatFormState = { error?: string; success?: boolean };

export async function submitExpatAction(
  _prev: ExpatFormState,
  formData: FormData,
): Promise<ExpatFormState> {
  const residency = formData.get("residency") === "on";
  const matterType = String(formData.get("matter_type") || "");
  const urgency = formData.get("urgency") === "on";

  if (!residency || !matterType) {
    return { error: "სავალდებულო ველები შეავსეთ." };
  }

  try {
    await submitExpatApplication({
      residency,
      matter_type: matterType,
      urgency,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "შენახვა ვერ მოხერხდა." };
  }

  revalidatePath("/dashboard/expat-applications");
  return { success: true };
}
