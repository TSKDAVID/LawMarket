import { createClient } from "@/lib/supabase/server";
import type { Json, Tables } from "@/types/database.types";
import { getExpatProgram } from "@/lib/data/programs";

export async function listOwnExpatApplications(): Promise<Tables<"expat_applications">[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("expat_applications")
    .select("*")
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function submitExpatApplication(
  answers: Record<string, unknown>,
): Promise<Tables<"expat_applications">> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const program = await getExpatProgram();
  if (!program) throw new Error("Expat program not found");

  const config = program.config as { eligibility_criteria?: Json };
  const criteria = config.eligibility_criteria ?? [];

  const { data, error } = await supabase
    .from("expat_applications")
    .insert({
      applicant_id: user.id,
      program_id: program.id,
      status: "submitted",
      answers: answers as Json,
      criteria_snapshot: criteria,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
