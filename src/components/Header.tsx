import Link from "next/link";
import type { Locale } from "@/schemas";
import type { Dictionary } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { Wordmark } from "@/components/Wordmark";
import { NavLinks, type NavItem } from "@/components/NavLinks";
import { LangSwitcher } from "@/components/LangSwitcher";
import { MobileNav } from "@/components/MobileNav";

export function navItems(dict: Dictionary): NavItem[] {
  return [
    { href: "/", label: dict.nav.services },
    { href: "/lawyers", label: dict.nav.lawyers },
    { href: "/guarantee", label: dict.nav.guarantee },
    { href: "/consultation", label: dict.nav.consultation },
    { href: "/about", label: dict.nav.about },
  ];
}

/** Persistent espresso header band: L-pillar wordmark, nav, ქარ / ENG. */
export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = navItems(dict);
  return (
    <header className="band-espresso bg-ink text-paper">
      <div className="mx-auto flex h-[3.75rem] max-w-[1200px] items-center justify-between gap-6 px-5 md:px-10">
        <Link
          href={localeHref(locale, "/")}
          className="shrink-0 text-[1.16rem] leading-none text-paper"
          aria-label={dict.common.brand}
        >
          <Wordmark />
        </Link>

        <nav
          aria-label={dict.common.navLabel}
          className="hidden items-center gap-7 text-[0.875rem] md:flex"
        >
          <NavLinks locale={locale} items={items} />
        </nav>

        <div className="flex items-center gap-5">
          <LangSwitcher locale={locale} label={dict.common.langSwitcherLabel} />
          <MobileNav
            locale={locale}
            items={items}
            openLabel={dict.common.menu}
            closeLabel={dict.common.close}
            guaranteeLine={dict.footer.guaranteeLine}
          />
        </div>
      </div>
    </header>
  );
}
