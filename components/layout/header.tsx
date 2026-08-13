"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { LanguageSwitcher } from "./language-switcher";
import { PageShell } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/services", label: t("services") },
    { href: "/lawyers", label: t("lawyers") },
    { href: "/how-it-works", label: t("howItWorks") },
  ] as const;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    /* Sits on the hero's cream paper; the single 1px espresso rule below
       spans the full viewport and doubles as the first grid line. */
    <header className="sticky top-0 z-50 border-b border-espresso bg-cream">
      <PageShell className="relative flex h-16 items-center justify-between gap-3">
        <LogoLockup className="shrink-0 text-xl text-espresso sm:text-2xl" />

        {/* Dead-center navigation, independent of logo/action widths. */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-9 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "font-mono text-xs uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy",
                isActive(item.href)
                  ? "text-espresso underline decoration-burgundy decoration-2 underline-offset-8"
                  : "text-espresso/55 hover:text-espresso"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="ml-6 font-mono text-xs uppercase tracking-[0.16em] text-espresso/60 transition-colors hover:text-espresso focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
          >
            {t("login")}
          </Link>
          <Link
            href="/signup"
            className="ml-6 inline-flex h-10 items-center rounded-none border border-espresso bg-espresso px-5 font-mono text-xs uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream hover:text-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
          >
            {t("getStarted")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-espresso/25 text-espresso transition-colors hover:border-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </PageShell>

      {open && (
        <div className="border-t border-espresso/20 bg-cream lg:hidden">
          <nav aria-label="Primary" className="divide-y divide-espresso/15">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "block px-[var(--page-gutter)] py-4 font-mono text-sm uppercase tracking-[0.14em]",
                  isActive(item.href) ? "text-espresso" : "text-espresso/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-espresso/15 px-[var(--page-gutter)] py-5">
            <div className="flex items-center justify-between gap-4">
              <LanguageSwitcher />
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.16em] text-espresso/60"
              >
                {t("login")}
              </Link>
            </div>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="mt-5 flex h-12 items-center justify-center rounded-none border border-espresso bg-espresso px-5 font-mono text-xs uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream hover:text-espresso"
            >
              {t("getStarted")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
