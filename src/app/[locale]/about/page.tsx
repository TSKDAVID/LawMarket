import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { LPillar } from "@/components/LPillar";

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
    barePath: "/about",
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <article className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <Eyebrow>{dict.aboutPage.eyebrow}</Eyebrow>
      <h1 className="mt-4 max-w-[16ch] font-display text-display-2xl">
        {dict.aboutPage.title}
      </h1>
      <Rule className="mt-10" />

      <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-12">
        <div className="col-span-12 md:col-span-6">
          {dict.aboutPage.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="mt-5 max-w-[58ch] text-[1.0625rem] leading-relaxed first:mt-0"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="col-span-12 md:col-span-4 md:col-start-9">
          <Eyebrow as="h2">{dict.aboutPage.principlesHeading}</Eyebrow>
          <ol className="mt-4 border-t border-ink/20">
            {dict.aboutPage.principles.map((principle, index) => (
              <li
                key={index}
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-ink/20 py-4"
              >
                <span className="font-mono text-[0.8125rem] leading-[1.8] text-ink-70">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <p className="leading-relaxed">{principle}</p>
              </li>
            ))}
          </ol>
          <LPillar className="mt-10 h-20 w-20 text-ink/70" strokeWidth={2.2} />
        </aside>
      </div>
    </article>
  );
}
