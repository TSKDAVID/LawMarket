/**
 * The brand mark (BRAND.md §4): a letter "L" whose vertical stroke is a
 * classical column — subtle capital and base, fluting suggested with two
 * hairlines. Engraved, not illustrated: strokes only, no fills.
 */
export function LPillar({
  className = "",
  strokeWidth = 2.4,
  title,
}: {
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  const hairline = Math.max(strokeWidth * 0.42, 0.7);
  return (
    <svg
      viewBox="10 7 48 47"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="butt">
        {/* capital */}
        <path d="M12 9 H40" />
        <path d="M15 13 H37" />
        {/* shaft */}
        <path d="M20 13 V46" />
        <path d="M32 13 V46" />
        {/* base continuing into the L's arm */}
        <path d="M15 46 H52" />
        <path d="M12 52 H56" />
        <path d="M52 46 V52" />
      </g>
      {/* fluting — engraved hairlines */}
      <g stroke="currentColor" strokeWidth={hairline} strokeLinecap="butt">
        <path d="M24.4 16 V43" />
        <path d="M27.6 16 V43" />
      </g>
    </svg>
  );
}
