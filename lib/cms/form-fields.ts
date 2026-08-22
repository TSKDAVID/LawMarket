/** Encode CMS dot keys for HTML form names (avoids nested FormData parsing). */
export function cmsFormFieldName(key: string, lang: "en" | "ka") {
  return `${key.replace(/\./g, "__")}__${lang}`;
}

export function parseCmsFormFieldName(name: string): {
  key: string;
  lang: "en" | "ka";
} | null {
  if (name.includes("__style_")) return null;
  const match = name.match(/^(.+)__(en|ka)$/);
  if (!match) return null;
  return {
    key: match[1].replace(/__/g, "."),
    lang: match[2] as "en" | "ka",
  };
}

/** Read bilingual CMS text fields from a submitted form. */
export function readCmsTextFormData(formData: FormData, keys: string[]) {
  const values = new Map<string, { en: string; ka: string }>();
  for (const key of keys) {
    values.set(key, { en: "", ka: "" });
  }

  for (const [name, raw] of formData.entries()) {
    if (typeof raw !== "string") continue;
    if (name.includes("__style_")) continue;
    const parsed = parseCmsFormFieldName(name);
    if (!parsed || !values.has(parsed.key)) continue;
    const row = values.get(parsed.key)!;
    row[parsed.lang] = raw;
  }

  return values;
}
