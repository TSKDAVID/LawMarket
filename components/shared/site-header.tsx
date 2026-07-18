import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export async function SiteHeader(): Promise<React.JSX.Element> {
  const t = await getTranslations("nav");
  const brand = await getTranslations("brand");

  return (
    <header className="border-b border-border bg-paper/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-tight text-ink">
          {brand("name")}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-muted md:flex">
          <Link href="/providers" className="hover:text-ink transition-colors">
            {t("findLawyer")}
          </Link>
          <Link href="/expat-consultations" className="hover:text-ink transition-colors">
            {t("expat")}
          </Link>
          <Link href="/how-it-works" className="hover:text-ink transition-colors">
            {t("howItWorks")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">{t("signup")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
