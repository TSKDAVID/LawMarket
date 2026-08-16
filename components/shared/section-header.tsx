import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  variant?: "minimal" | "editorial" | "centered";
  tone?: "light" | "dark";
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  variant = "editorial",
  tone = "light",
  action,
  className,
}: SectionHeaderProps) {
  const isDark = tone === "dark";
  const isCentered = variant === "centered" || align === "center";
  const showRule = variant === "editorial" && align === "left";
  const showHairline = variant === "centered";

  return (
    <div
      className={cn(
        isCentered ? "mx-auto max-w-2xl text-center" : "text-left",
        action && align === "left" && "flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div
        className={cn(
          isCentered && "mx-auto",
          showRule && "brand-rule"
        )}
      >
        {eyebrow && variant !== "minimal" && (
          <p
            className={cn(
              "font-body text-xs font-medium uppercase tracking-widest",
              isDark ? "text-cream/65" : "text-espresso/60"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-heading text-2xl font-semibold sm:text-3xl",
            eyebrow && variant !== "minimal" && "mt-2",
            isDark ? "text-cream" : "text-espresso"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-2 max-w-xl font-body text-sm leading-relaxed sm:text-base",
              isCentered && "mx-auto",
              isDark ? "text-cream/70" : "text-espresso/65"
            )}
          >
            {subtitle}
          </p>
        )}
        {showHairline && (
          <div
            className={cn(
              "mx-auto mt-5 h-px w-12",
              isDark ? "bg-burgundy" : "bg-burgundy/60"
            )}
          />
        )}
      </div>
      {action}
    </div>
  );
}
