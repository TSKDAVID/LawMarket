import Link from "next/link";
import { MiniSeal } from "@/components/MiniSeal";

/**
 * One entry of the § index (BRAND.md §4): clause number · name ·
 * dot-leader · mono ₾ price · small guarantee mark. Whole row is the link.
 */
export function LedgerRow({
  href,
  clause,
  label,
  price,
  showSeal = true,
}: {
  href: string;
  clause: string;
  label: string;
  price: string;
  showSeal?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[48px] items-baseline gap-3 py-3 md:gap-4"
    >
      <span className="w-10 shrink-0 font-mono text-[0.75rem] tracking-[0.06em] text-ink-70 md:w-12">
        {clause}
      </span>
      <span className="max-w-[62%] leading-snug underline decoration-transparent decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out group-hover:text-stamp group-hover:decoration-stamp/60 md:max-w-none">
        {label}
      </span>
      <span aria-hidden="true" className="dot-leader flex-1 self-baseline" />
      <span className="shrink-0 whitespace-nowrap font-mono text-[0.9375rem] tabular-nums">
        {price}
      </span>
      {showSeal ? <MiniSeal className="hidden self-center sm:block" /> : null}
    </Link>
  );
}
