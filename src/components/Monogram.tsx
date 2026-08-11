/**
 * The engraved-monogram device for lawyers (BRAND.md §4): serif initials in
 * a hairline rule frame. Never an avatar circle, never a silhouette.
 */
export function Monogram({
  initials,
  size = "md",
  className = "",
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-11 w-11 text-[1.05rem]",
    md: "h-14 w-14 text-[1.35rem]",
    lg: "h-20 w-20 text-[1.9rem]",
  }[size];
  return (
    <span
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center border border-ink/55 ${sizes} ${className}`}
    >
      <span className="pointer-events-none absolute inset-[3px] border border-ink/25" />
      <span className="font-display leading-none tracking-[0.05em]">{initials}</span>
    </span>
  );
}
