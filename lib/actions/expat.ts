"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ExpatFormState = { error?: string } | null;

export async function submitExpatApplication(
  _prev: ExpatFormState,
  formData: FormData,
): Promise<ExpatFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/expat/apply");

  const { data: existing } = await supabase
    .from("expat_applications")
    .select("id")
    .eq("client_id", user.id)
    .eq("status", "pending")
    .limit(1);

  if (existing && existing.length > 0) {
    return { error: "alreadyPending" };
  }

  const { error } = await supabase.from("expat_applications").insert({
    client_id: user.id,
    full_name: String(formData.get("full_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    country: String(formData.get("country") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    details: String(formData.get("details") ?? "").trim(),
  });

  if (error) {
    return { error: "generic" };
  }

  redirect("/dashboard/applications?submitted=1");
}
