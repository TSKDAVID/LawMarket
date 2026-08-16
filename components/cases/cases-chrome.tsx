"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

export function CasesChrome({
  signedIn,
  isLawyer,
}: {
  signedIn: boolean;
  isLawyer: boolean;
}) {
  const t = useTranslations("cases");
  const pathname = (usePathname().replace(/\/$/, "") || "/").toLowerCase();
  const onPost = pathname === "/cases/new" || pathname.startsWith("/cases/new/");
  const onBoard = pathname === "/cases" || (pathname.startsWith("/cases/") && !onPost);
  const showLoop = pathname === "/cases";

  const nav = isLawyer
    ? [{ href: "/cases", label: t("navBoard"), active: onBoard }]
    : [
        {
          href: "/cases",
          label: signedIn ? t("navMine") : t("navBoard"),
          active: onBoard && !onPost,
        },
        { href: "/cases/new", label: t("navPost"), active: onPost },
      ];

  return (
    <div className="border-b border-espresso/15 bg-white">
      <PageShell className="py-5 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-burgundy">
              {t("platformKicker")}
            </p>
            <p className="mt-1 max-w-xl font-body text-sm leading-relaxed text-espresso/70 sm:text-[15px]">
              {t("loopLead")}
            </p>
          </div>
          <nav
            aria-label={t("platformKicker")}
            className="flex flex-wrap gap-2"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-none border px-3.5 font-mono text-xs tracking-wide sm:text-sm",
                  item.active
                    ? "border-espresso bg-espresso text-cream"
                    : "border-burgundy text-burgundy hover:bg-burgundy hover:text-cream"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {showLoop ? (
          <ol className="mt-5 grid grid-cols-1 gap-3 border-t border-espresso/10 pt-4 sm:grid-cols-3 sm:gap-6">
            {[
              { title: t("loop1Title"), text: t("loop1Text") },
              { title: t("loop2Title"), text: t("loop2Text") },
              { title: t("loop3Title"), text: t("loop3Text") },
            ].map((step, index) => (
              <li key={step.title} className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-burgundy">
                  {String(index + 1).padStart(2, "0")} {step.title}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-espresso/70">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        ) : null}
      </PageShell>
    </div>
  );
}
