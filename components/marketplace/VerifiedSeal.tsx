import * as React from "react";
import { cn } from "@/lib/utils";

interface VerifiedSealProps {
  className?: string;
  size?: number;
  title?: string;
}

/** Minimal line-art verification seal — signature motif, not a generic check badge. */
export function VerifiedSeal({
  className,
  size = 48,
  title = "ხელით დადასტურებული",
}: VerifiedSealProps): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-seal", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" className="text-brass" />
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <path
        d="M22 33.5L28.5 40L42 24.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
