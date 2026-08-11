import type { ReactNode } from "react";

/**
 * Letter-spaced mono label — the signature section device
 * (`§ 03 — FAMILY LAW`). Strings arrive pre-set from the dictionaries;
 * no text-transform, so Georgian is never fake-uppercased.
 */
export function Eyebrow({
  children,
  tone = "ink70",
  as: Tag = "p",
  className = "",
}: {
  children: ReactNode;
  tone?: "ink70" | "ink" | "cream" | "brass" | "stamp";
  as?: "p" | "span" | "h2" | "h3" | "div";
  className?: string;
}) {
  const tones: Record<string, string> = {
    ink70: "text-ink-70",
    ink: "text-ink",
    cream: "text-paper/70",
    brass: "text-brass",
    stamp: "text-stamp",
  };
  return (
    <Tag
      className={`font-mono text-[0.6875rem] leading-relaxed tracking-eyebrow ${tones[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}
