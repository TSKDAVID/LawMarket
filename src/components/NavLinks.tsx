"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { barePath, localeHref } from "@/lib/routes";
import type { Locale } from "@/schemas";

export interface NavItem {
  href: string; // bare path, e.g. "/lawyers"
  label: string;
}

/** Header navigation with the active route underlined. */
export function NavLinks({ locale, items }: { locale: Locale; items: NavItem[] }) {
  const pathname = usePathname();
  const current = barePath(pathname);

  return (
    <>
      {items.map((item) => {
        const active =
          item.href === "/" ? current === "/" : current.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={localeHref(locale, item.href)}
            aria-current={active ? "page" : undefined}
            className={`underline-offset-[6px] transition-[color,text-decoration-color] duration-150 ease-out hover:underline ${
              active ? "underline decoration-1" : "text-paper/75 hover:text-paper"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
