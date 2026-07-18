import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export async function getExpatProgram(): Promise<Tables<"programs"> | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("slug", "expat_consultation")
      .eq("is_active", true)
      .maybeSingle();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function listActivePrograms(): Promise<Tables<"programs">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data ?? [];
}
