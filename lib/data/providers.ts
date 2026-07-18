import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type ProviderListItem = Tables<"profiles"> & {
  provider_details: Pick<
    Tables<"provider_details">,
    "law_firm" | "years_experience" | "languages" | "identity_verified" | "subscription_status"
  > | null;
  provider_practice_areas: Array<{
    practice_area_id: string;
    practice_areas: Pick<Tables<"practice_areas">, "id" | "slug" | "name"> | null;
  }>;
};

export type ProviderFilters = {
  city?: string;
  practiceArea?: string;
  language?: string;
};

export async function listPublishedProviders(
  filters: ProviderFilters = {},
): Promise<ProviderListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(
      `
      *,
      provider_details ( law_firm, years_experience, languages, identity_verified, subscription_status ),
      provider_practice_areas (
        practice_area_id,
        practice_areas ( id, slug, name )
      )
    `,
    )
    .eq("role", "provider")
    .eq("is_active", true)
    .not("public_slug", "is", null)
    .order("full_name");

  if (filters.city) {
    query = query.ilike("city", filters.city);
  }

  const { data, error } = await query;
  if (error) throw error;

  let rows = (data ?? []) as ProviderListItem[];

  if (filters.practiceArea) {
    rows = rows.filter((p) =>
      p.provider_practice_areas?.some((ppa) => ppa.practice_areas?.slug === filters.practiceArea),
    );
  }

  if (filters.language) {
    const lang = filters.language.toLowerCase();
    rows = rows.filter((p) =>
      (p.provider_details?.languages ?? []).some((l) => l.toLowerCase() === lang),
    );
  }

  return rows;
}

export async function getProviderPublicProfile(slug: string): Promise<{
  profile: ProviderListItem;
  services: Tables<"services">[];
  cases: Tables<"cases">[];
} | null> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      provider_details ( law_firm, years_experience, languages, identity_verified, subscription_status ),
      provider_practice_areas (
        practice_area_id,
        practice_areas ( id, slug, name )
      )
    `,
    )
    .eq("public_slug", slug)
    .eq("role", "provider")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!profile) return null;

  const [{ data: services }, { data: cases }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("provider_id", profile.id)
      .eq("is_published", true)
      .order("title"),
    supabase
      .from("cases")
      .select("*")
      .eq("provider_id", profile.id)
      .eq("is_public", true)
      .eq("verification_status", "verified")
      .order("verified_at", { ascending: false }),
  ]);

  return {
    profile: profile as ProviderListItem,
    services: services ?? [],
    cases: cases ?? [],
  };
}

export async function listPracticeAreas(): Promise<Tables<"practice_areas">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  return data ?? [];
}
