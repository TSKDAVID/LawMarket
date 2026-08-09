import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-body text-xs font-medium",
  {
    variants: {
      variant: {
        burgundy: "bg-burgundy-tint text-burgundy-dark",
        gold: "bg-[#8a6d3b]/10 text-[#8a6d3b]",
        espresso: "bg-espresso text-cream",
        outline: "border border-espresso/15 text-espresso/70",
      },
      size: {
        sm: "px-2.5 py-1",
        md: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "burgundy",
      size: "sm",
    },
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
