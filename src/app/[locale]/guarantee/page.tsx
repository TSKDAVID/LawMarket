import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { Seal } from "@/components/Seal";
import { StampButton } from "@/components/StampButton";

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
    barePath: "/guarantee",
    title: dict.meta.guaranteeTitle,
    description: dict.meta.guaranteeDescription,
  });
}

export default async function GuaranteePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <article className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <Eyebrow>{dict.guaranteePage.eyebrow}</Eyebrow>
      <h1 className="mt-4 font-display text-display-2xl">{dict.guaranteePage.title}</h1>

      {/* The full text, set large — the document itself. */}
      <div className="relative mt-10 md:mt-14">
        <div className="grid grid-cols-12 gap-x-5">
          <p className="col-span-12 max-w-[30ch] font-display text-display-md leading-normal md:col-span-9">
            {dict.guaranteePage.fullText}
          </p>
        </div>
        <div className="relative mt-12">
          <Rule />
          <div className="absolute -top-[3.1rem] right-4 md:right-20">
            <Seal size={98} label={dict.common.sealAria} />
          </div>
          <p className="mt-3 font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
            {dict.guaranteeSection.signedPlace}
          </p>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-12 gap-x-5 gap-y-12 md:mt-20">
        <section className="col-span-12 md:col-span-6">
          <Eyebrow as="h2">{dict.guaranteePage.clausesHeading}</Eyebrow>
          <ol className="mt-4 border-t border-ink/20">
            {dict.guaranteeSection.clauses.map((clause, index) => (
              <li
                key={index}
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-ink/20 py-4"
              >
                <span className="font-mono text-[0.8125rem] leading-[1.8] text-ink-70">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <p className="leading-relaxed">{clause}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="col-span-12 md:col-span-5 md:col-start-8">
          <Eyebrow as="h2">{dict.guaranteePage.refundHeading}</Eyebrow>
          <ol className="mt-4 border-t border-ink/20">
            {dict.guaranteePage.refundSteps.map((step, index) => (
              <li
                key={index}
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-ink/20 py-4"
              >
                <span className="font-mono text-[0.8125rem] leading-[1.8] text-ink-70">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-9">
            <StampButton href={localeHref(locale, "/services")}>
              {dict.guaranteePage.cta}
            </StampButton>
          </div>
        </section>
      </div>
    </article>
  );
}
