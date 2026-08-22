export type AccentParts = {
  before: string;
  highlight: string;
  after: string;
};

/** Strip angle-bracket tags from plain text segments. */
export function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

/**
 * Parse a single <accent>…</accent> block from stored CMS copy.
 * Malformed or missing tags fall back to plain text in `after`.
 */
export function parseAccentMarkup(value: string): AccentParts {
  const trimmed = value.trim();
  const match = trimmed.match(/^(.*)<accent>([\s\S]*?)<\/accent>(.*)$/);
  if (!match) {
    return { before: "", highlight: "", after: stripHtmlTags(trimmed) };
  }
  return {
    before: stripHtmlTags(match[1]),
    highlight: stripHtmlTags(match[2]),
    after: stripHtmlTags(match[3]),
  };
}

/** Build stored message value from structured parts. */
export function composeAccentMarkup(parts: AccentParts): string {
  const before = parts.before.trim();
  const highlight = parts.highlight.trim();
  const after = parts.after.trim();

  if (!highlight) {
    return [before, after].filter(Boolean).join(" ").trim();
  }

  const open = before ? `${before} ` : "";
  const close = after ? ` ${after}` : "";
  return `${open}<accent>${highlight}</accent>${close}`.trim();
}

/** Remove HTML-like tags from values that should be plain text only. */
export function sanitizePlainCmsText(value: string) {
  return stripHtmlTags(value);
}
