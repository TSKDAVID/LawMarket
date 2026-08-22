"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { SitePage, SitePageSection } from "@/lib/cms/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  saveSitePage,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

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

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="slug" value={page.slug} />
      <input type="hidden" name="section_count" value={sections.length} />

      {state.ok && (
        <p className="rounded-card border border-burgundy/20 bg-burgundy-tint/40 px-4 py-3 font-body text-sm text-burgundy-dark">
          {t("saved")}
        </p>
      )}
      {state.error && (
        <p className="rounded-card border border-burgundy/30 bg-burgundy-tint/50 px-4 py-3 font-body text-sm text-burgundy-dark">
          {t(state.error)}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs">{t("pageTitleEn")}</label>
          <Input name="title_en" defaultValue={page.title_en} />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs">{t("pageTitleKa")}</label>
          <Input name="title_ka" defaultValue={page.title_ka} />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs">{t("pageSubtitleEn")}</label>
          <Input name="subtitle_en" defaultValue={page.subtitle_en} />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs">{t("pageSubtitleKa")}</label>
          <Input name="subtitle_ka" defaultValue={page.subtitle_ka} />
        </div>
      </div>

      {(page.slug === "terms" || page.slug === "privacy") && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs">{t("noticeEn")}</label>
            <Textarea name="notice_en" rows={3} defaultValue={page.notice_en} />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs">{t("noticeKa")}</label>
            <Textarea name="notice_ka" rows={3} defaultValue={page.notice_ka} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold text-espresso">
            {t("sections")}
          </h2>
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
            className="rounded-card border border-espresso/10 bg-white/50 p-4 space-y-3"
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
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
