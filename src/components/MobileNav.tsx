"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { localeHref } from "@/lib/routes";
import type { Locale } from "@/schemas";
import type { NavItem } from "@/components/NavLinks";
import { Wordmark } from "@/components/Wordmark";
import { Seal } from "@/components/Seal";

/**
 * Mobile navigation as a full-screen espresso document index (numbered
 * entries, hairline rules) — not a drawer with gray dividers.
 */
export function MobileNav({
  locale,
  items,
  openLabel,
  closeLabel,
  guaranteeLine,
}: {
  locale: Locale;
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
  guaranteeLine: string;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="min-h-[44px] px-1 font-mono text-[0.75rem] tracking-[0.14em] text-paper/90 transition-colors duration-150 hover:text-paper"
      >
        {openLabel}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openLabel}
          className="band-espresso fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper"
        >
          <div className="flex items-center justify-between px-5 pt-3.5 pb-3">
            <Link
              href={localeHref(locale, "/")}
              onClick={() => setOpen(false)}
              className="text-[1.1rem] text-paper"
            >
              <Wordmark />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-[44px] px-1 font-mono text-[0.75rem] tracking-[0.14em] text-paper/90"
            >
              {closeLabel} ×
            </button>
          </div>
          <hr className="border-0 border-t border-paper/25" />

          <nav className="flex-1 px-5">
            <ul>
              {items.map((item, index) => (
                <li key={item.href} className="border-b border-paper/20">
                  <Link
                    href={localeHref(locale, item.href)}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-4"
                  >
                    <span className="font-mono text-[0.75rem] tracking-[0.1em] text-paper/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[1.65rem] leading-tight transition-colors duration-150 group-hover:text-paper/80">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-end justify-between gap-6 px-5 pb-7 pt-10">
            <p className="max-w-[24ch] text-[0.8125rem] leading-relaxed text-paper/60">
              {guaranteeLine}
            </p>
            <Seal size={84} tone="cream" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
