import { getSiteContent } from "@/data/queries";
import { CMS_CONTENT_KEYS } from "@/lib/cms/content-groups";
import { getStaticMessageValue } from "@/lib/cms/message-value";

export async function getCmsTextValues(): Promise<
  Record<string, { en: string; ka: string }>
> {
  const site = await getSiteContent();
  const values: Record<string, { en: string; ka: string }> = {};

  for (const key of CMS_CONTENT_KEYS) {
    values[key] = {
      en: site[key]?.en?.trim() || getStaticMessageValue(key, "en"),
      ka: site[key]?.ka?.trim() || getStaticMessageValue(key, "ka"),
    };
  }

  return values;
}
