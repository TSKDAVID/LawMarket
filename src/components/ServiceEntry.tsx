import Link from "next/link";
import { MiniSeal } from "@/components/MiniSeal";

/**
 * Expanded ledger entry for the homepage register — a dossier entry, not a
 * card: § number, display-face name on a dot-leader to the mono price, the
 * service's brief, and a meta line (assigned lawyer · guarantee mark).
 * Structure comes from rules and the paper-deep hover, never boxes.
 */
export function ServiceEntry({
  href,
  clause,
  name,
  description,
  lawyer,
  price,
  guaranteedLabel,
  viewLabel,
}: {
  href: string;
  clause: string;
  name: string;
  description: string;
  lawyer?: string;
  price: string;
  guaranteedLabel: string;
  viewLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group -mx-3 grid grid-cols-[2.5rem_1fr] gap-x-2 px-3 py-4 transition-colors duration-150 ease-out hover:bg-paper-deep/70 md:-mx-4 md:grid-cols-[3.25rem_1fr] md:gap-x-3 md:px-4 md:py-5"
    >
      <span className="pt-[0.4rem] font-mono text-[0.75rem] tracking-[0.06em] text-ink-70">
        {clause}
      </span>
      <span className="block min-w-0">
        <span className="flex items-baseline gap-3">
          <span className="font-display text-[1.2rem] leading-tight transition-colors duration-150 group-hover:text-stamp md:text-[1.3rem]">
            {name}
          </span>
          <span aria-hidden="true" className="dot-leader flex-1 self-baseline" />
          <span className="shrink-0 whitespace-nowrap font-mono text-[1rem] tabular-nums md:text-[1.05rem]">
            {price}
          </span>
          <MiniSeal className="hidden self-center sm:block" />
        </span>
        <span className="mt-1.5 block max-w-[60ch] text-[0.875rem] leading-relaxed text-ink-70">
          {description}.
        </span>
        <span className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="font-mono text-[0.6875rem] tracking-[0.09em] text-ink-70">
            {lawyer ? `${lawyer} · ` : ""}
            {guaranteedLabel}
          </span>
          <span className="font-mono text-[0.6875rem] tracking-[0.09em] text-ink-70 underline decoration-transparent decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out group-hover:text-stamp group-hover:decoration-stamp/60">
            {viewLabel} →
          </span>
        </span>
      </span>
    </Link>
  );
}
