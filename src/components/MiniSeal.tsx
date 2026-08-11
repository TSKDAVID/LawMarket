/**
 * Tiny guarantee mark for ledger row ends — an echo of the Seal at a size
 * where the full mark would not survive. Decorative (the guarantee is
 * stated in text beside the ledger).
 */
export function MiniSeal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 text-brass ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="4.4" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
    </svg>
  );
}
