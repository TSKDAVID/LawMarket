import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  children,
  align = "left",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-espresso/8 bg-cream-muted/40 py-12 sm:py-14", className)}>
      <div className={cn("page-shell", align === "center" && "max-w-3xl text-center")}>
        <div className={cn(align === "left" && "brand-rule max-w-2xl")}>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-3 font-body text-base text-espresso/50 sm:text-lg",
                align === "center" && "mx-auto max-w-xl"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
