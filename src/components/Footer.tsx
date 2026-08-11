import Link from "next/link";
import type { Locale } from "@/schemas";
import type { Dictionary } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { Wordmark } from "@/components/Wordmark";
import { Seal } from "@/components/Seal";
import { Eyebrow } from "@/components/Eyebrow";

/**
 * Espresso footer colophon (BRAND.md §4): large and document-like —
 * the seal, mono legal text, navigation, jurisdictions.
 */
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const indexLinks = [
    { href: "/services", label: dict.nav.services },
    { href: "/lawyers", label: dict.nav.lawyers },
    { href: "/consultation", label: dict.nav.consultation },
    { href: "/about", label: dict.nav.about },
  ];
  const documentLinks = [
    { href: "/guarantee", label: dict.nav.guarantee },
    { href: "/terms", label: dict.nav.terms },
    { href: "/privacy", label: dict.nav.privacy },
  ];

  const link =
    "inline-flex min-h-[32px] items-center text-paper/75 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:text-paper hover:underline";

  return (
    <footer className="band-espresso bg-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-5 pb-8 pt-14 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
          <div className="max-w-[34rem]">
            <p className="text-[2rem] leading-none md:text-[2.6rem]">
              <Wordmark />
            </p>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-paper/70">
              {dict.footer.guaranteeLine} {dict.footer.jurisdiction}
            </p>
          </div>
          <Seal size={116} tone="cream" label={dict.common.sealAria} />
        </div>

        <hr className="mb-9 mt-10 border-0 border-t border-paper/25" />

        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 md:grid-cols-12">
          <div className="md:col-span-3">
            <Eyebrow tone="cream" className="mb-3">
              {dict.footer.indexHeading}
            </Eyebrow>
            <ul className="space-y-0.5 text-[0.9375rem]">
              {indexLinks.map((item) => (
                <li key={item.href}>
                  <Link href={localeHref(locale, item.href)} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <Eyebrow tone="cream" className="mb-3">
              {dict.footer.documentsHeading}
            </Eyebrow>
            <ul className="space-y-0.5 text-[0.9375rem]">
              {documentLinks.map((item) => (
                <li key={item.href}>
                  <Link href={localeHref(locale, item.href)} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6 md:justify-self-end md:text-right">
            <Eyebrow tone="cream" className="mb-3">
              {dict.footer.requisitesHeading}
            </Eyebrow>
            <p className="font-mono text-[0.6875rem] leading-relaxed tracking-[0.08em] text-paper/60">
              {dict.footer.legalLine}
            </p>
            <p className="mt-2 max-w-[38ch] text-[0.8125rem] leading-relaxed text-paper/60 md:ml-auto">
              {dict.footer.jurisdiction}
            </p>
          </div>
        </div>

        <hr className="mb-5 mt-10 border-0 border-t border-paper/25" />

        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 font-mono text-[0.6875rem] tracking-[0.1em] text-paper/55">
          <span>{dict.footer.rights}</span>
          <span>LAWMARKET — LEGAL SERVICES, GUARANTEED</span>
        </div>
      </div>
    </footer>
  );
}
