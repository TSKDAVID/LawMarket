"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { CmsTextColor, CmsTextStyle } from "@/lib/cms/text-style";
import {
  CMS_COLOR_SWATCH,
  CMS_COLOR_SWATCH_DEFAULT,
  CMS_FIELD_STYLE_DEFAULTS,
  CMS_TEXT_ALIGNS,
  CMS_TEXT_COLORS,
  CMS_TEXT_SIZES,
  CMS_TEXT_WEIGHTS,
  cmsStyleClasses,
  cmsStyleFieldName,
  mergeCmsTextStyle,
} from "@/lib/cms/text-style";
import { cn } from "@/lib/utils";

type CmsStyleToolbarProps = {
  contentKey: string;
  lang: "en" | "ka";
  defaultStyle: CmsTextStyle;
  styleSeed: string;
  onStyleChange?: (style: CmsTextStyle) => void;
};

function swatchFor(color: CmsTextColor) {
  if (color === "inherit" || color === "default") return CMS_COLOR_SWATCH_DEFAULT;
  return CMS_COLOR_SWATCH[color as keyof typeof CMS_COLOR_SWATCH] ?? CMS_COLOR_SWATCH_DEFAULT;
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-9 items-center gap-2 border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors",
        active
          ? "border-burgundy bg-burgundy-tint/50 text-espresso"
          : "border-espresso/20 bg-white text-espresso/80 hover:border-espresso/40 hover:bg-cream"
      )}
      aria-label={label}
    >
      {children}
      <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
    </button>
  );
}

