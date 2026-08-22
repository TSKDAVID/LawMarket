"use client";

import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  composeAccentMarkup,
  countWords,
  HERO_HIGHLIGHT_MAX_WORDS,
  limitWords,
  parseAccentMarkup,
  stripHtmlTags,
} from "@/lib/cms/accent-text";
import type { CmsTextStyle } from "@/lib/cms/text-style";
import { cmsStyleClasses } from "@/lib/cms/text-style";
import { cn } from "@/lib/utils";

type CmsAccentEditorProps = {
  name: string;
  langLabel: string;
  defaultValue: string;
  highlightLabel: string;
  beforeLabel: string;
  afterLabel: string;
  previewLabel: string;
  explain?: string;
  highlightWordLimit?: number;
  highlightWordLimitHint?: string;
  isGeorgian?: boolean;
  previewStyle?: CmsTextStyle;
};

export function CmsAccentEditor({
  name,
  langLabel,
  defaultValue,
  highlightLabel,
  beforeLabel,
  afterLabel,
  previewLabel,
  explain,
  highlightWordLimit = HERO_HIGHLIGHT_MAX_WORDS,
  highlightWordLimitHint,
  isGeorgian = false,
  previewStyle,
}: CmsAccentEditorProps) {
  const initial = useMemo(
    () => parseAccentMarkup(defaultValue),
    [defaultValue]
  );
  const [parts, setParts] = useState(initial);

  useEffect(() => {
    setParts(parseAccentMarkup(defaultValue));
  }, [defaultValue]);

  const composed = composeAccentMarkup(parts);

  function update(field: keyof typeof parts, raw: string) {
    const cleaned = stripHtmlTags(raw);
    setParts((prev) => ({
      ...prev,
      [field]:
        field === "highlight"
          ? limitWords(cleaned, highlightWordLimit)
          : cleaned,
    }));
  }

  const highlightWords = countWords(parts.highlight);

  const highlightPlaceholder = isGeorgian
    ? "ფიქსირებული ფასით"
    : "Fixed-price";
  const beforePlaceholder = isGeorgian
    ? "არასავალდებულო — ტექსტი გამოკვეთამდე"
    : "Optional — text before burgundy";
  const afterPlaceholder = isGeorgian
    ? "იურიდიული დახმარება საქართველოში"
    : "legal help in Georgia";

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-espresso/70">{langLabel}</p>
      {explain && (
        <p className="rounded-card border border-burgundy/15 bg-burgundy-tint/25 px-3 py-2 font-body text-xs leading-relaxed text-espresso/75">
          {explain}
        </p>
      )}
      <input type="hidden" name={name} value={composed} readOnly />

      <div>
        <label className="mb-1 block font-mono text-[11px] text-espresso/65">
          1. {highlightLabel}
        </label>
        <Input
          value={parts.highlight}
          onChange={(e) => update("highlight", e.target.value)}
          placeholder={highlightPlaceholder}
        />
        <p className="mt-1 font-body text-[11px] text-espresso/55">
          {highlightWordLimitHint ?? `Up to ${highlightWordLimit} words`}
          {highlightWords > 0 && (
            <span className="font-mono">
              {" "}
              · {highlightWords}/{highlightWordLimit}
            </span>
          )}
        </p>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[11px] text-espresso/65">
          2. {beforeLabel}
        </label>
        <Input
          value={parts.before}
          onChange={(e) => update("before", e.target.value)}
          placeholder={beforePlaceholder}
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-[11px] text-espresso/65">
          3. {afterLabel}
        </label>
        <Input
          value={parts.after}
          onChange={(e) => update("after", e.target.value)}
          placeholder={afterPlaceholder}
        />
      </div>

      <div className="rounded-card border border-espresso/10 bg-cream/80 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-espresso/50">
          {previewLabel}
        </p>
        <p
          className={cn(
            "mt-1 font-heading text-lg font-semibold leading-snug text-espresso",
            cmsStyleClasses(previewStyle)
          )}
        >
          {parts.before && <span>{parts.before} </span>}
          {parts.highlight ? (
            <span className="text-burgundy">{parts.highlight}</span>
          ) : null}
          {parts.after && <span> {parts.after}</span>}
          {!parts.before && !parts.highlight && !parts.after && (
            <span className="text-espresso/40">—</span>
          )}
        </p>
      </div>
    </div>
  );
}
