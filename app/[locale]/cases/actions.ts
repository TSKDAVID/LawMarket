"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnLawyer, getSessionUser } from "@/lib/auth";
import { caseStillEditable, daysToMinutes, localeOf } from "@/lib/cases";

export type CaseState = { error: string | null; ok?: boolean };

function localePath(locale: string, path: string) {
  if (path === "/") return `/${locale}/`;
  return `/${locale}${path.endsWith("/") ? path : `${path}/`}`;
}

export async function createClientCase(
  _prev: CaseState,
  formData: FormData
): Promise<CaseState> {
  const locale = localeOf(formData);
  const user = await getSessionUser();
  if (!user) redirect(localePath(locale, "/login") + `?next=/${locale}/cases/new/`);
  if (user.profile?.role === "lawyer") redirect(localePath(locale, "/cases"));

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  if (title.length < 8 || description.length < 40) return { error: "tooShort" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("client_cases")
    .insert({
      client_id: user.id,
      title,
      description,
      city: city || null,
      category_id: categoryId || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createClientCase]", error?.message);
    return { error: "saveFailed" };
  }

  revalidatePath(`/${locale}/cases`);
  redirect(localePath(locale, `/cases/${data.id}`));
}

export async function updateClientCase(
  _prev: CaseState,
  formData: FormData
): Promise<CaseState> {
  const locale = localeOf(formData);
  const user = await getSessionUser();
  if (!user) return { error: "saveFailed" };

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  if (!id) return { error: "saveFailed" };
  if (title.length < 8 || description.length < 40) return { error: "tooShort" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("client_cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!existing || existing.client_id !== user.id) return { error: "saveFailed" };
  if (!caseStillEditable(existing)) return { error: "editExpired" };

  const { error } = await supabase
    .from("client_cases")
    .update({
      title,
      description,
      city: city || null,
      category_id: categoryId || null,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateClientCase]", error.message);
    return { error: "saveFailed" };
  }

  revalidatePath(`/${locale}/cases/${id}`);
  return { error: null, ok: true };
}

export async function closeClientCase(formData: FormData) {
  const locale = localeOf(formData);
  const user = await getSessionUser();
  if (!user) redirect(localePath(locale, "/login"));

  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase
    .from("client_cases")
    .update({ status: "closed" })
    .eq("id", id)
    .eq("client_id", user.id);

  revalidatePath(`/${locale}/cases/${id}`);
  redirect(localePath(locale, `/cases/${id}`));
}

export async function submitProposal(
  _prev: CaseState,
  formData: FormData
): Promise<CaseState> {
  const locale = localeOf(formData);
  const lawyer = await getOwnLawyer();
  if (!lawyer) return { error: "notLawyer" };

  const caseId = String(formData.get("case_id") ?? "");
  const price = Number(formData.get("price") ?? "");
  const days = Number(formData.get("duration_days") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  if (!caseId || !Number.isFinite(price) || price < 0) return { error: "missingFields" };
  if (message.length < 20) return { error: "proposalShort" };

  const supabase = await createClient();
  const { error } = await supabase.from("case_proposals").insert({
    case_id: caseId,
    lawyer_id: lawyer.id,
    price,
    duration_minutes:
      Number.isFinite(days) && days > 0 ? daysToMinutes(days) : null,
    message,
  });

  if (error) {
    console.error("[submitProposal]", error.message);
    return { error: error.message.includes("case_proposals_one_pending") ? "alreadyProposed" : "saveFailed" };
  }

  revalidatePath(`/${locale}/cases/${caseId}`);
  return { error: null, ok: true };
}

export async function withdrawProposal(formData: FormData) {
  const locale = localeOf(formData);
  const lawyer = await getOwnLawyer();
  if (!lawyer) redirect(localePath(locale, "/login"));

  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  const supabase = await createClient();
  await supabase
    .from("case_proposals")
    .update({ status: "withdrawn" })
    .eq("id", id)
    .eq("lawyer_id", lawyer.id)
    .eq("status", "pending");

  revalidatePath(`/${locale}/cases/${caseId}`);
  redirect(localePath(locale, `/cases/${caseId}`));
}

export async function acceptProposal(
  _prev: CaseState,
  formData: FormData
): Promise<CaseState> {
  const locale = localeOf(formData);
  const user = await getSessionUser();
  if (!user) return { error: "saveFailed" };

  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  if (!id || !caseId) return { error: "saveFailed" };

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("client_cases")
    .select("id, client_id, status")
    .eq("id", caseId)
    .maybeSingle();
  if (!row || row.client_id !== user.id) return { error: "saveFailed" };
  if (row.status === "matched") {
    revalidatePath(`/${locale}/cases/${caseId}`);
    return { error: null, ok: true };
  }
  if (row.status !== "open") return { error: "saveFailed" };

  const { error: acceptError } = await supabase
    .from("case_proposals")
    .update({ status: "accepted" })
    .eq("id", id)
    .eq("case_id", caseId)
    .eq("status", "pending");
  if (acceptError) {
    console.error("[acceptProposal]", acceptError.message);
    return { error: "saveFailed" };
  }

  await supabase
    .from("case_proposals")
    .update({ status: "declined" })
    .eq("case_id", caseId)
    .eq("status", "pending");
  await supabase.from("client_cases").update({ status: "matched" }).eq("id", caseId);

  revalidatePath(`/${locale}/cases/${caseId}`);
  revalidatePath(`/${locale}/cases`);
  return { error: null, ok: true };
}

export async function createConsultBooking(
  _prev: CaseState,
  formData: FormData
): Promise<CaseState> {
  const locale = localeOf(formData);
  const user = await getSessionUser();

  const lawyerId = String(formData.get("lawyer_id") ?? "");
  const caseId = String(formData.get("client_case_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  if (!lawyerId || !name || !email || !phone || !date || !time) {
    return { error: "missingFields" };
  }

  const supabase = await createClient();
  if (caseId) {
    if (!user) return { error: "saveFailed" };
    const { data: owned } = await supabase
      .from("client_cases")
      .select("id")
      .eq("id", caseId)
      .eq("client_id", user.id)
      .maybeSingle();
    if (!owned) return { error: "saveFailed" };
  }

  const { error } = await supabase.from("bookings").insert({
    lawyer_id: lawyerId,
    client_case_id: caseId || null,
    user_id: user?.id ?? null,
    name,
    email,
    phone,
    notes: notes || "15-minute free consultation",
    date,
    time,
    status: "pending",
  });

  if (error) {
    console.error("[createConsultBooking]", error.message);
    return { error: "saveFailed" };
  }

  if (caseId) revalidatePath(`/${locale}/cases/${caseId}`);
  revalidatePath(`/${locale}/portal/bookings`);
  return { error: null, ok: true };
}
