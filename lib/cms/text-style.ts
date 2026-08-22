import { cn } from "@/lib/utils";

export const CMS_TEXT_COLORS = [
  "inherit",
  "default",
  "burgundy",
  "espresso",
  "cream",
  "brass",
  "muted",
] as const;

export const CMS_TEXT_SIZES = [
  "inherit",
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "hero",
] as const;

export const CMS_TEXT_WEIGHTS = ["inherit", "normal", "medium", "semibold"] as const;

export const CMS_TEXT_ALIGNS = ["inherit", "left", "center", "right"] as const;

export type CmsTextColor = (typeof CMS_TEXT_COLORS)[number];
export type CmsTextSize = (typeof CMS_TEXT_SIZES)[number];
export type CmsTextWeight = (typeof CMS_TEXT_WEIGHTS)[number];
export type CmsTextAlign = (typeof CMS_TEXT_ALIGNS)[number];

export type CmsTextStyle = {
  color?: CmsTextColor;
  size?: CmsTextSize;
  weight?: CmsTextWeight;
  align?: CmsTextAlign;
};

const COLOR_CLASS: Record<Exclude<CmsTextColor, "inherit">, string> = {
  default: "text-espresso",
  burgundy: "text-burgundy",
  espresso: "text-espresso",
  cream: "text-cream",
  brass: "text-brass",
  muted: "text-espresso/70",
};

const SIZE_CLASS: Record<Exclude<CmsTextSize, "inherit">, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  hero: "text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1]",
};

const WEIGHT_CLASS: Record<Exclude<CmsTextWeight, "inherit">, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
};

const ALIGN_CLASS: Record<Exclude<CmsTextAlign, "inherit">, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/** Typography when CMS style is "inherit" (page default) for specific keys. */
export const CMS_FIELD_STYLE_DEFAULTS: Partial<Record<string, CmsTextStyle>> = {
  "home.heroTitle": {
    size: "hero",
    weight: "semibold",
    color: "default",
  },
};

function resolveStyleProp(
  style: CmsTextStyle | undefined,
  defaults: CmsTextStyle | undefined,
  prop: "color"
): CmsTextColor | null;
function resolveStyleProp(
  style: CmsTextStyle | undefined,
  defaults: CmsTextStyle | undefined,
  prop: "size"
): CmsTextSize | null;
function resolveStyleProp(
  style: CmsTextStyle | undefined,
  defaults: CmsTextStyle | undefined,
  prop: "weight"
): CmsTextWeight | null;
function resolveStyleProp(
  style: CmsTextStyle | undefined,
  defaults: CmsTextStyle | undefined,
  prop: "align"
): CmsTextAlign | null;
function resolveStyleProp(
  style: CmsTextStyle | undefined,
  defaults: CmsTextStyle | undefined,
  prop: keyof CmsTextStyle
): CmsTextColor | CmsTextSize | CmsTextWeight | CmsTextAlign | null {
  const value = style?.[prop];
  if (value && value !== "inherit") return value;
  const fallback = defaults?.[prop];
  if (fallback && fallback !== "inherit") return fallback;
  return null;
}

export function normalizeCmsTextStyle(raw: unknown): CmsTextStyle {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const style: CmsTextStyle = {};

  if (
    typeof obj.color === "string" &&
    CMS_TEXT_COLORS.includes(obj.color as CmsTextColor)
  ) {
    style.color = obj.color as CmsTextColor;
  }
  if (
    typeof obj.size === "string" &&
    CMS_TEXT_SIZES.includes(obj.size as CmsTextSize)
  ) {
    style.size = obj.size as CmsTextSize;
  }
  if (
    typeof obj.weight === "string" &&
    CMS_TEXT_WEIGHTS.includes(obj.weight as CmsTextWeight)
  ) {
    style.weight = obj.weight as CmsTextWeight;
  }
  if (
    typeof obj.align === "string" &&
    CMS_TEXT_ALIGNS.includes(obj.align as CmsTextAlign)
  ) {
    style.align = obj.align as CmsTextAlign;
  }

  return style;
}

export function cmsStyleClasses(
  style: CmsTextStyle | undefined,
  contentKey?: string
) {
  const defaults = contentKey ? CMS_FIELD_STYLE_DEFAULTS[contentKey] : undefined;
  const color = resolveStyleProp(style, defaults, "color");
  const size = resolveStyleProp(style, defaults, "size");
  const weight = resolveStyleProp(style, defaults, "weight");
  const align = resolveStyleProp(style, defaults, "align");

  return cn(
    color && color !== "inherit" ? COLOR_CLASS[color] : null,
    size && size !== "inherit" ? SIZE_CLASS[size] : null,
    weight && weight !== "inherit" ? WEIGHT_CLASS[weight] : null,
    align && align !== "inherit" ? ALIGN_CLASS[align] : null
  );
}

/** Admin text fields — never apply CMS text color (cream on white looks empty). */
export function cmsEditorFieldClasses(
  style: CmsTextStyle | undefined,
  contentKey?: string
) {
  return cmsStyleClasses({ ...mergeCmsTextStyle(style), color: "inherit" }, contentKey);
}

export function readCmsTextStyleFormData(
  formData: FormData,
  key: string,
  lang: "en" | "ka"
): CmsTextStyle {
  const color = String(
    formData.get(cmsStyleFieldName(key, lang, "color")) ?? "inherit"
  );
  const size = String(
    formData.get(cmsStyleFieldName(key, lang, "size")) ?? "inherit"
  );
  const weight = String(
    formData.get(cmsStyleFieldName(key, lang, "weight")) ?? "inherit"
  );
  const align = String(
    formData.get(cmsStyleFieldName(key, lang, "align")) ?? "inherit"
  );

  const style: CmsTextStyle = {};
  if (CMS_TEXT_COLORS.includes(color as CmsTextColor) && color !== "inherit") {
    style.color = color as CmsTextColor;
  }
  if (CMS_TEXT_SIZES.includes(size as CmsTextSize) && size !== "inherit") {
    style.size = size as CmsTextSize;
  }
  if (CMS_TEXT_WEIGHTS.includes(weight as CmsTextWeight) && weight !== "inherit") {
    style.weight = weight as CmsTextWeight;
  }
  if (CMS_TEXT_ALIGNS.includes(align as CmsTextAlign) && align !== "inherit") {
    style.align = align as CmsTextAlign;
  }
  return style;
}

export function cmsStyleFieldName(
  key: string,
  lang: "en" | "ka",
  prop: keyof CmsTextStyle
) {
  return `${key.replace(/\./g, "__")}__style_${prop}__${lang}`;
}

/** Hex / CSS for admin color swatches (excludes inherit). */
export const CMS_COLOR_SWATCH: Record<
  Exclude<CmsTextColor, "inherit" | "default">,
  string
> = {
  burgundy: "var(--color-burgundy)",
  espresso: "var(--color-espresso)",
  cream: "var(--color-cream)",
  brass: "var(--color-brass)",
  muted: "#6b5d54",
};

export const CMS_COLOR_SWATCH_DEFAULT = "var(--color-espresso)";

export function defaultCmsTextStyle(): CmsTextStyle {
  return {
    color: "inherit",
    size: "inherit",
    weight: "inherit",
    align: "inherit",
  };
}

export function mergeCmsTextStyle(style: CmsTextStyle | undefined): CmsTextStyle {
  return {
    ...defaultCmsTextStyle(),
    ...style,
  };
}

export function cmsStyleSeed(style: CmsTextStyle | undefined) {
  const merged = mergeCmsTextStyle(style);
  return `${merged.color}-${merged.size}-${merged.weight}-${merged.align}`;
}
