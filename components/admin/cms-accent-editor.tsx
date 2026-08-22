"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  composeAccentMarkup,
  parseAccentMarkup,
  stripHtmlTags,
} from "@/lib/cms/accent-text";

type CmsAccentEditorProps = {
  name: string;
  langLabel: string;
  defaultValue: string;
  highlightLabel: string;
  beforeLabel: string;
  afterLabel: string;
  previewLabel: string;
};

export function CmsAccentEditor({
  name,
  langLabel,
  defaultValue,
  highlightLabel,
  beforeLabel,
  afterLabel,
  previewLabel,
}: CmsAccentEditorProps) {
  const initial = useMemo(
    () => parseAccentMarkup(defaultValue),
    [defaultValue]
  );
  const [parts, setParts] = useState(initial);

  const composed = composeAccentMarkup(parts);

  function update(field: keyof typeof parts, raw: string) {
    setParts((prev) => ({ ...prev, [field]: stripHtmlTags(raw) }));
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-espresso/70">{langLabel}</p>
      <input type="hidden" name={name} value={composed} readOnly />

      <div>
        <label className="mb-1 block font-mono text-[11px] text-espresso/65">
          {highlightLabel}
        </label>
        <Input
          value={parts.highlight}
          onChange={(e) => update("highlight", e.target.value)}
          placeholder="Fixed-price"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-[11px] text-espresso/65">
          {beforeLabel}
        </label>
        <Input
          value={parts.before}
          onChange={(e) => update("before", e.target.value)}
          placeholder="Optional text before highlight"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-[11px] text-espresso/65">
          {afterLabel}
        </label>
        <Input
          value={parts.after}
          onChange={(e) => update("after", e.target.value)}
          placeholder="Optional text after highlight"
        />
      </div>

      <div className="rounded-card border border-espresso/10 bg-cream/80 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-espresso/50">
          {previewLabel}
        </p>
        <p className="mt-1 font-heading text-lg font-semibold leading-snug text-espresso">
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
