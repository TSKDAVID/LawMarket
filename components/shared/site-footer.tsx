import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function SiteFooter(): Promise<React.JSX.Element> {
  const brand = await getTranslations("brand");

  return (
    <footer className="border-t border-border bg-paper-alt">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg text-ink">{brand("name")}</p>
          <p className="mt-1 max-w-md text-sm text-ink-muted">{brand("tagline")}</p>
        </div>
        <div className="flex gap-4 text-sm text-ink-muted">
          <Link href="/providers" className="hover:text-ink">
            პროვაიდერები
          </Link>
          <Link href="/expat-consultations" className="hover:text-ink">
            ექსპატები
          </Link>
        </div>
      </div>
    </footer>
  );
}
