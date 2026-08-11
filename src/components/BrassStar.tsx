/**
 * Engraved four-point star for review ratings — brass, square-cornered,
 * decorative only (a numeric value always accompanies it, ENGINEERING.md §9).
 */
export function BrassStar({
  filled = true,
  className = "",
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 ${className}`} aria-hidden="true">
      <path
        d="M8 1.2 L9.7 6.3 L14.8 8 L9.7 9.7 L8 14.8 L6.3 9.7 L1.2 8 L6.3 6.3 Z"
        fill={filled ? "#8a6d3b" : "none"}
        stroke="#8a6d3b"
        strokeWidth="1"
      />
    </svg>
  );
}
