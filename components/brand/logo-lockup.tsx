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
        "inline-flex items-center gap-[0.06em] font-heading text-2xl font-semibold tracking-tight",
        className
      )}
    >
      <LogoMark className="inline-block h-[0.9em] w-[0.58em]" />
      <span>aw Market</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Law Market home">
      {content}
    </Link>
  );
}
