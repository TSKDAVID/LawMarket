"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { SiteSettings, HeroMediaType } from "@/lib/cms/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  saveHeroMedia,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

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
  const [state, action, pending] = useActionState(saveHeroMedia, initial);

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <input type="hidden" name="locale" value={locale} />

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

      <p className="font-body text-sm text-espresso/70">{t("mediaHint")}</p>

      <div>
        <label className="mb-1 block font-mono text-xs">{t("mediaTypeLabel")}</label>
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

      <div>
        <label className="mb-1 block font-mono text-xs">{t("embedUrl")}</label>
        <Input
          name="hero_embed_url"
          defaultValue={settings.hero_embed_url}
          placeholder="https://www.youtube.com/embed/..."
        />
        <p className="mt-1 font-body text-xs text-espresso/60">{t("embedHint")}</p>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
