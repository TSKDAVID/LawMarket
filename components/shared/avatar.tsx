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
          "relative shrink-0 overflow-hidden rounded-full bg-cream-muted",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={photoUrl}
          alt={alt ?? initials}
          fill
          sizes="(max-width: 768px) 80px, 112px"
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-heading font-semibold text-cream",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
