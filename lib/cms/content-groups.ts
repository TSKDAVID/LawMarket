export type { CmsField, CmsGroup } from "@/lib/cms/field-types";
import {
  CMS_MESSAGE_GROUPS,
  CMS_PAGE_EXTRA_KEY_LIST,
} from "@/lib/cms/message-registry";

/** Editable i18n keys stored in site_content (dot paths). */
export const CMS_CONTENT_GROUPS = CMS_MESSAGE_GROUPS;

export const CMS_CONTENT_KEYS = [
  ...new Set([
    ...CMS_CONTENT_GROUPS.flatMap((g) => g.fields.map((f) => f.key)),
    ...CMS_PAGE_EXTRA_KEY_LIST,
  ]),
];
