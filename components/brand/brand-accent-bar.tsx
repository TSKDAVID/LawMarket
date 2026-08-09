import { cn } from "@/lib/utils";

type BrandAccentBarProps = {
  className?: string;
};

/** Signature burgundy bar — Law Market's equivalent of a Netflix red stripe. */
export function BrandAccentBar({ className }: BrandAccentBarProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("brand-accent-bar", className)}
    />
  );
}
