import "server-only";

import { createAnonClient } from "@/lib/supabase/server";
import type {
  Category,
  Lawyer,
  LawyerCase,
  Review,
  Service,
  ServiceFaq,
  SiteContent,
} from "./types";
import type {
  CategoryRow,
  LawyerCaseRow,
  LawyerRow,
  ReviewRow,
  ServiceRow,
  SiteContentRow,
} from "@/lib/supabase/database.types";
import { decodePathSlug } from "@/lib/utils";

/**
 * Read side of the catalog. Every function keeps the signature it had when the
 * data lived in `data/*.ts`, so call sites did not have to change — only the
 * bodies now talk to Supabase.
 *
 * These are public reads: they use the anonymous client rather than the
 * cookie-bound one, so they also work at build time and inside
 * `generateStaticParams`, where there is no request to read cookies from.
 */

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name_en: row.name_en,
    name_ka: row.name_ka,
    icon: row.icon,
  };
}

function mapLawyer(
  row: LawyerRow & { lawyer_practice_areas?: { category_id: string }[] }
): Lawyer {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    initials: row.initials,
    avatarColor: row.avatar_color,
    photoUrl: row.photo_url ?? undefined,
    headline_en: row.headline_en,
    headline_ka: row.headline_ka,
    bio_en: row.bio_en,
    bio_ka: row.bio_ka,
    city: row.city,
    languages: row.languages ?? [],
    yearsExperience: row.years_experience,
    practiceAreaIds: (row.lawyer_practice_areas ?? []).map(
      (a) => a.category_id
    ),
    verified: row.verified,
    phone: row.phone ?? undefined,
    contactEmail: row.contact_email ?? undefined,
  };
}

/** faq columns are jsonb; narrow the shape before it reaches the UI. */
function mapFaq(value: unknown): ServiceFaq[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is ServiceFaq =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as ServiceFaq).q === "string" &&
      typeof (item as ServiceFaq).a === "string"
  );
  return items.length > 0 ? items : undefined;
}

function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    lawyerId: row.lawyer_id,
    title_en: row.title_en,
    title_ka: row.title_ka,
    description_en: row.description_en,
    description_ka: row.description_ka,
    // numeric(10,2) arrives as a string over PostgREST
    price: Number(row.price),
    currency: "GEL",
    durationMinutes: row.duration_minutes,
    popular: row.popular,
    includes_en: row.includes_en?.length ? row.includes_en : undefined,
    includes_ka: row.includes_ka?.length ? row.includes_ka : undefined,
    faq_en: mapFaq(row.faq_en),
    faq_ka: mapFaq(row.faq_ka),
  };
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    authorName: row.author_name,
    authorRole_en: row.author_role_en,
    authorRole_ka: row.author_role_ka,
    rating: row.rating,
    quote_en: row.quote_en,
    quote_ka: row.quote_ka,
    serviceId: row.service_id ?? undefined,
    lawyerId: row.lawyer_id ?? undefined,
  };
}

const LAWYER_SELECT = "*, lawyer_practice_areas(category_id)";

// --- Categories ------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return (data ?? []).map(mapCategory);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ? mapCategory(data) : undefined;
}

export async function getCategoryById(
  id: string
): Promise<Category | undefined> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapCategory(data) : undefined;
}

// --- Services --------------------------------------------------------------

export async function getServices(): Promise<Service[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map(mapService);
}

export async function getPopularServices(): Promise<Service[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .eq("popular", true)
    .order("sort_order");
  return (data ?? []).map(mapService);
}

export async function getServiceBySlug(
  slug: string
): Promise<Service | undefined> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", decodePathSlug(slug))
    .eq("published", true)
    .maybeSingle();
  return data ? mapService(data) : undefined;
}

export async function getServicesByCategory(
  categoryId: string
): Promise<Service[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", categoryId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map(mapService);
}

