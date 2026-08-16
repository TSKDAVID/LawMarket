import { useTranslations } from "next-intl";

const HERO_VIDEO_SRC = "/videos/hero-breakdown.mp4";

export function HeroMediaSlot() {
  const t = useTranslations("home");

  return (
    <div
      className="relative min-h-[20rem] overflow-hidden border-t border-espresso/15 bg-espresso sm:min-h-[22rem] lg:min-h-0 lg:h-full lg:border-t-0 lg:border-l"
      aria-label={t("heroMediaLabel")}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
        poster="/images/hero-legal-placeholder.png"
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-espresso/35 to-transparent"
        aria-hidden="true"
      />

      <p
        className="pointer-events-none absolute left-6 top-5 z-10 max-w-[14rem] font-mono text-[11px] uppercase leading-snug tracking-[0.14em] text-cream/90 sm:left-8 sm:top-6 sm:text-xs lg:left-10"
      >
        {t("heroMediaLabel")}
      </p>
    </div>
  );
}
