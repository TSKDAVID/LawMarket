"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { barePath, localeHref } from "@/lib/routes";
import type { Locale } from "@/schemas";

/**
 * The `ქარ / ENG` document annotation (BRAND.md §7): mono, active language
 * underlined, preserves the current route (and query). No flags, no globes.
 */
function SwitcherInner({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const bare = barePath(pathname);
  const suffix = query ? `?${query}` : "";

  const item = (target: Locale, text: string) => {
    const active = target === locale;
    return active ? (
      <span aria-current="true" className="underline decoration-1 underline-offset-[5px]">
        {text}
      </span>
    ) : (
      <Link
        href={`${localeHref(target, bare)}${suffix}`}
        hrefLang={target}
        lang={target}
        className="opacity-60 transition-opacity duration-150 ease-out hover:opacity-100 hover:underline hover:underline-offset-[5px]"
      >
        {text}
      </Link>
    );
  };

  return (
    <span
      aria-label={label}
      className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] tracking-[0.08em]"
    >
      {item("ka", "ქარ")}
      <span aria-hidden="true" className="opacity-40">
        /
      </span>
      {item("en", "ENG")}
    </span>
  );
}

export function LangSwitcher(props: { locale: Locale; label: string }) {
  return (
    <Suspense
      fallback={
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] tracking-[0.08em]">
          <span>ქარ</span>
          <span className="opacity-40">/</span>
          <span>ENG</span>
        </span>
      }
    >
      <SwitcherInner {...props} />
    </Suspense>
  );
}
