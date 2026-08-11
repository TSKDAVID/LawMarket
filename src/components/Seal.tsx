import { useId } from "react";

/**
 * The Seal (BRAND.md §4): "LAWMARKET · GUARANTEED ·" on a circular path
 * around the L-pillar, brass line-work, slightly rotated, with a touch of
 * letterpress ink-bleed. The guarantee device of the brand.
 */
export function Seal({
  size = 128,
  tone = "brass",
  rotate = -8,
  label,
  className = "",
}: {
  size?: number;
  /** brass on paper; cream on espresso; stamp (burgundy) on the executed order. */
  tone?: "brass" | "cream" | "stamp";
  rotate?: number;
  /** Accessible label; omit for decorative use. */
  label?: string;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ringId = `seal-ring-${uid}`;
  const bleedId = `seal-bleed-${uid}`;

  const colors = {
    brass: { line: "#8a6d3b", accent: "#8a6d3b" },
    cream: { line: "#f6efe3", accent: "#8a6d3b" },
    stamp: { line: "#6b1423", accent: "#6b1423" },
  }[tone];

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      className={className}
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label ? <title>{label}</title> : null}
      <defs>
        <path
          id={ringId}
          d="M 60 60 m -49.5 0 a 49.5 49.5 0 1 1 99 0 a 49.5 49.5 0 1 1 -99 0"
        />
        <filter id={bleedId} x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" />
        </filter>
      </defs>

      <g transform={`rotate(${rotate} 60 60)`} filter={`url(#${bleedId})`}>
        <circle cx="60" cy="60" r="57" stroke={colors.line} strokeWidth="1.4" />
        <circle cx="60" cy="60" r="41.5" stroke={colors.line} strokeWidth="0.65" />
        <text
          fill={colors.line}
          fontFamily="var(--font-plex), monospace"
          fontSize="8.6"
          letterSpacing="1.06"
        >
          <textPath href={`#${ringId}`} startOffset="0">
            LAWMARKET · GUARANTEED · LAWMARKET · GUARANTEED ·
          </textPath>
        </text>
        {/* the L-pillar at the seal's centre */}
        <g
          transform="translate(60 61) scale(0.6) translate(-34 -30.5)"
          stroke={colors.accent}
          strokeLinecap="butt"
        >
          <g strokeWidth="2.7">
            <path d="M12 9 H40" />
            <path d="M15 13 H37" />
            <path d="M20 13 V46" />
            <path d="M32 13 V46" />
            <path d="M15 46 H52" />
            <path d="M12 52 H56" />
            <path d="M52 46 V52" />
          </g>
          <g strokeWidth="1.15">
            <path d="M24.4 16 V43" />
            <path d="M27.6 16 V43" />
          </g>
        </g>
      </g>
    </svg>
  );
}
