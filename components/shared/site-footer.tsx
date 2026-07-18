import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Scale } from "lucide-react";

export async function SiteFooter() {
  const t = await getTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-900 text-white">
              <Scale className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg font-bold text-slate-900">
              LawMarket
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-500">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {t("footer.platform")}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/lawyers" className="hover:text-slate-900">
                {t("nav.lawyers")}
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-slate-900">
                {t("nav.howItWorks")}
              </Link>
            </li>
            <li>
              <Link href="/expat" className="hover:text-slate-900">
                {t("nav.expat")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {t("footer.forProviders")}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/signup" className="hover:text-slate-900">
                {t("footer.becomeProvider")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-400 sm:px-6">
          © {year} LawMarket. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
