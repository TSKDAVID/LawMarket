import en from "@/messages/en.json";
import type { CmsField, CmsGroup } from "@/lib/cms/field-types";
import { getStaticMessageValue } from "@/lib/cms/message-value";

/** Namespaces kept out of the public site text editor. */
const EXCLUDED_ROOTS = new Set(["admin", "portal"]);

function shouldInclude(path: string) {
  const root = path.split(".")[0];
  if (EXCLUDED_ROOTS.has(root)) return false;
  if (path.includes(".errors.")) return false;
  if (path.endsWith(".errors")) return false;
  return true;
}

function collectStringPaths(
  obj: Record<string, unknown>,
  prefix = ""
): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!shouldInclude(path)) continue;
    if (typeof value === "string") {
      paths.push(path);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      paths.push(
        ...collectStringPaths(value as Record<string, unknown>, path)
      );
    }
  }
  return paths;
}

function groupIdFor(path: string) {
  if (path.startsWith("common.nav.")) return "common-nav";
  if (path.startsWith("common.footer.")) return "common-footer";
  if (path.startsWith("common.")) return "common-shared";
  return path.split(".")[0];
}

function humanizeKey(path: string) {
  const leaf = path.split(".").pop() ?? path;
  return leaf
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fieldMeta(path: string): Pick<CmsField, "multiline" | "format" | "hint"> {
  const staticEn = getStaticMessageValue(path, "en");
  const meta: Pick<CmsField, "multiline" | "format" | "hint"> = {};

  if (path === "home.heroTitle") {
    meta.format = "accent";
    meta.hint = "Highlighted words: up to 6 (burgundy on the site).";
  } else if (staticEn.includes("{")) {
    meta.format = "placeholders";
    meta.hint = "Keep placeholders like {count}, {name}, {email} unchanged.";
  }

  if (
    /(subtitle|description|note|hint|placeholder|message|lead|body|explain|privacyNote|consultBody|guestSubtitle|loopLead|proposalsLead)/i.test(
      path
    ) &&
    !/(title|label|button|cta|link|kicker|nav|reset|sort|filter)/i.test(path)
  ) {
    meta.multiline = true;
  }

  return meta;
}

const GROUP_META: Record<
  string,
  { label: string; labelKey: string }
> = {
  "common-shared": {
    label: "Shared labels & buttons",
    labelKey: "sectionCommonShared",
  },
  "common-nav": { label: "Navigation", labelKey: "sectionNavLinks" },
  "common-footer": { label: "Footer links", labelKey: "sectionFooterLinks" },
  home: { label: "Home page", labelKey: "sectionHome" },
  services: { label: "Services catalog", labelKey: "sectionServices" },
  serviceDetail: {
    label: "Service detail page",
    labelKey: "sectionServiceDetail",
  },
  lawyers: { label: "Lawyers catalog", labelKey: "sectionLawyers" },
  lawyerProfile: {
    label: "Lawyer profile page",
    labelKey: "sectionLawyerProfile",
  },
  howItWorks: { label: "How it works page", labelKey: "sectionHowItWorks" },
  about: { label: "About page", labelKey: "sectionAbout" },
  contact: { label: "Contact page", labelKey: "sectionContact" },
  start: { label: "Get started page", labelKey: "sectionStart" },
  auth: { label: "Login & signup", labelKey: "sectionAuth" },
  booking: { label: "Booking modal", labelKey: "sectionBooking" },
  purchase: { label: "Purchase modal", labelKey: "sectionPurchase" },
  cases: { label: "Cases / problem board", labelKey: "sectionCases" },
  legal: { label: "Legal page chrome", labelKey: "sectionLegal" },
  notFound: { label: "404 page", labelKey: "sectionNotFound" },
  categories: { label: "Category names", labelKey: "sectionCategories" },
};

const GROUP_ORDER = [
  "common-shared",
  "common-nav",
  "common-footer",
  "home",
  "services",
  "serviceDetail",
  "lawyers",
  "lawyerProfile",
  "howItWorks",
  "about",
  "contact",
  "start",
  "auth",
  "booking",
  "purchase",
  "cases",
  "legal",
  "notFound",
  "categories",
];

function buildGroups(): CmsGroup[] {
  const paths = collectStringPaths(en as Record<string, unknown>);
  const byGroup = new Map<string, CmsField[]>();

  for (const path of paths) {
    const id = groupIdFor(path);
    const fields = byGroup.get(id) ?? [];
    fields.push({
      key: path,
      label: humanizeKey(path),
      ...fieldMeta(path),
    });
    byGroup.set(id, fields);
  }

  const groups: CmsGroup[] = [];
  for (const id of GROUP_ORDER) {
    const fields = byGroup.get(id);
    if (!fields?.length) continue;
    const meta = GROUP_META[id] ?? {
      label: id,
      labelKey: undefined as unknown as string,
    };
    groups.push({
      id,
      label: meta.label,
      labelKey: meta.labelKey,
      fields: fields.sort((a, b) => a.key.localeCompare(b.key)),
    });
  }

  return groups;
}

/** All editable marketing / catalog copy groups (built from messages/en.json). */
export const CMS_MESSAGE_GROUPS = buildGroups();

/** Keys edited inline on static page forms (also appear in site text). */
export const CMS_PAGE_EXTRA_KEYS: Record<string, string[]> = {
  "how-it-works": [
    "howItWorks.guaranteeTitle",
    "howItWorks.guaranteeText",
    "howItWorks.ctaTitle",
    "howItWorks.ctaButton",
  ],
  about: ["about.valuesTitle"],
};

export const CMS_PAGE_EXTRA_KEY_LIST = Object.values(CMS_PAGE_EXTRA_KEYS).flat();
