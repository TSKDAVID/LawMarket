import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import { getAllSitePages } from "@/lib/cms/pages";
import type { Locale } from "@/i18n/routing";

export default async function AdminContentPagesListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("admin.content");
  const pages = await getAllSitePages();

  return (
    <>
      <WorkspaceHeading title={t("pagesTitle")} description={t("pagesBody")} />
      <ul className="space-y-3">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/admin/content/pages/${page.slug}`}
              className="flex flex-col rounded-card border border-espresso/10 bg-white/50 px-4 py-3 transition-colors hover:border-burgundy/40"
            >
              <span className="font-heading font-semibold text-espresso">
                {page.title_en}
              </span>
              <span className="font-mono text-xs text-espresso/60">
                /{page.slug === "how-it-works" ? "how-it-works" : page.slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
