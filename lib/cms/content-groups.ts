export type CmsField = {
  key: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  format?: "plain" | "accent" | "placeholders";
};

export type CmsGroup = {
  id: string;
  label: string;
  labelKey?: string;
  fields: CmsField[];
};

/** Editable i18n keys stored in site_content (dot paths). */
export const CMS_CONTENT_GROUPS: CmsGroup[] = [
  {
    id: "global",
    label: "Banner & branding",
    labelKey: "sectionGlobal",
    fields: [
      { key: "common.banner", label: "Top banner text" },
      { key: "common.tagline", label: "Site tagline (footer)" },
      { key: "common.appName", label: "App name" },
    ],
  },
  {
    id: "home-hero",
    label: "Home — hero",
    labelKey: "sectionHomeHero",
    fields: [
      {
        key: "home.heroTitle",
        label: "Hero headline",
        format: "accent",
      },
      { key: "home.heroSubtitle", label: "Hero subtitle", multiline: true },
      { key: "home.heroMediaLabel", label: "Hero media label" },
      { key: "home.searchPlaceholder", label: "Search placeholder" },
      { key: "home.searchButton", label: "Search button" },
      { key: "home.proofLine", label: "Proof line", format: "placeholders", hint: "Use {services} and {lawyers}." },
      { key: "home.attorneyPrompt", label: "Attorney prompt" },
      { key: "home.attorneyCta", label: "Attorney CTA" },
    ],
  },
  {
    id: "home-bands",
    label: "Home — sections",
    labelKey: "sectionHomeBands",
    fields: [
      { key: "home.popularServicesTitle", label: "Popular services title" },
      { key: "home.popularServicesSubtitle", label: "Popular services subtitle", multiline: true },
      { key: "home.guaranteeTitle", label: "Guarantee band title" },
      { key: "home.guaranteeSubtitle", label: "Guarantee band subtitle", multiline: true },
      { key: "home.guaranteeLink", label: "Guarantee link text" },
      { key: "home.verifiedLawyersTitle", label: "Verified lawyers title" },
      { key: "home.verifiedLawyersSubtitle", label: "Verified lawyers subtitle", multiline: true },
      { key: "home.reviewsTitle", label: "Reviews title" },
      { key: "home.reviewsSubtitle", label: "Reviews subtitle", multiline: true },
      { key: "home.ctaTitle", label: "Bottom CTA title" },
      { key: "home.ctaSubtitle", label: "Bottom CTA subtitle", multiline: true },
      { key: "home.ctaButton", label: "Bottom CTA button" },
      { key: "home.findService", label: "Find service card title" },
      { key: "home.findServiceHint", label: "Find service card hint", multiline: true },
      { key: "home.postProblem", label: "Post problem card title" },
      { key: "home.postProblemHint", label: "Post problem card hint", multiline: true },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    labelKey: "sectionFooter",
    fields: [
      { key: "common.footer.description", label: "Footer description", multiline: true },
      { key: "common.footer.platform", label: "Platform column heading" },
      { key: "common.footer.company", label: "Company column heading" },
      { key: "common.footer.legal", label: "Legal column heading" },
      { key: "common.footer.contact", label: "Contact column heading" },
      { key: "common.footer.rights", label: "Copyright line" },
    ],
  },
  {
    id: "contact-form",
    label: "Contact page — form",
    labelKey: "sectionContactForm",
    fields: [
      { key: "contact.title", label: "Page title" },
      { key: "contact.subtitle", label: "Page subtitle", multiline: true },
      { key: "contact.nameLabel", label: "Name label" },
      { key: "contact.emailLabel", label: "Email label" },
      { key: "contact.subjectLabel", label: "Subject label" },
      { key: "contact.messageLabel", label: "Message label" },
      { key: "contact.messagePlaceholder", label: "Message placeholder" },
      { key: "contact.submit", label: "Submit button" },
      { key: "contact.note", label: "Form note", multiline: true },
      { key: "contact.successTitle", label: "Success title" },
      { key: "contact.successNote", label: "Success note", multiline: true },
      { key: "contact.otherWaysTitle", label: "Other ways heading" },
      { key: "contact.emailUs", label: "Email us label" },
      { key: "contact.callUs", label: "Call us label" },
    ],
  },
  {
    id: "catalog",
    label: "Services & lawyers pages",
    labelKey: "sectionCatalog",
    fields: [
      { key: "services.title", label: "Services page title" },
      { key: "services.subtitle", label: "Services page subtitle", multiline: true },
      { key: "lawyers.title", label: "Lawyers page title" },
      { key: "lawyers.subtitle", label: "Lawyers page subtitle", multiline: true },
    ],
  },
];

export const CMS_CONTENT_KEYS = CMS_CONTENT_GROUPS.flatMap((g) =>
  g.fields.map((f) => f.key)
);
