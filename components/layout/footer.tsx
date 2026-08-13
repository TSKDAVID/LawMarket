import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { PageShell } from "@/components/layout/page-shell";

/* Set in Latin on purpose: these are wordmarks, not translatable nouns. */
const socialLinks = [
  { href: "#", label: "Facebook" },
  { href: "#", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
] as const;

const contactEntries = [
  {
    prefix: "EMAIL",
    value: "hello@lawmarket.ge",
    href: "mailto:hello@lawmarket.ge",
  },
  { prefix: "TEL", value: "+995 322 000 000", href: "tel:+995322000000" },
  { prefix: "LOC", value: "Tbilisi, Georgia", href: undefined },
] as const;

export function Footer() {
  const t = useTranslations("common");
  const tNav = useTranslations("common.nav");

  const platformLinks = [
    { href: "/services", label: tNav("services") },
    { href: "/lawyers", label: tNav("lawyers") },
    { href: "/how-it-works", label: tNav("howItWorks") },
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

  return (
    <footer className="border-t border-cream/15 bg-espresso text-cream">
      <PageShell className="py-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <LogoLockup className="text-cream" />
            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-cream/50">
              {t("footer.description")}
            </p>
            <p className="mt-3 font-body text-xs text-cream/35">
              {t("tagline")}
            </p>
            {/* Set as a run of text, separated by slashes — no chrome. */}
            <ul className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-widest">
              {socialLinks.map((social, index) => (
                <li key={social.label} className="flex items-center gap-x-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-cream/25">
                      {"//"}
                    </span>
                  )}
                  <a
                    href={social.href}
                    className="text-cream/60 transition-colors hover:text-cream"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-cream/90">
              {t("footer.platform")}
            </h3>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/60 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-cream/90">
              {t("footer.company")}
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/60 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wide text-cream/90">
              {t("footer.legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/60 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-cream/90">
              {t("footer.contact")}
            </h3>
            {/* Field labels, not pictograms: the prefix carries the meaning. */}
            <ul className="mt-4 space-y-3 font-body text-sm text-cream/60">
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
          <p className="font-body text-xs text-cream/40">
            &copy; {new Date().getFullYear()} {t("appName")}. {t("footer.rights")}
          </p>
        </div>
      </PageShell>
    </footer>
  );
}
