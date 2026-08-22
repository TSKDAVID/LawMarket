"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { SiteSettings, HeroMediaType } from "@/lib/cms/types";
import { Input } from "@/components/ui/input";
import {
  CmsEditorShell,
  CmsSectionBlock,
} from "@/components/admin/cms-editor-shell";
import {
  saveHeroMedia,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const FORM_ID = "cms-media-form";
const initial: CmsState = { error: null };
const MEDIA_TYPES: HeroMediaType[] = ["video", "image", "embed", "none"];

export function CmsMediaForm({
  locale,
  settings,
}: {
  locale: string;
  settings: SiteSettings;
}) {
  const t = useTranslations("admin.content");
  const [state, action] = useActionState(saveHeroMedia, initial);

  const navSections = [
    { id: "cms-media-setup", label: t("sectionMediaSetup") },
    { id: "cms-media-poster", label: t("sectionMediaPoster") },
    { id: "cms-media-embed", label: t("sectionMediaEmbed") },
  ];

  return (
    <form id={FORM_ID} action={action}>
      <input type="hidden" name="locale" value={locale} />

      <CmsEditorShell sections={navSections} status={state}>
        <div className="space-y-10">
          <CmsSectionBlock id="cms-media-setup" title={t("sectionMediaSetup")}>
            <p className="font-body text-sm text-espresso/70">{t("mediaHint")}</p>
            <div>
              <label className="mb-1 block font-mono text-xs">
                {t("mediaTypeLabel")}
              </label>
              <select
                name="hero_media_type"
                defaultValue={settings.hero_media_type}
                className="w-full rounded-card border border-espresso/15 bg-white px-3 py-2 font-body text-sm"
              >
                {MEDIA_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs">{t("mediaUrl")}</label>
              <Input
                name="hero_media_url"
                defaultValue={settings.hero_media_url}
                placeholder="/videos/hero.mp4 or https://..."
              />
              <label className="mt-2 block font-mono text-xs">{t("mediaUpload")}</label>
              <Input type="file" name="hero_media_file" accept="video/*,image/*" />
            </div>
          </CmsSectionBlock>

          <CmsSectionBlock id="cms-media-poster" title={t("sectionMediaPoster")}>
            <div>
              <label className="mb-1 block font-mono text-xs">{t("posterUrl")}</label>
              <Input
                name="hero_poster_url"
                defaultValue={settings.hero_poster_url}
                placeholder="/images/hero-poster.png"
              />
              <label className="mt-2 block font-mono text-xs">{t("posterUpload")}</label>
              <Input type="file" name="hero_poster_file" accept="image/*" />
            </div>
          </CmsSectionBlock>

          <CmsSectionBlock id="cms-media-embed" title={t("sectionMediaEmbed")}>
            <div>
              <label className="mb-1 block font-mono text-xs">{t("embedUrl")}</label>
              <Input
                name="hero_embed_url"
                defaultValue={settings.hero_embed_url}
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="mt-1 font-body text-xs text-espresso/60">
                {t("embedHint")}
              </p>
            </div>
          </CmsSectionBlock>
        </div>
      </CmsEditorShell>
    </form>
  );
}
