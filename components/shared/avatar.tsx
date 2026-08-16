"use client";

import { useState } from "react";
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

const photoClassName =
  "object-cover object-[center_18%] saturate-[0.82] contrast-[1.06] transition-[filter] duration-300 group-hover:saturate-[0.95]";

function canOptimizePhoto(src: string) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const { protocol, hostname } = new URL(src);
    if (protocol !== "https:") return false;
    return (
      hostname === "images.unsplash.com" || hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}

export function Avatar({
  initials,
  color,
  photoUrl,
  alt,
  size = "md",
  className,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (photoUrl && !failed) {
    const label = alt ?? initials;
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-none bg-cream-muted",
          sizeClasses[size],
          className
        )}
      >
        {canOptimizePhoto(photoUrl) ? (
          <Image
            src={photoUrl}
            alt={label}
            fill
            sizes={imageSizes[size]}
            className={photoClassName}
            onError={() => setFailed(true)}
          />
        ) : (
          // Lawyer photo_url is a freeform URL (Facebook CDN, etc.). next/image
          // crashes the page for hosts that are not in next.config remotePatterns.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={label}
            className={cn("absolute inset-0 h-full w-full", photoClassName)}
            onError={() => setFailed(true)}
          />
        )}
        {/* Warm espresso grade so mixed source photos read as one set. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-espresso/[0.13] mix-blend-multiply transition-opacity duration-300 group-hover:opacity-50"
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
