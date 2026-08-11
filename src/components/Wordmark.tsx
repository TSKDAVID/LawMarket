import { LPillar } from "@/components/LPillar";

/**
 * The wordmark: L-pillar followed by "AWMARKET" set in ALK Sanet
 * (BRAND.md §4). Scales with the current font size.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      <LPillar className="h-[0.98em] w-auto self-end translate-y-[0.02em]" strokeWidth={3} />
      <span className="font-display tracking-[0.075em] ml-[0.06em]">AWMARKET</span>
    </span>
  );
}
