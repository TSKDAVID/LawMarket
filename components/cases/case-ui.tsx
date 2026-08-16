import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ClientCaseStatus } from "@/lib/supabase/database.types";

export function CaseStatus({
  status,
  label,
}: {
  status: ClientCaseStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center px-2.5 font-mono text-[10px] uppercase tracking-[0.16em]",
        status === "open" && "border border-espresso text-espresso",
        status === "matched" && "bg-espresso text-cream",
        status === "closed" && "border border-espresso/20 text-espresso/45"
      )}
    >
      {label}
    </span>
  );
}

export function CaseFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-espresso/15 bg-white shadow-[0_10px_28px_-18px_rgba(28,18,16,0.18)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CaseSectionHeading({
  kicker,
  title,
  body,
}: {
  kicker?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="brand-rule">
      {kicker ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-espresso/55">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight text-espresso sm:text-2xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-espresso/70">
          {body}
        </p>
      ) : null}
    </div>
  );
}
