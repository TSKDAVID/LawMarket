import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { PageShell } from "@/components/layout/page-shell";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/icons/social-icons";

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
    <footer className="bg-espresso text-cream">
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
            <div className="mt-5 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-cream/15 text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-cream/15 text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-cream/15 text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
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
            <ul className="mt-4 space-y-3 font-body text-sm text-cream/60">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-cream/40" />
                <a href="mailto:hello@lawmarket.ge" className="hover:text-cream">
                  hello@lawmarket.ge
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-cream/40" />
                <a href="tel:+995322000000" className="hover:text-cream">
                  +995 322 000 000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cream/40" />
                <span>Tbilisi, Georgia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="font-body text-xs text-cream/40">
            &copy; {new Date().getFullYear()} {t("appName")}. {t("footer.rights")}
          </p>
        </div>
      </PageShell>
    </footer>
  );
}
