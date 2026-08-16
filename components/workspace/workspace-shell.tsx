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
    <div className="paper-grain min-h-[70vh] bg-cream">
      <PageShell className="py-6 sm:py-10 lg:py-14">
        <p className="font-mono text-sm tracking-wide text-burgundy">
          {title}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          <nav className="h-fit lg:sticky lg:top-24">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-0 lg:border-l lg:border-espresso/15">
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
                      "flex min-h-11 items-center justify-between gap-2 px-3 py-2.5 font-mono text-sm tracking-wide transition-colors sm:px-4",
                      "border lg:border-0 lg:border-l-2 lg:-ml-px",
                      items.length % 2 === 1 && "max-lg:last:col-span-2",
                      active
                        ? "border-burgundy bg-white text-espresso lg:border-l-burgundy lg:bg-transparent"
                        : "border-espresso/15 text-espresso/80 hover:border-espresso/35 hover:text-espresso lg:border-transparent"
                    )}
                  >
                    <span>{item.label}</span>
                    {typeof item.count === "number" && item.count > 0 && (
                      <span className="font-body text-xs tracking-normal text-burgundy">
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </PageShell>
    </div>
  );
}

export function WorkspaceHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-espresso/10 pb-5 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:pb-6">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-espresso/75">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  );
}

export function WorkspacePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border border-espresso/12 border-t-[3px] border-t-burgundy bg-white p-4 sm:p-6 lg:p-8",
        className
      )}
    >
      {children}
    </section>
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
        className="border-l-[3px] border-burgundy bg-burgundy-tint px-4 py-3 font-body text-sm text-burgundy-dark"
      >
        {error}
      </p>
    );
  }
  if (ok) {
    return (
      <p className="border-l-[3px] border-espresso bg-parchment px-4 py-3 font-body text-sm text-espresso">
        {okText}
      </p>
    );
  }
  return null;
}
