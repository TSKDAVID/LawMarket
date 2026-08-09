import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

type PillarWatermarkProps = {
  className?: string;
  /** Tailwind opacity class, e.g. opacity-[0.05] */
  opacityClass?: string;
  colorClass?: string;
  position?: "left" | "right" | "center";
  size?: "sm" | "md" | "lg" | "hero";
};

const sizeMap = {
  sm: "h-32 w-32 sm:h-40 sm:w-40",
  md: "h-48 w-48 sm:h-56 sm:w-56",
  lg: "h-64 w-64 sm:h-80 sm:w-80",
  hero: "h-[min(55vh,28rem)] w-[min(55vh,28rem)]",
};

const positionMap = {
  left: "left-[-4%] top-1/2 -translate-y-1/2",
  right: "right-[-2%] top-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

export function PillarWatermark({
  className,
  opacityClass = "opacity-[0.06]",
  colorClass = "text-burgundy",
  position = "right",
  size = "lg",
}: PillarWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none",
        positionMap[position],
        className
      )}
    >
      <LogoMark
        className={cn(sizeMap[size], opacityClass, colorClass)}
      />
    </div>
  );
}
