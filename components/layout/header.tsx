"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { LanguageSwitcher } from "./language-switcher";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
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
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-espresso">
      <PageShell className="flex h-16 items-center justify-between gap-3">
        <LogoLockup className="shrink-0 text-xl text-cream sm:text-2xl" />

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b-2 pb-0.5 font-body text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "border-burgundy text-cream"
                  : "border-transparent text-cream/60 hover:text-cream"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher tone="dark" />
          <Link
            href="/login"
            className="font-body text-sm font-medium text-cream/60 transition-colors hover:text-cream"
          >
            {t("login")}
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          >
            {t("getStarted")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] text-cream lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </PageShell>

      {open && (
        <div className="border-t border-cream/10 bg-espresso px-4 py-6 sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "font-body text-base font-medium",
                  isActive(item.href) ? "text-cream" : "text-cream/75"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-4 border-t border-cream/10 pt-6">
            <LanguageSwitcher tone="dark" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="font-body text-center text-sm font-medium text-cream/60 sm:text-left"
              >
                {t("login")}
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "justify-center sm:w-auto"
                )}
              >
                {t("getStarted")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
