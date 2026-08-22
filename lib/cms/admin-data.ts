import { getSiteContent } from "@/data/queries";
import { CMS_CONTENT_KEYS } from "@/lib/cms/content-groups";
import { getStaticMessageValue } from "@/lib/cms/message-value";
import type { CmsTextStyle } from "@/lib/cms/text-style";

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
    values[key] = {
      en: site[key]?.en?.trim() || getStaticMessageValue(key, "en"),
      ka: site[key]?.ka?.trim() || getStaticMessageValue(key, "ka"),
      style_en: site[key]?.style_en ?? {},
      style_ka: site[key]?.style_ka ?? {},
    };
  }

  return values;
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
