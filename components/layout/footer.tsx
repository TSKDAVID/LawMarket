import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { PageShell } from "@/components/layout/page-shell";
import type { SiteSettings } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import type { CmsTextStyle } from "@/lib/cms/text-style";
import { cmsStyleClasses } from "@/lib/cms/text-style";
import { cn } from "@/lib/utils";

type FooterProps = {
  settings: SiteSettings;
  locale: Locale;
  cmsStyles: Record<string, CmsTextStyle>;
};

function localizedLocation(settings: SiteSettings, locale: Locale) {
  return locale === "ka"
    ? settings.contact_location_ka || settings.contact_location_en
    : settings.contact_location_en;
}

export async function Footer({ settings, locale, cmsStyles }: FooterProps) {
  const t = await getTranslations("common");
  const tNav = await getTranslations("common.nav");

  const platformLinks = [
    { href: "/", label: tNav("home") },
    { href: "/services", label: tNav("services") },
    { href: "/lawyers", label: tNav("lawyers") },
    { href: "/how-it-works", label: tNav("howItWorks") },
    { href: "/cases/new", label: tNav("postCase") },
    { href: "/signup", label: tNav("getStarted") },
  ] as const;

  const companyLinks = [
    { href: "/about", label: t("footer.about") },
    { href: "/contact", label: t("footer.contact") },
  ] as const;

  const legalLinks = [
    { href: "/terms", label: t("footer.terms") },
    { href: "/privacy", label: t("footer.privacy") },
  ] as const;

  const socialLinks = [
    { href: settings.social_facebook, label: "Facebook" },
    { href: settings.social_instagram, label: "Instagram" },
    { href: settings.social_linkedin, label: "LinkedIn" },
  ].filter((item) => item.href);

  const contactEntries = [
    {
      prefix: "EMAIL",
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
    },
    {
      prefix: "TEL",
      value: settings.contact_phone,
      href: settings.contact_phone_href,
    },
    {
      prefix: "LOC",
      value: localizedLocation(settings, locale),
      href: undefined,
    },
  ] as const;

  return (
    <footer className="border-t border-cream/15 bg-espresso text-cream">
      <PageShell className="py-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <LogoLockup className="text-cream" />
            <p
              className={cn(
                "mt-4 max-w-sm font-body text-sm leading-relaxed text-cream/85",
                cmsStyleClasses(cmsStyles["common.footer.description"])
              )}
            >
              {t("footer.description")}
            </p>
            <p
              className={cn(
                "mt-3 font-body text-xs text-cream/55",
                cmsStyleClasses(cmsStyles["common.tagline"])
              )}
            >
              {t("tagline")}
            </p>
            {socialLinks.length > 0 && (
              <ul className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-widest">
                {socialLinks.map((social, index) => (
                  <li key={social.label} className="flex items-center gap-x-2">
                    {index > 0 && (
                      <span aria-hidden="true" className="text-cream/45">
                        {"//"}
                      </span>
                    )}
                    <a
                      href={social.href}
                      className="text-cream/75 transition-colors hover:text-cream"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-cream/95">
              {t("footer.platform")}
            </h3>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/88 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-cream/95">
              {t("footer.company")}
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/88 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wide text-cream/95">
              {t("footer.legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/88 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-cream/95">
              {t("footer.contact")}
            </h3>
            <ul className="mt-4 space-y-3 font-body text-sm text-cream/88">
              {contactEntries.map((entry) => (
                <li
                  key={entry.prefix}
                  className="flex flex-wrap items-baseline gap-x-2"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-burgundy-light">
                    {entry.prefix}:
                  </span>
                  {entry.href ? (
                    <a
                      href={entry.href}
                      className="transition-colors hover:text-cream"
                    >
                      {entry.value}
                    </a>
                  ) : (
                    <span>{entry.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-8 sm:flex-row">
          <p className="font-body text-xs text-cream/60">
            &copy; {new Date().getFullYear()} {t("appName")}. {t("footer.rights")}
          </p>
        </div>
      </PageShell>
    </footer>
  );
}
