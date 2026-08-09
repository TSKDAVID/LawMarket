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

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 font-body text-xs font-medium",
        tone === "dark"
          ? "border-cream/25 text-cream/70"
          : "border-espresso/15 text-espresso/60",
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
              "rounded-full px-3 py-1.5 transition-colors",
              active
                ? tone === "dark"
                  ? "bg-cream text-espresso"
                  : "bg-espresso text-cream"
                : "hover:text-inherit"
            )}
          >
            {labels[loc] ?? loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
