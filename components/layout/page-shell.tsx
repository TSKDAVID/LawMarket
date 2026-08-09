import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  narrow?: boolean;
};

export function PageShell({
  children,
  className,
  as: Tag = "div",
  narrow = false,
}: PageShellProps) {
  return (
    <Tag
      className={cn("page-shell", narrow && "page-shell--narrow", className)}
    >
      {children}
    </Tag>
  );
}
