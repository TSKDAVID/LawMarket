export type Locale = "en" | "ka";

export type Category = {
  id: string;
  slug: string;
  name_en: string;
  name_ka: string;
  icon: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
};

export type Service = {
  id: string;
  slug: string;
  categoryId: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  price: number;
  currency: "GEL";
  durationMinutes: number | null;
  lawyerId: string;
  popular?: boolean;
  includes_en?: string[];
  includes_ka?: string[];
  faq_en?: ServiceFaq[];
  faq_ka?: ServiceFaq[];
};

export type Lawyer = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  avatarColor: string;
  photoUrl?: string;
  headline_en: string;
  headline_ka: string;
  bio_en: string;
  bio_ka: string;
  city: string;
  languages: string[];
  yearsExperience: number;
  practiceAreaIds: string[];
  verified: boolean;
};

export type Review = {
  id: string;
  authorName: string;
  authorRole_en: string;
  authorRole_ka: string;
  rating: number;
  quote_en: string;
  quote_ka: string;
  serviceId?: string;
  lawyerId?: string;
};
