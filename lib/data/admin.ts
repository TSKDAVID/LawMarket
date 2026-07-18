import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/types/database.types";

/**
 * Trusted admin operations — sole intended importer of the service-role client
 * for application CRUD (webhooks/cron may use admin client via their own helpers).
 */
export async function listPendingCases(): Promise<Tables<"cases">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cases")
    .select("*")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function reviewCase(params: {
  caseId: string;
  reviewerId: string;
  decision: "verified" | "rejected";
  rejectionReason?: string;
}): Promise<Tables<"cases">> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cases")
    .update({
      verification_status: params.decision,
      is_public: params.decision === "verified",
      rejection_reason: params.decision === "rejected" ? params.rejectionReason ?? null : null,
      verified_by: params.reviewerId,
      verified_at: new Date().toISOString(),
    })
    .eq("id", params.caseId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listExpatApplicationsForReview(): Promise<Tables<"expat_applications">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expat_applications")
    .select("*")
    .in("status", ["submitted", "under_review"])
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function reviewExpatApplication(params: {
  applicationId: string;
  reviewerId: string;
  decision: "accepted" | "rejected";
  rejectionReason?: string;
  adminNotes?: string;
}): Promise<Tables<"expat_applications">> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("expat_applications")
    .update({
      status: params.decision,
      rejection_reason: params.decision === "rejected" ? params.rejectionReason ?? null : null,
      admin_notes: params.adminNotes ?? null,
      reviewed_by: params.reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", params.applicationId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
