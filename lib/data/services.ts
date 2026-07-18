import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export async function listPublishedServices(): Promise<Tables<"services">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listOwnServices(): Promise<Tables<"services">[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
