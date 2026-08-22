"use server";

import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CMS_CONTENT_KEYS } from "@/lib/cms/content-groups";
import {
  SITE_PAGE_SLUGS,
  type HeroMediaType,
  type SitePageSection,
  type SitePageSlug,
} from "@/lib/cms/types";
import type { Json } from "@/lib/supabase/database.types";

export type CmsState = { error: string | null; ok?: boolean };

function localeOf(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");
  return routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;
}

function revalidateSite(locale: string) {
  revalidatePath("/", "layout");
  revalidatePath(`/${locale}/`);
  for (const slug of SITE_PAGE_SLUGS) {
    revalidatePath(`/${locale}/${slug === "how-it-works" ? "how-it-works" : slug}/`);
  }
}

const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MEDIA_MAX_BYTES = 50 * 1024 * 1024;

async function uploadSiteFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  folder: string,
  file: File
) {
  if (file.size > MEDIA_MAX_BYTES) return { error: "mediaTooLarge" as const };

  const videoExt = VIDEO_TYPES[file.type];
  const imageExt = IMAGE_TYPES[file.type];
  const ext = videoExt ?? imageExt;
  if (!ext) return { error: "invalidMediaType" as const };

  const path = `site/${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });
  if (error) {
    console.error("[site-media]", error.message);
    return { error: "mediaUploadFailed" as const };
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: `${data.publicUrl}?v=${Date.now()}` };
}

export async function saveSiteText(
  _prev: CmsState,
  formData: FormData
): Promise<CmsState> {
  const locale = localeOf(formData);
  const admin = await requireAdmin(locale);
  const supabase = await createClient();

  for (const key of CMS_CONTENT_KEYS) {
    const valueEn = String(formData.get(`${key}__en`) ?? "");
    const valueKa = String(formData.get(`${key}__ka`) ?? "");
    if (!valueEn.trim() && !valueKa.trim()) continue;

    const { error } = await supabase.from("site_content").upsert({
      key,
      value_en: valueEn,
      value_ka: valueKa,
      updated_by: admin.id,
    });
    if (error) return { error: "saveFailed" };
  }

  revalidateSite(locale);
  return { error: null, ok: true };
}

export async function saveSiteContact(
  _prev: CmsState,
  formData: FormData
): Promise<CmsState> {
  const locale = localeOf(formData);
  const admin = await requireAdmin(locale);
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      contact_email: String(formData.get("contact_email") ?? "").trim(),
      contact_phone: String(formData.get("contact_phone") ?? "").trim(),
      contact_phone_href: String(formData.get("contact_phone_href") ?? "").trim(),
      contact_location_en: String(formData.get("contact_location_en") ?? "").trim(),
      contact_location_ka: String(formData.get("contact_location_ka") ?? "").trim(),
      social_facebook: String(formData.get("social_facebook") ?? "").trim(),
      social_instagram: String(formData.get("social_instagram") ?? "").trim(),
      social_linkedin: String(formData.get("social_linkedin") ?? "").trim(),
      banner_visible: formData.get("banner_visible") === "on",
      legal_updated_at: String(formData.get("legal_updated_at") ?? "").trim(),
      updated_by: admin.id,
    })
    .eq("id", 1);

  if (error) return { error: "saveFailed" };

  revalidateSite(locale);
  return { error: null, ok: true };
}

export async function saveHeroMedia(
  _prev: CmsState,
  formData: FormData
): Promise<CmsState> {
  const locale = localeOf(formData);
  const admin = await requireAdmin(locale);
  const supabase = await createClient();

  const mediaType = String(formData.get("hero_media_type") ?? "video");
  const allowed: HeroMediaType[] = ["video", "image", "embed", "none"];
  const hero_media_type = allowed.includes(mediaType as HeroMediaType)
    ? (mediaType as HeroMediaType)
    : "video";

  let hero_media_url = String(formData.get("hero_media_url") ?? "").trim();
  let hero_poster_url = String(formData.get("hero_poster_url") ?? "").trim();
  const hero_embed_url = String(formData.get("hero_embed_url") ?? "").trim();

  const mediaFile = formData.get("hero_media_file");
  if (mediaFile instanceof File && mediaFile.size > 0) {
    const uploaded = await uploadSiteFile(supabase, "hero", mediaFile);
    if (uploaded.error) return { error: uploaded.error };
    hero_media_url = uploaded.url ?? hero_media_url;
  }

  const posterFile = formData.get("hero_poster_file");
  if (posterFile instanceof File && posterFile.size > 0) {
    const uploaded = await uploadSiteFile(supabase, "hero-poster", posterFile);
    if (uploaded.error) return { error: uploaded.error };
    hero_poster_url = uploaded.url ?? hero_poster_url;
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      hero_media_type,
      hero_media_url,
      hero_poster_url,
      hero_embed_url,
      updated_by: admin.id,
    })
    .eq("id", 1);

  if (error) return { error: "saveFailed" };

  revalidateSite(locale);
  return { error: null, ok: true };
}

function parsePageSections(formData: FormData): SitePageSection[] {
  const count = Number(formData.get("section_count") ?? 0);
  const sections: SitePageSection[] = [];
  for (let i = 0; i < count; i++) {
    sections.push({
      title_en: String(formData.get(`section_${i}_title_en`) ?? "").trim(),
      title_ka: String(formData.get(`section_${i}_title_ka`) ?? "").trim(),
      body_en: String(formData.get(`section_${i}_body_en`) ?? "").trim(),
      body_ka: String(formData.get(`section_${i}_body_ka`) ?? "").trim(),
    });
  }
  return sections;
}

export async function saveSitePage(
  _prev: CmsState,
  formData: FormData
): Promise<CmsState> {
  const locale = localeOf(formData);
  const admin = await requireAdmin(locale);
  const slug = String(formData.get("slug") ?? "");
  if (!SITE_PAGE_SLUGS.includes(slug as SitePageSlug)) {
    return { error: "saveFailed" };
  }

  const sections = parsePageSections(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("site_pages").upsert({
    slug,
    title_en: String(formData.get("title_en") ?? "").trim(),
    title_ka: String(formData.get("title_ka") ?? "").trim(),
    subtitle_en: String(formData.get("subtitle_en") ?? "").trim(),
    subtitle_ka: String(formData.get("subtitle_ka") ?? "").trim(),
    notice_en: String(formData.get("notice_en") ?? "").trim(),
    notice_ka: String(formData.get("notice_ka") ?? "").trim(),
    sections: sections as unknown as Json,
    updated_by: admin.id,
  });

  if (error) return { error: "saveFailed" };

  revalidateSite(locale);
  return { error: null, ok: true };
}

export async function markContactMessageHandled(
  _prev: CmsState,
  formData: FormData
): Promise<CmsState> {
  const locale = localeOf(formData);
  await requireAdmin(locale);
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "saveFailed" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ handled: true })
    .eq("id", id);

  if (error) return { error: "saveFailed" };

  revalidatePath(`/${locale}/admin/content/messages/`);
  return { error: null, ok: true };
}

export async function submitContactMessage(
  _prev: CmsState,
  formData: FormData
): Promise<CmsState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !email || !subject || !message) {
    return { error: "missingFields" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
  });

  if (error) return { error: "sendFailed" };
  return { error: null, ok: true };
}
