import { useTranslations } from "next-intl";
import {
  CmsStyledText,
  hasCmsTextOverride,
  useCmsText,
} from "@/components/cms/cms-style-provider";
import type { SiteSettings } from "@/lib/cms/types";

export type HeroMediaSettings = Pick<
  SiteSettings,
  | "hero_media_type"
  | "hero_media_url"
  | "hero_poster_url"
  | "hero_embed_url"
>;

type HeroMediaSlotProps = {
  settings: HeroMediaSettings;
};

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function HeroMediaSlot({ settings }: HeroMediaSlotProps) {
  const t = useTranslations("home");
  const mediaLabel = useCmsText("home.heroMediaLabel", t("heroMediaLabel"));
  const labelOverridden = hasCmsTextOverride("home.heroMediaLabel");
  const showLabel = labelOverridden ? mediaLabel.trim().length > 0 : true;
  const accessibleName = showLabel ? mediaLabel : t("heroMediaLabel");
  const { hero_media_type, hero_media_url, hero_poster_url, hero_embed_url } =
    settings;

  const mediaUrl = hero_media_url;
  const posterUrl = hero_poster_url;
  const embedUrl = hero_embed_url || (isExternalUrl(mediaUrl) ? mediaUrl : "");

  return (
    <div
      className="relative min-h-[20rem] overflow-hidden border-t border-espresso/15 bg-espresso sm:min-h-[22rem] lg:min-h-0 lg:h-full lg:border-t-0 lg:border-l"
      aria-label={accessibleName}
    >
      {hero_media_type === "none" ? (
        <div
          className="absolute inset-0 bg-espresso"
          style={
            posterUrl
              ? {
                  backgroundImage: `url(${posterUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
      ) : hero_media_type === "embed" && embedUrl ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={accessibleName}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : hero_media_type === "image" && mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl}
          alt={accessibleName}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : hero_media_type === "video" && mediaUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          poster={posterUrl || undefined}
        >
          {isExternalUrl(mediaUrl) ? (
            <source src={mediaUrl} />
          ) : (
            <source src={mediaUrl} type="video/mp4" />
          )}
        </video>
      ) : (
        <div className="absolute inset-0 bg-espresso" />
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-espresso/35 to-transparent"
        aria-hidden="true"
      />

      {showLabel ? (
        <CmsStyledText
          contentKey="home.heroMediaLabel"
          as="p"
          className="pointer-events-none absolute left-6 top-5 z-10 max-w-[min(100%,22rem)] font-mono text-[11px] uppercase leading-snug tracking-[0.14em] text-cream/90 sm:left-8 sm:top-6 sm:text-xs lg:left-10"
        >
          {t("heroMediaLabel")}
        </CmsStyledText>
      ) : null}
    </div>
  );
}
