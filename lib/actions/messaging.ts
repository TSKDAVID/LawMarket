"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function startConversation(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const providerId = String(formData.get("provider_id") ?? "");
  const providerSlug = String(formData.get("provider_slug") ?? "");
  if (!user) redirect(`/login?next=/lawyers/${providerSlug}`);

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("client_id", user.id)
    .eq("provider_id", providerId)
    .maybeSingle();

  let conversationId = existing?.id;

  if (!conversationId) {
    const { data: created } = await supabase
      .from("conversations")
      .insert({ client_id: user.id, provider_id: providerId })
      .select("id")
      .single();
    conversationId = created?.id;
  }

  redirect(
    conversationId
      ? `/dashboard/messages?c=${conversationId}`
      : "/dashboard/messages",
  );
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const conversationId = String(formData.get("conversation_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body || !conversationId) return;

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body,
  });

  revalidatePath("/dashboard/messages");
}
