import en from "@/messages/en.json";
import ka from "@/messages/ka.json";
import type { Locale } from "@/i18n/routing";
import { createAnonClient } from "@/lib/supabase/server";
import {
  SITE_PAGE_SLUGS,
  type SitePage,
  type SitePageSection,
  type SitePageSlug,
} from "@/lib/cms/types";

function fallbackAboutSections(): SitePageSection[] {
  const a = en.about;
  const k = ka.about;
  return [
    {
      title_en: a.missionTitle,
      title_ka: k.missionTitle,
      body_en: a.missionText,
      body_ka: k.missionText,
    },
    {
      title_en: a.value1Title,
      title_ka: k.value1Title,
      body_en: a.value1Text,
      body_ka: k.value1Text,
    },
    {
      title_en: a.value2Title,
      title_ka: k.value2Title,
      body_en: a.value2Text,
      body_ka: k.value2Text,
    },
    {
      title_en: a.value3Title,
      title_ka: k.value3Title,
      body_en: a.value3Text,
      body_ka: k.value3Text,
    },
  ];
}

function fallbackLegalSections(
  kind: "terms" | "privacy"
): SitePageSection[] {
  const sections: SitePageSection[] = [];
  for (let n = 1; n <= 4; n++) {
    const titleKey = `${kind}Section${n}Title` as keyof typeof en.legal;
    const textKey = `${kind}Section${n}Text` as keyof typeof en.legal;
    sections.push({
      title_en: en.legal[titleKey],
      title_ka: ka.legal[titleKey],
      body_en: en.legal[textKey],
      body_ka: ka.legal[textKey],
    });
  }
  return sections;
}

function fallbackHowItWorksSections(): SitePageSection[] {
  const h = en.howItWorks;
  const hk = ka.howItWorks;
  return [
    {
      title_en: h.step1Title,
      title_ka: hk.step1Title,
      body_en: h.step1Text,
      body_ka: hk.step1Text,
    },
    {
      title_en: h.step2Title,
      title_ka: hk.step2Title,
      body_en: h.step2Text,
      body_ka: hk.step2Text,
    },
    {
      title_en: h.step3Title,
      title_ka: hk.step3Title,
      body_en: h.step3Text,
      body_ka: hk.step3Text,
    },
  ];
}

function fallbackPage(slug: SitePageSlug): SitePage {
  if (slug === "terms") {
    return {
      slug,
      title_en: en.legal.termsTitle,
      title_ka: ka.legal.termsTitle,
      subtitle_en: "",
      subtitle_ka: "",
      notice_en: en.legal.placeholderNotice,
      notice_ka: ka.legal.placeholderNotice,
      sections: fallbackLegalSections("terms"),
      updated_at: new Date().toISOString(),
    };
  }
  if (slug === "privacy") {
    return {
      slug,
      title_en: en.legal.privacyTitle,
      title_ka: ka.legal.privacyTitle,
      subtitle_en: "",
      subtitle_ka: "",
      notice_en: en.legal.placeholderNotice,
      notice_ka: ka.legal.placeholderNotice,
      sections: fallbackLegalSections("privacy"),
      updated_at: new Date().toISOString(),
    };
  }
  if (slug === "about") {
    return {
      slug,
      title_en: en.about.title,
      title_ka: ka.about.title,
      subtitle_en: en.about.subtitle,
      subtitle_ka: ka.about.subtitle,
      notice_en: "",
      notice_ka: "",
      sections: fallbackAboutSections(),
      updated_at: new Date().toISOString(),
    };
  }
  return {
    slug,
    title_en: en.howItWorks.title,
    title_ka: ka.howItWorks.title,
    subtitle_en: en.howItWorks.subtitle,
    subtitle_ka: ka.howItWorks.subtitle,
    notice_en: "",
    notice_ka: "",
    sections: fallbackHowItWorksSections(),
    updated_at: new Date().toISOString(),
  };
}

function parseSections(raw: unknown): SitePageSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, string>;
      return {
        title_en: String(row.title_en ?? ""),
        title_ka: String(row.title_ka ?? ""),
        body_en: String(row.body_en ?? ""),
        body_ka: String(row.body_ka ?? ""),
      };
    })
    .filter((s): s is SitePageSection => s !== null);
}

export async function getSitePage(slug: SitePageSlug): Promise<SitePage> {
  const fallback = fallbackPage(slug);
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("site_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return fallback;

  const row = data as {
    slug: string;
    title_en: string;
    title_ka: string;
    subtitle_en: string;
    subtitle_ka: string;
    sections: unknown;
    notice_en: string;
    notice_ka: string;
    updated_at: string;
  };

  const sections = parseSections(row.sections);
  return {
    slug,
    title_en: row.title_en || fallback.title_en,
    title_ka: row.title_ka || fallback.title_ka,
    subtitle_en: row.subtitle_en || fallback.subtitle_en,
    subtitle_ka: row.subtitle_ka || fallback.subtitle_ka,
    notice_en: row.notice_en ?? fallback.notice_en,
    notice_ka: row.notice_ka ?? fallback.notice_ka,
    sections: sections.length > 0 ? sections : fallback.sections,
    updated_at: row.updated_at,
  };
}

export async function getAllSitePages(): Promise<SitePage[]> {
  return Promise.all(SITE_PAGE_SLUGS.map((slug) => getSitePage(slug)));
}

export function localizedPageTitle(page: SitePage, locale: Locale) {
  return locale === "ka" ? page.title_ka || page.title_en : page.title_en;
}

export function localizedPageSubtitle(page: SitePage, locale: Locale) {
  return locale === "ka"
    ? page.subtitle_ka || page.subtitle_en
    : page.subtitle_en;
}

export function localizedPageNotice(page: SitePage, locale: Locale) {
  return locale === "ka" ? page.notice_ka || page.notice_en : page.notice_en;
}

export function localizedSections(page: SitePage, locale: Locale) {
  return page.sections.map((section) => ({
    title:
      locale === "ka"
        ? section.title_ka || section.title_en
        : section.title_en,
    text:
      locale === "ka"
        ? section.body_ka || section.body_en
        : section.body_en,
  }));
}
