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
