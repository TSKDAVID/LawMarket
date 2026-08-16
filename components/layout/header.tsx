"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { LanguageSwitcher } from "./language-switcher";
import { PageShell } from "@/components/layout/page-shell";
import { signOut } from "@/app/[locale]/auth-actions";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/supabase/database.types";

type HeaderProps = {
  signedIn: boolean;
  role: UserRole | null;
  label: string | null;
};

export function Header({ signedIn, role, label }: HeaderProps) {
  const t = useTranslations("common.nav");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const caseNav =
    role === "lawyer" || role === "admin"
      ? { href: "/cases", label: t("openCases") }
      : signedIn
        ? { href: "/cases", label: t("myCases") }
        : { href: "/cases/new", label: t("postCase") };

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
    { href: "/lawyers", label: t("lawyers") },
    caseNav,
    { href: "/how-it-works", label: t("howItWorks") },
  ];

  const workspaceHref = role === "admin" ? "/admin" : "/portal/profile";
  const workspaceLabel =
    role === "admin" ? t("admin") : role === "lawyer" ? t("portal") : null;

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const ctaHref = "/start";

  const navBtn =
    "inline-flex h-10 shrink-0 items-center justify-center rounded-none px-3.5 font-mono text-sm tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy";
  const navBtnOutline = cn(
    navBtn,
    "border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream"
  );
  const navBtnPrimary = cn(
    navBtn,
    "border border-burgundy bg-burgundy px-4 text-cream hover:border-espresso hover:bg-espresso"
  );

  return (
    <header className="sticky top-0 z-50 border-b border-espresso bg-cream">
      <PageShell className="flex h-[4.25rem] items-center gap-4">
        <LogoLockup className="shrink-0 text-[1.35rem] leading-none text-espresso sm:text-2xl" />

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:gap-8 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap font-mono text-[15px] leading-none tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy",
                isActive(item.href)
                  ? "text-espresso underline decoration-burgundy decoration-2 underline-offset-[10px]"
                  : "text-espresso/80 hover:text-espresso"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
          <LanguageSwitcher className="h-10" />
          {signedIn ? (
            <>
              {workspaceLabel && (
                <Link
                  href={workspaceHref}
                  title={label ?? undefined}
                  className={navBtnOutline}
                >
                  {workspaceLabel}
                </Link>
              )}
              <form action={signOut} className="flex">
                <input type="hidden" name="locale" value={locale} />
                <button type="submit" className={navBtnOutline}>
                  {tAuth("logout")}
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className={navBtnOutline}>
              {t("login")}
            </Link>
          )}
          <Link href={ctaHref} className={navBtnPrimary}>
            {t("getStarted")}
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-espresso/25 text-espresso transition-colors hover:border-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy lg:hidden"
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
                  "block px-[var(--page-gutter)] py-4 font-mono text-base tracking-wide",
                  isActive(item.href) ? "text-espresso" : "text-espresso/80"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-espresso/15 px-[var(--page-gutter)] py-5">
            <LanguageSwitcher className="h-10" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {signedIn ? (
                <>
                  {workspaceLabel ? (
                    <Link
                      href={workspaceHref}
                      title={label ?? undefined}
                      onClick={() => setOpen(false)}
                      className={cn(navBtnOutline, "w-full")}
                    >
                      {workspaceLabel}
                    </Link>
                  ) : (
                    <span />
                  )}
                  <form action={signOut} className="w-full">
                    <input type="hidden" name="locale" value={locale} />
                    <button type="submit" className={cn(navBtnOutline, "w-full")}>
                      {tAuth("logout")}
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(navBtnOutline, "col-span-2")}
                >
                  {t("login")}
                </Link>
              )}
            </div>
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className={cn(navBtnPrimary, "mt-3 h-12 w-full")}
            >
              {t("getStarted")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
