"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  tone?: "light" | "dark";
};

const labels: Record<string, string> = {
  ka: "ქართ",
  en: "ENG",
};

export function LanguageSwitcher({
  className,
  tone = "light",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-stretch divide-x border font-mono text-[11px] uppercase tracking-[0.12em]",
        dark
          ? "divide-cream/30 border-cream/30"
          : "divide-espresso/25 border-espresso/25",
        className
      )}
      role="group"
      aria-label="Language switcher"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={active}
            className={cn(
              "rounded-none px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burgundy",
              active
                ? dark
                  ? "bg-cream text-espresso"
                  : "bg-espresso text-cream"
                : dark
                  ? "text-cream/75 hover:text-cream"
                  : "text-espresso/70 hover:text-espresso"
            )}
          >
            {labels[loc] ?? loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
