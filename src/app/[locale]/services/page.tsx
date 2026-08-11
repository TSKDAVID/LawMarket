import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { formatClause, formatGel } from "@/lib/format";
import { getLawyersForService, getLedger } from "@/lib/repository";
import { Eyebrow } from "@/components/Eyebrow";
import { LedgerSearch, type LedgerGroup } from "@/components/LedgerSearch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    barePath: "/services",
    title: dict.meta.servicesTitle,
    description: dict.meta.servicesDescription,
  });
}

/** The full register — all 15 services with the real-time search. */
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const ledger = getLedger();

  const groups: LedgerGroup[] = ledger.map(({ area, services }) => {
    const first = services[0];
    const last = services[services.length - 1];
    return {
      id: area.id,
      heading: area.name[locale],
      headingLatin: locale === "ka" ? area.name.en.toUpperCase() : null,
      range:
        services.length > 1 && first && last
          ? `${formatClause(first.number)} — ${formatClause(last.number)}`
          : first
            ? formatClause(first.number)
            : "",
      items: services.map((service) => ({
        slug: service.slug,
        clause: formatClause(service.number),
        name: service.name[locale],
        description: service.description[locale],
        lawyer: getLawyersForService(service)[0]?.name[locale],
        price: formatGel(service.priceGel, locale),
        searchable: [
          service.name.ka,
          service.name.en,
          service.description.ka,
          service.description.en,
          area.name.ka,
          area.name.en,
        ]
          .join(" ")
          .toLowerCase(),
      })),
    };
  });

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14">
      <Eyebrow>{dict.ledger.eyebrow}</Eyebrow>
      <div className="grid grid-cols-12 items-end gap-x-5 gap-y-4">
        <h1 className="col-span-12 mt-3 font-display text-display-xl md:col-span-7">
          {dict.ledger.title}
        </h1>
        <p className="col-span-12 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-70 md:col-span-4 md:col-start-9">
          {dict.ledger.note}
        </p>
      </div>

      <div className="mt-10">
        <LedgerSearch
          groups={groups}
          locale={locale}
          serviceHrefPrefix={localeHref(locale, "/services")}
          strings={{
            searchLabel: dict.ledger.searchLabel,
            searchPlaceholder: dict.ledger.searchPlaceholder,
            clear: dict.ledger.clear,
            countAnnouncement: dict.ledger.countAnnouncement,
            emptyTitle: dict.ledger.emptyTitle,
            emptyAction: dict.ledger.emptyAction,
            view: dict.ledger.view,
          }}
        />
      </div>
    </div>
  );
}
