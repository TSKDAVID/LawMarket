"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CMS_CONTENT_GROUPS } from "@/lib/cms/content-groups";
import { cmsFormFieldName } from "@/lib/cms/form-fields";
import type { CmsTextFieldValues } from "@/lib/cms/admin-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CmsEditorShell,
  CmsSectionBlock,
} from "@/components/admin/cms-editor-shell";
import { CmsAccentEditor } from "@/components/admin/cms-accent-editor";
import {
  CmsStylePreview,
  CmsStyleToolbar,
} from "@/components/admin/cms-style-picker";
import {
  cmsEditorFieldClasses,
  cmsStyleSeed,
  mergeCmsTextStyle,
  type CmsTextStyle,
} from "@/lib/cms/text-style";
import { cn } from "@/lib/utils";
import {
  saveSiteText,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const FORM_ID = "cms-text-form";
const initial: CmsState = { error: null };

function CmsLangColumn({
  fieldKey,
  lang,
  langLabel,
  multiline,
  values,
  isAccent,
  accentLabels,
  previewLabel,
}: {
  fieldKey: string;
  lang: "en" | "ka";
  langLabel: string;
  multiline?: boolean;
  values: CmsTextFieldValues;
  isAccent?: boolean;
  accentLabels?: {
    highlight: string;
    before: string;
    after: string;
    preview: string;
    highlightLimit: string;
    explain: string;
  };
  previewLabel: string;
}) {
  const textValue = values[lang === "en" ? "en" : "ka"];
  const styleValue = values[lang === "en" ? "style_en" : "style_ka"];
  const styleSeed = cmsStyleSeed(styleValue);

  const [liveText, setLiveText] = useState(textValue);
  const [liveStyle, setLiveStyle] = useState(() => mergeCmsTextStyle(styleValue));

  useEffect(() => {
    setLiveText(textValue);
  }, [textValue]);

  useEffect(() => {
    setLiveStyle(mergeCmsTextStyle(styleValue));
  }, [styleSeed, styleValue]);

  if (isAccent && accentLabels) {
    return (
      <div>
        <CmsAccentEditor
          key={`${fieldKey}-accent-${lang}-${textValue}`}
          name={cmsFormFieldName(fieldKey, lang)}
          langLabel={langLabel}
          defaultValue={textValue}
          highlightLabel={accentLabels.highlight}
          beforeLabel={accentLabels.before}
          afterLabel={accentLabels.after}
          previewLabel={accentLabels.preview}
          highlightWordLimitHint={accentLabels.highlightLimit}
          explain={accentLabels.explain}
          isGeorgian={lang === "ka"}
          previewStyle={liveStyle}
          contentKey={fieldKey}
        />
        <CmsStyleToolbar
          contentKey={fieldKey}
          lang={lang}
          defaultStyle={styleValue}
          styleSeed={styleSeed}
          onStyleChange={setLiveStyle}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-espresso/70">
        {langLabel}
      </label>
      {multiline ? (
        <Textarea
          name={cmsFormFieldName(fieldKey, lang)}
          rows={3}
          value={liveText}
          onChange={(e) => setLiveText(e.target.value)}
          className={cn(cmsEditorFieldClasses(liveStyle, fieldKey))}
        />
      ) : (
        <Input
          name={cmsFormFieldName(fieldKey, lang)}
          value={liveText}
          onChange={(e) => setLiveText(e.target.value)}
          className={cn(cmsEditorFieldClasses(liveStyle, fieldKey))}
        />
      )}
      <CmsStylePreview
        text={liveText}
        style={liveStyle}
        label={previewLabel}
        contentKey={fieldKey}
      />
      <CmsStyleToolbar
        contentKey={fieldKey}
        lang={lang}
        defaultStyle={styleValue}
        styleSeed={styleSeed}
        onStyleChange={setLiveStyle}
      />
    </div>
  );
}

export function CmsTextForm({
  locale,
  values,
}: {
  locale: string;
  values: Record<string, CmsTextFieldValues>;
}) {
  const t = useTranslations("admin.content");
  const router = useRouter();
  const [state, action] = useActionState(saveSiteText, initial);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state.ok, router]);

  const navSections = CMS_CONTENT_GROUPS.map((group) => ({
    id: `cms-section-${group.id}`,
    label: group.labelKey ? t(group.labelKey) : group.label,
  }));

  const accentLabels = {
    highlight: t("accentHighlight"),
    before: t("accentBefore"),
    after: t("accentAfter"),
    preview: t("accentPreview"),
    highlightLimit: t("accentHighlightLimit"),
    explain: t("accentHeadlineExplain"),
  };

  return (
    <form id={FORM_ID} action={action}>
      <input type="hidden" name="locale" value={locale} />

      <CmsEditorShell sections={navSections} status={state}>
        <div className="space-y-10">
          {CMS_CONTENT_GROUPS.map((group) => (
            <CmsSectionBlock
              key={group.id}
              id={`cms-section-${group.id}`}
              title={group.labelKey ? t(group.labelKey) : group.label}
            >
              {group.fields.map((field) => (
                <div
                  key={field.key}
                  className="rounded-card border border-espresso/8 bg-white/40 p-4"
                >
                  <p className="font-mono text-xs text-espresso/60">{field.key}</p>
                  <p className="mt-1 font-heading text-sm font-semibold text-espresso">
                    {field.label}
                  </p>
                  {field.hint && (
                    <p className="mt-1 font-body text-xs text-espresso/60">
                      {field.hint}
                    </p>
                  )}
                  <div className="mt-3 grid gap-4 lg:grid-cols-2">
                    <CmsLangColumn
                      fieldKey={field.key}
                      lang="en"
                      langLabel={t("english")}
                      multiline={field.multiline}
                      values={values[field.key]}
                      isAccent={field.format === "accent"}
                      accentLabels={
                        field.format === "accent" ? accentLabels : undefined
                      }
                      previewLabel={t("stylePreview")}
                    />
                    <CmsLangColumn
                      fieldKey={field.key}
                      lang="ka"
                      langLabel={t("georgian")}
                      multiline={field.multiline}
                      values={values[field.key]}
                      isAccent={field.format === "accent"}
                      accentLabels={
                        field.format === "accent" ? accentLabels : undefined
                      }
                      previewLabel={t("stylePreview")}
                    />
                  </div>
                </div>
              ))}
            </CmsSectionBlock>
          ))}
        </div>
      </CmsEditorShell>
    </form>
  );
}
