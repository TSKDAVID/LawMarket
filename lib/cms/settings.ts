import { createAnonClient } from "@/lib/supabase/server";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/cms/types";

type SiteSettingsRow = SiteSettings & {
  id: number;
  updated_at: string;
  updated_by: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("site_settings")
    .select(
      "contact_email, contact_phone, contact_phone_href, contact_location_en, contact_location_ka, social_facebook, social_instagram, social_linkedin, hero_media_type, hero_media_url, hero_poster_url, hero_embed_url, legal_updated_at, banner_visible"
    )
    .eq("id", 1)
    .maybeSingle();

  if (!data) return DEFAULT_SITE_SETTINGS;

  const row = data as SiteSettingsRow;
  return {
    contact_email: row.contact_email || DEFAULT_SITE_SETTINGS.contact_email,
    contact_phone: row.contact_phone || DEFAULT_SITE_SETTINGS.contact_phone,
    contact_phone_href:
      row.contact_phone_href || DEFAULT_SITE_SETTINGS.contact_phone_href,
    contact_location_en:
      row.contact_location_en || DEFAULT_SITE_SETTINGS.contact_location_en,
    contact_location_ka:
      row.contact_location_ka || DEFAULT_SITE_SETTINGS.contact_location_ka,
    social_facebook: row.social_facebook ?? "",
    social_instagram: row.social_instagram ?? "",
    social_linkedin: row.social_linkedin ?? "",
    hero_media_type: row.hero_media_type ?? DEFAULT_SITE_SETTINGS.hero_media_type,
    hero_media_url: row.hero_media_url || DEFAULT_SITE_SETTINGS.hero_media_url,
    hero_poster_url:
      row.hero_poster_url || DEFAULT_SITE_SETTINGS.hero_poster_url,
    hero_embed_url: row.hero_embed_url ?? "",
    legal_updated_at:
      row.legal_updated_at || DEFAULT_SITE_SETTINGS.legal_updated_at,
    banner_visible: row.banner_visible ?? true,
  };
}
