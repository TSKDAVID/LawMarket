import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
};

/**
 * The Law Market pillar mark: an "L" built from a stepped column capital,
 * a plain shaft, and a stepped plinth foot extending right. Renders in
 * `currentColor` so it can be recolored via text color utilities.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="24 7 55 86"
      className={cn("h-6 w-6", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="28" y="12" width="26" height="7" />
      <rect x="35" y="17" width="14" height="64" />
      <rect x="35" y="79" width="42" height="9" />
    </svg>
  );
}
