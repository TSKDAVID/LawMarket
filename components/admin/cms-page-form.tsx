"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { SitePage, SitePageSection } from "@/lib/cms/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CmsEditorShell,
  CmsSectionBlock,
} from "@/components/admin/cms-editor-shell";
import {
  saveSitePage,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const FORM_ID = "cms-page-form";
const initial: CmsState = { error: null };

const emptySection = (): SitePageSection => ({
  title_en: "",
  title_ka: "",
  body_en: "",
  body_ka: "",
});

export function CmsPageForm({
  locale,
  page,
}: {
  locale: string;
  page: SitePage;
}) {
  const t = useTranslations("admin.content");
  const [sections, setSections] = useState<SitePageSection[]>(
    page.sections.length > 0 ? page.sections : [emptySection()]
  );
  const [state, action, pending] = useActionState(saveSitePage, initial);

  const isLegal = page.slug === "terms" || page.slug === "privacy";
  const navSections = [
    { id: "cms-page-meta", label: t("sectionPageMeta") },
    ...(isLegal
      ? [{ id: "cms-page-notice", label: t("sectionLegalNotice") }]
      : []),
    { id: "cms-page-sections", label: t("sections") },
  ];

  return (
    <form id={FORM_ID} action={action}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="slug" value={page.slug} />
      <input type="hidden" name="section_count" value={sections.length} />

      <CmsEditorShell
        formId={FORM_ID}
        sections={navSections}
        pending={pending}
        status={state}
      >
        <div className="space-y-10">
          <CmsSectionBlock id="cms-page-meta" title={t("sectionPageMeta")}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("pageTitleEn")}
                </label>
                <Input name="title_en" defaultValue={page.title_en} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("pageTitleKa")}
                </label>
                <Input name="title_ka" defaultValue={page.title_ka} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("pageSubtitleEn")}
                </label>
                <Input name="subtitle_en" defaultValue={page.subtitle_en} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("pageSubtitleKa")}
                </label>
                <Input name="subtitle_ka" defaultValue={page.subtitle_ka} />
              </div>
            </div>
          </CmsSectionBlock>

          {isLegal && (
            <CmsSectionBlock
              id="cms-page-notice"
              title={t("sectionLegalNotice")}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-xs">
                    {t("noticeEn")}
                  </label>
                  <Textarea
                    name="notice_en"
                    rows={3}
                    defaultValue={page.notice_en}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs">
                    {t("noticeKa")}
                  </label>
                  <Textarea
                    name="notice_ka"
                    rows={3}
                    defaultValue={page.notice_ka}
                  />
                </div>
              </div>
            </CmsSectionBlock>
          )}

          <CmsSectionBlock id="cms-page-sections" title={t("sections")}>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSections((s) => [...s, emptySection()])}
              >
                {t("addSection")}
              </Button>
            </div>

            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-card border border-espresso/8 bg-white/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-espresso/60">
                    Section {index + 1}
                  </p>
                  {sections.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSections((s) => s.filter((_, i) => i !== index))
                      }
                    >
                      {t("removeSection")}
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <Input
                    name={`section_${index}_title_en`}
                    defaultValue={section.title_en}
                    placeholder={t("sectionTitleEn")}
                  />
                  <Input
                    name={`section_${index}_title_ka`}
                    defaultValue={section.title_ka}
                    placeholder={t("sectionTitleKa")}
                  />
                  <Textarea
                    name={`section_${index}_body_en`}
                    rows={4}
                    defaultValue={section.body_en}
                    placeholder={t("sectionBodyEn")}
                  />
                  <Textarea
                    name={`section_${index}_body_ka`}
                    rows={4}
                    defaultValue={section.body_ka}
                    placeholder={t("sectionBodyKa")}
                  />
                </div>
              </div>
            ))}
          </CmsSectionBlock>
        </div>
      </CmsEditorShell>
    </form>
  );
}
