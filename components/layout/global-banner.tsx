import { useTranslations } from "next-intl";

export function GlobalBanner({ visible = true }: { visible?: boolean }) {
  const t = useTranslations("common");

  if (!visible) return null;

  return (
    <div className="w-full border-b border-espresso bg-burgundy">
      <p className="flex items-center justify-center px-4 py-2.5 text-center font-mono text-sm leading-snug tracking-wide text-cream">
        {t("banner")}
      </p>
    </div>
  );
}
