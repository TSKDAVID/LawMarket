export type HeroMediaType = "video" | "image" | "embed" | "none";

export type SiteSettings = {
  contact_email: string;
  contact_phone: string;
  contact_phone_href: string;
  contact_location_en: string;
  contact_location_ka: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  hero_media_type: HeroMediaType;
  hero_media_url: string;
  hero_poster_url: string;
  hero_embed_url: string;
  legal_updated_at: string;
  banner_visible: boolean;
};

export type SitePageSection = {
  title_en: string;
  title_ka: string;
  body_en: string;
  body_ka: string;
};

export type SitePageSlug =
  | "terms"
  | "privacy"
  | "about"
  | "how-it-works";

export type SitePage = {
  slug: SitePageSlug;
  title_en: string;
  title_ka: string;
  subtitle_en: string;
  subtitle_ka: string;
  sections: SitePageSection[];
  notice_en: string;
  notice_ka: string;
  updated_at: string;
};

export const SITE_PAGE_SLUGS: SitePageSlug[] = [
  "terms",
  "privacy",
  "about",
  "how-it-works",
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact_email: "hello@lawmarket.ge",
  contact_phone: "+995 322 000 000",
  contact_phone_href: "tel:+995322000000",
  contact_location_en: "Tbilisi, Georgia",
  contact_location_ka: "თბილისი, საქართველო",
  social_facebook: "",
  social_instagram: "",
  social_linkedin: "",
  hero_media_type: "video",
  hero_media_url: "/videos/hero-breakdown.mp4",
  hero_poster_url: "/images/hero-legal-placeholder.png",
  hero_embed_url: "",
  legal_updated_at: "2026-08-08",
  banner_visible: true,
};
