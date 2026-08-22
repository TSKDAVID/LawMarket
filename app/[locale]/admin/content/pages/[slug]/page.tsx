import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import { CmsPageForm } from "@/components/admin/cms-page-form";
import { getCmsTextValues } from "@/lib/cms/admin-data";
import { getSitePage } from "@/lib/cms/pages";
import { SITE_PAGE_SLUGS, type SitePageSlug } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";

export default async function AdminContentPageEdit({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!SITE_PAGE_SLUGS.includes(slug as SitePageSlug)) notFound();

  setRequestLocale(locale as Locale);
  const t = await getTranslations("admin.content");
  const page = await getSitePage(slug as SitePageSlug);
  const textValues = await getCmsTextValues();

  return (
    <>
      <WorkspaceHeading
        title={t("editPage", { slug })}
        description={page.title_en}
      />
      <CmsPageForm locale={locale} page={page} textValues={textValues} />
    </>
  );
}
