import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export async function listOwnConversations(): Promise<Tables<"conversations">[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data ?? [];
}

export async function listMessages(conversationId: string): Promise<Tables<"messages">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
