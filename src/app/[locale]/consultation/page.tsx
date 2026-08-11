import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { ConsultationForm } from "./ConsultationForm";

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
    barePath: "/consultation",
    title: dict.meta.consultationTitle,
    description: dict.meta.consultationDescription,
  });
}

export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <Eyebrow>{dict.consultation.eyebrow}</Eyebrow>
      <h1 className="mt-4 max-w-[18ch] font-display text-display-xl">
        {dict.consultation.title}
      </h1>
      <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-70">
        {dict.consultation.lede}
      </p>
      <Rule className="mt-10" />

      <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-14">
        <section className="col-span-12 md:col-span-6">
          <Eyebrow as="h2">{dict.consultation.howHeading}</Eyebrow>
          <ol className="mt-4 border-t border-ink/20">
            {dict.consultation.steps.map((step, index) => (
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
        </section>

        <aside className="col-span-12 max-w-[26rem] md:col-span-4 md:col-start-8">
          <ConsultationForm
            locale={locale}
            strings={{
              formHeading: dict.consultation.formHeading,
              nameLabel: dict.checkout.nameLabel,
              emailLabel: dict.checkout.emailLabel,
              phoneLabel: dict.checkout.phoneLabel,
              phoneHint: dict.checkout.phoneHint,
              matterLabel: dict.consultation.matterLabel,
              submit: dict.consultation.submit,
              submitting: dict.consultation.submitting,
              successEyebrow: dict.consultation.successEyebrow,
              successTitle: dict.consultation.successTitle,
              successBody: dict.consultation.successBody,
              refLabel: dict.consultation.refLabel,
              sealAria: dict.common.sealAria,
              errors: dict.checkout.errors,
            }}
          />
        </aside>
      </div>
    </div>
  );
}
