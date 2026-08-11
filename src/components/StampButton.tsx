import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Stamped rectangular button (BRAND.md §4): sharp corners, burgundy fill /
 * espresso border, presses down on activation. Never a pill.
 */
type Common = {
  variant?: "primary" | "secondary" | "secondary-cream";
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string; type?: never; disabled?: never };
type AsButton = Common & {
  href?: undefined;
  type?: "submit" | "button";
  disabled?: boolean;
  name?: string;
  value?: string;
};

const base =
  "inline-flex min-h-[46px] select-none items-center justify-center gap-2 px-7 py-2.5 text-center text-[0.9375rem] leading-tight tracking-[0.02em] transition-[background-color,color,transform,border-color] duration-150 ease-out active:translate-y-[1px]";

const variants: Record<string, string> = {
  primary: "bg-stamp text-paper hover:bg-stamp-press active:bg-stamp-press",
  secondary: "border border-ink text-ink hover:bg-ink/[0.07] active:bg-ink/[0.12]",
  "secondary-cream":
    "border border-paper/70 text-paper hover:bg-paper/10 active:bg-paper/15",
};

export function StampButton(props: AsLink | AsButton) {
  const { variant = "primary", className = "", children } = props;
  const cls = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }
  const { type = "button", disabled, name, value } = props as AsButton;
  return (
    <button
      type={type}
      disabled={disabled}
      name={name}
      value={value}
      className={`${cls} disabled:pointer-events-none disabled:opacity-55`}
    >
      {children}
    </button>
  );
}
