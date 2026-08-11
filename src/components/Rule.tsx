/**
 * 1px hairline — the structural device of the whole site (BRAND.md §4):
 * rules instead of boxes, content ON the paper.
 */
export function Rule({
  tone = "ink",
  className = "",
}: {
  tone?: "ink" | "soft" | "faint" | "cream" | "cream-soft" | "brass";
  className?: string;
}) {
  const tones: Record<string, string> = {
    ink: "border-ink",
    soft: "border-ink/40",
    faint: "border-ink/20",
    cream: "border-paper",
    "cream-soft": "border-paper/25",
    brass: "border-brass",
  };
  return <hr className={`border-0 border-t ${tones[tone]} ${className}`} />;
}
