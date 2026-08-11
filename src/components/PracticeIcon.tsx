/**
 * Placeholder practice-area icons on a shared 24px grid: single espresso
 * strokes, square corners, engraved geometry (BRAND.md §4). Stand-ins that
 * already follow the icon rules — replaced by final custom icons later.
 */
export function PracticeIcon({
  areaId,
  className = "",
}: {
  areaId: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="butt"
      className={`h-[18px] w-[18px] shrink-0 ${className}`}
      aria-hidden="true"
    >
      {areaId === "civil-law" ? (
        // a deed: ruled document
        <>
          <rect x="5.25" y="3.25" width="13.5" height="17.5" />
          <path d="M8.5 8 H15.5" />
          <path d="M8.5 11.5 H15.5" />
          <path d="M8.5 15 H12.5" />
        </>
      ) : areaId === "labor-law" ? (
        // two interlocking frames: the employment relation
        <>
          <rect x="4.25" y="4.25" width="10" height="10" />
          <rect x="9.75" y="9.75" width="10" height="10" />
        </>
      ) : (
        // corporate: colonnade on a base
        <>
          <path d="M4 20 H20" />
          <path d="M4.75 5.5 H19.25" />
          <path d="M7 8 V17.5" />
          <path d="M12 8 V17.5" />
          <path d="M17 8 V17.5" />
          <path d="M5.5 8 H18.5" />
        </>
      )}
    </svg>
  );
}
