"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; count?: number };

export function WorkspaceShell({
  title,
  items,
  children,
}: {
  title: string;
  items: Item[];
  children: ReactNode;
}) {
  const pathname = usePathname().replace(/\/$/, "") || "/";

  return (
    <div className="paper-grain bg-cream">
      <PageShell className="py-10 lg:py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass">
          {title}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <nav className="h-fit border border-espresso/20 bg-parchment">
            {items.map((item) => {
              const active =
                item.href === "/portal" || item.href === "/admin"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between border-b border-espresso/15 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] last:border-b-0",
                    active
                      ? "bg-espresso text-cream"
                      : "text-espresso/70 hover:bg-espresso/5 hover:text-espresso"
                  )}
                >
                  <span>{item.label}</span>
                  {typeof item.count === "number" && item.count > 0 && (
                    <span>{item.count}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div>{children}</div>
        </div>
      </PageShell>
    </div>
  );
}

export function FormMessage({
  error,
  ok,
  okText,
}: {
  error: string | null;
  ok?: boolean;
  okText: string;
}) {
  if (error) {
    return (
      <p
        role="alert"
        className="mb-5 border-l-[3px] border-burgundy bg-burgundy-tint px-4 py-3 font-body text-sm text-burgundy-dark"
      >
        {error}
      </p>
    );
  }
  if (ok) {
    return (
      <p className="mb-5 border-l-[3px] border-espresso bg-parchment px-4 py-3 font-body text-sm text-espresso">
        {okText}
      </p>
    );
  }
  return null;
}
