type MarkProps = {
  className?: string;
};

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

/** Browse catalog — service grid with a corner search lens. */
export function FindServiceMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M4 4h7v7H4z" {...stroke} />
      <path d="M13 4h7v7h-7z" {...stroke} />
      <path d="M4 13h7v7H4z" {...stroke} />
      <circle cx="16.5" cy="16.5" r="3.25" {...stroke} />
      <path d="M18.75 18.75L21.5 21.5" {...stroke} />
    </svg>
  );
}

/** Post a case — folder tab with a new-entry plus. */
export function PostProblemMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M4 8h16v12H4z" {...stroke} />
      <path d="M4 8V6h8l2 2h6" {...stroke} />
      <path d="M11 14h6" {...stroke} />
      <path d="M14 11v6" {...stroke} />
    </svg>
  );
}
