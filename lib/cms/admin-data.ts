import { getSiteContent } from "@/data/queries";
import { CMS_CONTENT_KEYS } from "@/lib/cms/content-groups";
import { getStaticMessageValue } from "@/lib/cms/message-value";
import { buildCmsTextMap } from "@/lib/cms/site-text-map";
import type { CmsTextStyle } from "@/lib/cms/text-style";
import type { Locale } from "@/i18n/routing";

export type CmsTextFieldValues = {
  en: string;
  ka: string;
  style_en: CmsTextStyle;
  style_ka: CmsTextStyle;
};

export async function getCmsTextValues(): Promise<
  Record<string, CmsTextFieldValues>
> {
  const site = await getSiteContent();
  const values: Record<string, CmsTextFieldValues> = {};

  for (const key of CMS_CONTENT_KEYS) {
    const row = site[key];
    values[key] = {
      en: row ? row.en : getStaticMessageValue(key, "en"),
      ka: row ? row.ka : getStaticMessageValue(key, "ka"),
      style_en: row?.style_en ?? {},
      style_ka: row?.style_ka ?? {},
    };
  }

  return values;
}

export async function getCmsTextMap(locale: Locale) {
  const site = await getSiteContent();
  return buildCmsTextMap(site, locale);
}

export async function getCmsStyleMap(locale: "en" | "ka") {
  const site = await getSiteContent();
  const styles: Record<string, CmsTextStyle> = {};
  for (const key of CMS_CONTENT_KEYS) {
    const style = locale === "ka" ? site[key]?.style_ka : site[key]?.style_en;
    if (style && Object.keys(style).length > 0) {
      styles[key] = style;
    }
  }
  return styles;
}
