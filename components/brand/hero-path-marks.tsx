import { cn } from "@/lib/utils";

type MarkProps = {
  className?: string;
};

/**
 * Balance over a plinth — browse listed, priced services.
 * Same stepped-rectangle language as the Law Market pillar.
 */
export function FindServiceMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-12 w-12", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="18" y="3" width="12" height="4" />
      <rect x="20" y="7" width="8" height="3" />
      <rect x="22" y="10" width="4" height="8" />
      <rect x="5" y="18" width="38" height="3.5" />
      <rect x="9" y="21.5" width="3" height="8" />
      <rect x="36" y="21.5" width="3" height="8" />
      <rect x="5" y="29.5" width="11" height="6" />
      <rect x="32" y="29.5" width="11" height="6" />
      <rect x="16" y="38" width="16" height="6" />
    </svg>
  );
}

/**
 * A brief pinned to the board — post a problem for lawyers to find.
 */
export function PostProblemMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-12 w-12", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="21" y="2" width="6" height="6" />
      <rect x="22.5" y="8" width="3" height="5" />
      <path
        fillRule="evenodd"
        d="M11 12h19l7 7v23H11V12ZM17 24h14v2.5H17V24Zm0 6h14v2.5H17V30Zm0 6h9v2.5h-9V36Z"
      />
    </svg>
  );
}
