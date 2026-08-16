import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroMediaSlot() {
  const t = useTranslations("home");

  return (
    <div
      className="relative min-h-[16rem] overflow-hidden border-t border-espresso/15 sm:min-h-[20rem] lg:min-h-full lg:border-t-0 lg:border-l"
      aria-label={t("heroMediaLabel")}
    >
      <Image
        src="/images/hero-legal-placeholder.png"
        alt=""
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-espresso/20 to-cream/10"
        aria-hidden="true"
      />
      <div className="paper-grain absolute inset-0 opacity-30 mix-blend-multiply" aria-hidden="true" />

      <div className="relative z-10 flex h-full min-h-[16rem] flex-col justify-between px-6 py-6 sm:min-h-[20rem] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div
          className="flex h-12 w-12 items-center justify-center border border-cream/40 bg-espresso/35 backdrop-blur-[2px]"
          aria-hidden="true"
        >
          <Play className="h-5 w-5 fill-cream/20 text-cream/85" />
        </div>

        <div className="max-w-md space-y-1.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/80 sm:text-xs">
            {t("heroMediaLabel")}
          </p>
          <p className="font-body text-sm leading-relaxed text-cream/75 sm:text-[15px]">
            {t("heroMediaHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
