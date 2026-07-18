import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export async function listOwnBookings(): Promise<Tables<"bookings">[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
