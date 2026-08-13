import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarProps = {
  initials: string;
  color: string;
  photoUrl?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-xl",
  xl: "h-28 w-28 text-2xl",
};

/* lg and xl cover the roster plates, which stretch past their box to column width. */
const imageSizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "48px",
  md: "64px",
  lg: "(max-width: 768px) 160px, 240px",
  xl: "(max-width: 768px) 160px, 240px",
};

export function Avatar({
  initials,
  color,
  photoUrl,
  alt,
  size = "md",
  className,
}: AvatarProps) {
  if (photoUrl) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-none bg-cream-muted",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={photoUrl}
          alt={alt ?? initials}
          fill
          sizes={imageSizes[size]}
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-none font-heading font-semibold text-cream",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
