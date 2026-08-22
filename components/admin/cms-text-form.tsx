"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CMS_CONTENT_GROUPS } from "@/lib/cms/content-groups";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CmsEditorShell,
  CmsSectionBlock,
} from "@/components/admin/cms-editor-shell";
import { CmsAccentEditor } from "@/components/admin/cms-accent-editor";
import {
  saveSiteText,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const FORM_ID = "cms-text-form";
const initial: CmsState = { error: null };

export function CmsTextForm({
  locale,
  values,
}: {
  locale: string;
  values: Record<string, { en: string; ka: string }>;
}) {
  const t = useTranslations("admin.content");
  const [state, action, pending] = useActionState(saveSiteText, initial);

  const navSections = CMS_CONTENT_GROUPS.map((group) => ({
    id: `cms-section-${group.id}`,
    label: group.labelKey ? t(group.labelKey) : group.label,
  }));

  return (
    <form id={FORM_ID} action={action}>
      <input type="hidden" name="locale" value={locale} />

      <CmsEditorShell
        formId={FORM_ID}
        sections={navSections}
        pending={pending}
        status={state}
      >
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
                    {field.format === "accent" ? (
                      <>
                        <CmsAccentEditor
                          name={`${field.key}__en`}
                          langLabel={t("english")}
                          defaultValue={values[field.key]?.en ?? ""}
                          highlightLabel={t("accentHighlight")}
                          beforeLabel={t("accentBefore")}
                          afterLabel={t("accentAfter")}
                          previewLabel={t("accentPreview")}
                          highlightWordLimitHint={t("accentHighlightLimit")}
                        />
                        <CmsAccentEditor
                          name={`${field.key}__ka`}
                          langLabel={t("georgian")}
                          defaultValue={values[field.key]?.ka ?? ""}
                          highlightLabel={t("accentHighlight")}
                          beforeLabel={t("accentBefore")}
                          afterLabel={t("accentAfter")}
                          previewLabel={t("accentPreview")}
                          highlightWordLimitHint={t("accentHighlightLimit")}
                        />
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="mb-1 block font-mono text-xs text-espresso/70">
                            {t("english")}
                          </label>
                          {field.multiline ? (
                            <Textarea
                              name={`${field.key}__en`}
                              rows={3}
                              defaultValue={values[field.key]?.en ?? ""}
                            />
                          ) : (
                            <Input
                              name={`${field.key}__en`}
                              defaultValue={values[field.key]?.en ?? ""}
                            />
                          )}
                        </div>
                        <div>
                          <label className="mb-1 block font-mono text-xs text-espresso/70">
                            {t("georgian")}
                          </label>
                          {field.multiline ? (
                            <Textarea
                              name={`${field.key}__ka`}
                              rows={3}
                              defaultValue={values[field.key]?.ka ?? ""}
                            />
                          ) : (
                            <Input
                              name={`${field.key}__ka`}
                              defaultValue={values[field.key]?.ka ?? ""}
                            />
                          )}
                        </div>
                      </>
                    )}
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
