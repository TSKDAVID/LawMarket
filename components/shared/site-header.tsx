import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Scale } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { logout } from "@/lib/actions/auth";

export async function SiteHeader() {
  const t = await getTranslations("common");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-white">
            <Scale className="h-4.5 w-4.5" />
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-slate-900">
            LawMarket
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/lawyers" className="hover:text-slate-900">
            {t("nav.lawyers")}
          </Link>
          <Link href="/how-it-works" className="hover:text-slate-900">
            {t("nav.howItWorks")}
          </Link>
          <Link href="/expat" className="hover:text-slate-900">
            {t("nav.expat")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              {role === "admin" && (
                <Link href="/admin/cases" className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    {t("nav.admin")}
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  {t("nav.dashboard")}
                </Button>
              </Link>
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit">
                  {t("nav.logout")}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">{t("nav.signup")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
