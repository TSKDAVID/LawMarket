"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/content/text", key: "navText" as const },
  { href: "/admin/content/contact", key: "navContact" as const },
  { href: "/admin/content/media", key: "navMedia" as const },
  { href: "/admin/content/pages", key: "navPages" as const },
  { href: "/admin/content/messages", key: "navMessages" as const },
];

export function ContentSubnav({ messageCount }: { messageCount?: number }) {
  const t = useTranslations("admin.content");
  const pathname = usePathname().replace(/\/$/, "") || "/";

  return (
    <nav className="flex flex-wrap gap-2 border-b border-espresso/10 pb-4">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const count =
          item.key === "navMessages" && typeof messageCount === "number"
            ? messageCount
            : undefined;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-card border px-3 py-2 font-mono text-sm tracking-wide transition-colors",
              active
                ? "border-burgundy bg-white text-espresso"
                : "border-espresso/15 text-espresso/75 hover:border-espresso/35 hover:text-espresso"
            )}
          >
            {t(item.key)}
            {count && count > 0 && (
              <span className="font-body text-xs text-burgundy">{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