function PopoverPanel({
  open,
  anchorRef,
  onClose,
  children,
  className,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (anchorRef.current?.contains(e.target as Node)) return;
      onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute bottom-full left-0 z-50 mb-2 min-w-[12rem] border-2 border-espresso bg-white p-2 shadow-[4px_4px_0_0_var(--color-espresso)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CmsStyleToolbar({
  contentKey,
  lang,
  defaultStyle,
  styleSeed,
  onStyleChange,
}: CmsStyleToolbarProps) {
  const t = useTranslations("admin.content");
  const [style, setStyle] = useState(() => mergeCmsTextStyle(defaultStyle));
  const [openMenu, setOpenMenu] = useState<
    null | "color" | "size" | "weight" | "align"
  >(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const merged = mergeCmsTextStyle(defaultStyle);
    setStyle(merged);
    onStyleChange?.(merged);
    // styleSeed encodes defaultStyle; onStyleChange is stable from parent setState
  }, [styleSeed, defaultStyle]);

  function update(patch: Partial<CmsTextStyle>) {
    const next = mergeCmsTextStyle({ ...style, ...patch });
    setStyle(next);
    onStyleChange?.(next);
    setOpenMenu(null);
  }

  const color = style.color ?? "inherit";
  const size = style.size ?? "inherit";
  const weight = style.weight ?? "inherit";
  const align = style.align ?? "inherit";

  const fieldDefaults = CMS_FIELD_STYLE_DEFAULTS[contentKey];
  const displaySize =
    size === "inherit" && fieldDefaults?.size && fieldDefaults.size !== "inherit"
      ? fieldDefaults.size
      : size;

  return (
    <div className="mt-3 space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-espresso/50">
        {t("styleTypography")}
      </p>

      <input
        type="hidden"
        name={cmsStyleFieldName(contentKey, lang, "color")}
        value={color}
        readOnly
      />
      <input
        type="hidden"
        name={cmsStyleFieldName(contentKey, lang, "size")}
        value={size}
        readOnly
      />
      <input
        type="hidden"
        name={cmsStyleFieldName(contentKey, lang, "weight")}
        value={weight}
        readOnly
      />
      <input
        type="hidden"
        name={cmsStyleFieldName(contentKey, lang, "align")}
        value={align}
        readOnly
      />

      <div ref={wrapRef} className="relative flex flex-wrap gap-2">
        <div className="relative">
          <ToolbarButton
            label={t("styleColor")}
            active={openMenu === "color"}
            onClick={() =>
              setOpenMenu((m) => (m === "color" ? null : "color"))
            }
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full border border-espresso/25"
              style={{ backgroundColor: swatchFor(color) }}
              aria-hidden="true"
            />
            <span>{t(`styleColor_${color}`)}</span>
          </ToolbarButton>
          <PopoverPanel
            open={openMenu === "color"}
            anchorRef={wrapRef}
            onClose={() => setOpenMenu(null)}
            className="min-w-[14rem]"
          >
            <ul className="grid grid-cols-2 gap-1">
              {CMS_TEXT_COLORS.map((value) => (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => update({ color: value })}
                    className={cn(
                      "flex w-full items-center gap-2 px-2 py-1.5 text-left font-body text-xs transition-colors hover:bg-cream",
                      color === value && "bg-burgundy-tint/40"
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 shrink-0 rounded-full border border-espresso/20",
                        value === "inherit" && "border-dashed bg-white"
                      )}
                      style={
                        value === "inherit"
                          ? undefined
                          : { backgroundColor: swatchFor(value) }
                      }
                      aria-hidden="true"
                    />
                    {t(`styleColor_${value}`)}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </div>

        <div className="relative">
          <ToolbarButton
            label={t("styleSize")}
            active={openMenu === "size"}
            onClick={() =>
              setOpenMenu((m) => (m === "size" ? null : "size"))
            }
          >
            <Type className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t(`styleSize_${displaySize}`)}</span>
          </ToolbarButton>
          <PopoverPanel
            open={openMenu === "size"}
            anchorRef={wrapRef}
            onClose={() => setOpenMenu(null)}
          >
            <ul className="space-y-0.5">
              {CMS_TEXT_SIZES.map((value) => (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => update({ size: value })}
                    className={cn(
                      "w-full px-2 py-1.5 text-left font-body text-xs hover:bg-cream",
                      size === value && "bg-burgundy-tint/40 font-medium"
                    )}
                  >
                    {t(`styleSize_${value}`)}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </div>

        <div className="relative">
          <ToolbarButton
            label={t("styleWeight")}
            active={openMenu === "weight"}
            onClick={() =>
              setOpenMenu((m) => (m === "weight" ? null : "weight"))
            }
          >
            <span className="font-heading text-sm font-semibold leading-none">
              B
            </span>
            <span>{t(`styleWeight_${weight}`)}</span>
          </ToolbarButton>
          <PopoverPanel
            open={openMenu === "weight"}
            anchorRef={wrapRef}
            onClose={() => setOpenMenu(null)}
          >
            <ul className="space-y-0.5">
              {CMS_TEXT_WEIGHTS.map((value) => (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => update({ weight: value })}
                    className={cn(
                      "w-full px-2 py-1.5 text-left font-body text-xs hover:bg-cream",
                      weight === value && "bg-burgundy-tint/40 font-medium",
                      value === "semibold" && "font-semibold",
                      value === "medium" && "font-medium"
                    )}
                  >
                    {t(`styleWeight_${value}`)}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </div>

        <div className="relative">
          <ToolbarButton
            label={t("styleAlign")}
            active={openMenu === "align"}
            onClick={() =>
              setOpenMenu((m) => (m === "align" ? null : "align"))
            }
          >
            {align === "center" ? (
              <AlignCenter className="h-3.5 w-3.5" aria-hidden="true" />
            ) : align === "right" ? (
              <AlignRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <AlignLeft className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{t(`styleAlign_${align}`)}</span>
          </ToolbarButton>
          <PopoverPanel
            open={openMenu === "align"}
            anchorRef={wrapRef}
            onClose={() => setOpenMenu(null)}
          >
            <ul className="space-y-0.5">
              {CMS_TEXT_ALIGNS.map((value) => (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => update({ align: value })}
                    className={cn(
                      "w-full px-2 py-1.5 text-left font-body text-xs hover:bg-cream",
                      align === value && "bg-burgundy-tint/40 font-medium"
                    )}
                  >
                    {t(`styleAlign_${value}`)}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </div>
      </div>
    </div>
  );
}

export function CmsStylePreview({
  text,
  style,
  label,
  contentKey,
}: {
  text: string;
  style: CmsTextStyle;
  label: string;
  contentKey?: string;
}) {
  const previewColor = style.color ?? "inherit";
  const onDark = previewColor === "cream";

  return (
    <div
      className={cn(
        "mt-2 rounded-card border px-3 py-2.5",
        onDark ? "border-espresso/30 bg-espresso" : "border-espresso/15 bg-cream"
      )}
    >
      <p
        className={cn(
          "font-mono text-[10px] uppercase tracking-widest",
          onDark ? "text-cream/50" : "text-espresso/45"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-body leading-relaxed break-words",
          onDark ? "text-cream" : "text-espresso",
          cmsStyleClasses(style, contentKey)
        )}
      >
        {text.trim() || "—"}
      </p>
    </div>
  );
}

/** @deprecated Use CmsStyleToolbar */
export const CmsStylePicker = CmsStyleToolbar;
