"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");
  return { supabase, user };
}

export async function reviewCase(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!["approved", "rejected"].includes(decision)) return;

  await supabase
    .from("cases")
    .update({
      status: decision,
      rejection_reason: decision === "rejected" ? reason || null : null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/cases");
}

export async function reviewApplication(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const note = String(formData.get("reason") ?? "").trim();
  if (!["accepted", "rejected"].includes(decision)) return;

  await supabase
    .from("expat_applications")
    .update({
      status: decision,
      decision_note: note || null,
      decided_by: user.id,
      decided_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/applications");
}
