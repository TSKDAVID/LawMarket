import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export async function listOwnCases(): Promise<Tables<"cases">[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listPublicCasesForProvider(providerId: string): Promise<Tables<"cases">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("provider_id", providerId)
    .eq("is_public", true)
    .eq("verification_status", "verified")
    .order("verified_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
