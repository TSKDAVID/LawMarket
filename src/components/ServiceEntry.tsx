import Link from "next/link";

/**
 * Index card for the services register — a card-catalog entry, not a
 * floating card: sharp corners, 1px espresso hairline, paper background.
 * § number and assigned lawyer up top, display-face name, the brief, and
 * the price on a rule at the bottom edge.
 */
export function ServiceEntry({
  href,
  clause,
  name,
  description,
  lawyer,
  price,
  viewLabel,
}: {
  href: string;
  clause: string;
  name: string;
  description: string;
  lawyer?: string;
  price: string;
  viewLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col border border-ink/45 bg-paper px-5 pb-4 pt-4 transition-colors duration-150 ease-out hover:border-ink hover:bg-paper-deep/60"
    >
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-70">
          {clause}
        </span>
        {lawyer ? (
          <span className="truncate font-mono text-[0.625rem] tracking-[0.06em] text-ink-70">
            {lawyer}
          </span>
        ) : null}
      </span>

      <span className="mt-2.5 block font-display text-[1.2rem] leading-snug transition-colors duration-150 group-hover:text-stamp">
        {name}
      </span>

      <span className="mt-2 block text-[0.8125rem] leading-relaxed text-ink-70">
        {description}.
      </span>

      <span className="mt-auto block pt-4">
        <span className="flex items-baseline justify-between gap-3 border-t border-ink/25 pt-3">
          <span className="whitespace-nowrap font-mono text-[1.05rem] tabular-nums">
            {price}
          </span>
          <span className="font-mono text-[0.6875rem] tracking-[0.09em] text-ink-70 transition-colors duration-150 group-hover:text-stamp">
            {viewLabel} →
          </span>
        </span>
      </span>
    </Link>
  );
}
