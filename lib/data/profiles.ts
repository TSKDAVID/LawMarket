import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export async function getOwnProfile(): Promise<Tables<"profiles"> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateOwnProfile(
  updates: Partial<
    Pick<
      Tables<"profiles">,
      "full_name" | "phone" | "city" | "bio" | "role" | "public_slug" | "onboarding_completed" | "avatar_path"
    >
  >,
): Promise<Tables<"profiles">> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getProviderBySlug(slug: string): Promise<Tables<"profiles"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("public_slug", slug)
    .eq("role", "provider")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
