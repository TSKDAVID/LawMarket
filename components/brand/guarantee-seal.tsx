import { cn } from "@/lib/utils";

type GuaranteeSealProps = {
  className?: string;
};

/** Brass seal motif — used once for guarantee/trust moments */
export function GuaranteeSeal({ className }: GuaranteeSealProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-12 w-12", className)}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M24 10 L26.5 18 L35 18 L28 23 L30.5 31 L24 26 L17.5 31 L20 23 L13 18 L21.5 18 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