export async function getServicesByLawyer(
  lawyerId: string
): Promise<Service[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("lawyer_id", lawyerId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map(mapService);
}

export async function getRelatedServices(
  service: Service,
  limit = 3
): Promise<Service[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", service.categoryId)
    .eq("published", true)
    .neq("id", service.id)
    .order("sort_order")
    .limit(limit);
  return (data ?? []).map(mapService);
}

// --- Lawyers ---------------------------------------------------------------

export async function getLawyers(): Promise<Lawyer[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("lawyers")
    .select(LAWYER_SELECT)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map(mapLawyer);
}

export async function getLawyerBySlug(
  slug: string
): Promise<Lawyer | undefined> {
  const supabase = createAnonClient();
  const normalized = decodePathSlug(slug);
  const { data } = await supabase
    .from("lawyers")
    .select(LAWYER_SELECT)
    .eq("slug", normalized)
    .eq("published", true)
    .maybeSingle();
  return data ? mapLawyer(data) : undefined;
}

export async function getLawyerById(id: string): Promise<Lawyer | undefined> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("lawyers")
    .select(LAWYER_SELECT)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  return data ? mapLawyer(data) : undefined;
}

export async function getVerifiedLawyers(): Promise<Lawyer[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("lawyers")
    .select(LAWYER_SELECT)
    .eq("published", true)
    .eq("verified", true)
    .order("sort_order");
  return (data ?? []).map(mapLawyer);
}

// --- Reviews ---------------------------------------------------------------

export async function getReviews(): Promise<Review[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order");
  return (data ?? []).map(mapReview);
}

export async function getReviewsByLawyer(
  lawyerId: string
): Promise<Review[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("lawyer_id", lawyerId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map(mapReview);
}

// --- Derived facets --------------------------------------------------------

export async function getCities(): Promise<string[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("lawyers")
    .select("city")
    .eq("published", true);
  return Array.from(new Set((data ?? []).map((row) => row.city))).sort();
}

export async function getLanguages(): Promise<string[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("lawyers")
    .select("languages")
    .eq("published", true);
  return Array.from(
    new Set((data ?? []).flatMap((row) => row.languages ?? []))
  ).sort();
}

export type LawyerRating = {
  average: number;
  count: number;
};

export async function getLawyerRatings(): Promise<Map<string, LawyerRating>> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("reviews")
    .select("lawyer_id, rating")
    .eq("published", true)
    .not("lawyer_id", "is", null);

  const totals = new Map<string, { sum: number; count: number }>();
  for (const review of data ?? []) {
    if (!review.lawyer_id) continue;
    const current = totals.get(review.lawyer_id) ?? { sum: 0, count: 0 };
    current.sum += review.rating;
    current.count += 1;
    totals.set(review.lawyer_id, current);
  }

  const ratings = new Map<string, LawyerRating>();
  for (const [lawyerId, { sum, count }] of totals) {
    ratings.set(lawyerId, {
      average: Math.round((sum / count) * 10) / 10,
      count,
    });
  }
  return ratings;
}

// --- Editable site copy ----------------------------------------------------

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createAnonClient();
  const { data } = await supabase.from("site_content").select("*");
  const map: SiteContent = {};
  for (const row of (data ?? []) as SiteContentRow[]) {
    map[row.key] = { en: row.value_en, ka: row.value_ka };
  }
  return map;
}

function mapCase(row: LawyerCaseRow): LawyerCase {
  return {
    id: row.id,
    lawyerId: row.lawyer_id,
    categoryId: row.category_id ?? undefined,
    title_en: row.title_en || row.title_ka,
    title_ka: row.title_ka,
    description_en: row.description_en || row.description_ka,
    description_ka: row.description_ka,
    year: row.year,
    outcome_en: row.outcome_en || row.outcome_ka,
    outcome_ka: row.outcome_ka,
  };
}

export async function getCasesByLawyer(
  lawyerId: string
): Promise<LawyerCase[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("lawyer_cases")
    .select("*")
    .eq("lawyer_id", lawyerId)
    .eq("published", true)
    .order("sort_order")
    .order("year", { ascending: false });
  return (data ?? []).map(mapCase);
}
