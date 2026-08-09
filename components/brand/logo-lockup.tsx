import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

type LogoLockupProps = {
  className?: string;
  href?: string;
};

/**
 * Full "Law Market" wordmark with the pillar mark standing in for the
 * capital L of "Law", matching the approved brand lockup.
 */
export function LogoLockup({ className, href = "/" }: LogoLockupProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.06em] font-heading text-2xl font-semibold tracking-tight",
        className
      )}
    >
        <LogoMark className="inline-block h-[0.95em] w-[0.6em] translate-y-[0.04em]" />
      <span>aw Market</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex" aria-label="Law Market home">
      {content}
    </Link>
  );
}
