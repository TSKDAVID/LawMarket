"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/lib/actions/locale";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const toggle = (target: string) => {
    if (target === locale) return;
    startTransition(() => setLocale(target));
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-slate-200 p-0.5 text-xs font-semibold",
        isPending && "opacity-50",
      )}
    >
      {["ka", "en"].map((l) => (
        <button
          key={l}
          onClick={() => toggle(l)}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            locale === l
              ? "bg-brand-900 text-white"
              : "text-slate-500 hover:text-slate-900",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
