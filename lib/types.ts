export type PracticeArea = {
  id: number;
  slug: string;
  name_ka: string;
  name_en: string;
};

export type Program = {
  id: number;
  slug: string;
  name_ka: string;
  name_en: string;
  description_ka: string;
  description_en: string;
};

export type ProviderListItem = {
  id: string;
  slug: string;
  headline_ka: string;
  headline_en: string;
  city: string;
  languages: string[];
  years_experience: number;
  accepts_expat: boolean;
  profiles: { full_name: string; avatar_url: string | null } | null;
  provider_practice_areas: { practice_areas: PracticeArea | null }[];
  cases: { id: string }[];
  services: { price_gel: number }[];
};

export type Service = {
  id: string;
  provider_id: string;
  program_id: number;
  title_ka: string;
  title_en: string;
  description_ka: string;
  description_en: string;
  price_gel: number;
  duration_min: number | null;
  is_active: boolean;
};

export type Case = {
  id: string;
  provider_id: string;
  case_number: string;
  title_ka: string;
  title_en: string;
  summary_ka: string;
  summary_en: string;
  year: number | null;
  registry_url: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  practice_areas: PracticeArea | null;
};
