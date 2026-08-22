"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CmsNavSection = {
  id: string;
  label: string;
};

export function CmsStatusBanner({
  ok,
  error,
}: {
  ok?: boolean;
  error: string | null;
}) {
  const t = useTranslations("admin.content");

  if (ok) {
    return (
      <p className="mb-6 rounded-card border border-burgundy/20 bg-burgundy-tint/40 px-4 py-3 font-body text-sm text-burgundy-dark">
        {t("saved")}
      </p>
    );
  }

  if (error) {
    return (
      <p className="mb-6 rounded-card border border-burgundy/30 bg-burgundy-tint/50 px-4 py-3 font-body text-sm text-burgundy-dark">
        {t(error)}
      </p>
    );
  }

  return null;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CmsSectionNav({
  sections,
  className,
}: {
  sections: CmsNavSection[];
  className?: string;
}) {
  if (sections.length === 0) return null;

  return (
    <nav
      className={cn(
        "flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-l lg:border-espresso/15",
        className
      )}
      aria-label="Section navigation"
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className={cn(
            "rounded-card border px-3 py-2 text-left font-mono text-xs tracking-wide transition-colors lg:rounded-none lg:border-0 lg:border-l-2 lg:-ml-px lg:px-3 lg:py-2.5",
            "border-espresso/15 text-espresso/75 hover:border-espresso/35 hover:text-espresso lg:border-transparent lg:hover:bg-white/40"
          )}
        >
          <span className="hidden lg:inline text-espresso/45">{index + 1}. </span>
          {section.label}
        </button>
      ))}
    </nav>
  );
}

export function CmsStickySaveBar({
  formId,
  pending,
}: {
  formId: string;
  pending: boolean;
}) {
  const t = useTranslations("admin.content");

  return (
    <div
      className="sticky bottom-0 z-20 -mx-1 mt-8 border-t border-espresso/15 bg-cream/95 px-1 py-4 backdrop-blur-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-body text-xs text-espresso/60">{t("saveHint")}</p>
        <Button type="submit" form={formId} disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}

export function CmsEditorShell({
  formId,
  sections,
  pending,
  children,
  status,
}: {
  formId: string;
  sections: CmsNavSection[];
  pending: boolean;
  children: ReactNode;
  status: { ok?: boolean; error: string | null };
}) {
  const t = useTranslations("admin.content");

  return (
    <div className="min-w-0">
      <CmsStatusBanner ok={status.ok} error={status.error} />

      <div className="lg:grid lg:grid-cols-[11.5rem_minmax(0,1fr)] lg:gap-10">
        <div className="mb-6 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-espresso/50 lg:mb-3">
            {t("sectionNav")}
          </p>
          <CmsSectionNav sections={sections} />
        </div>

        <div className="min-w-0 pb-2">{children}</div>
      </div>

      <CmsStickySaveBar formId={formId} pending={pending} />
    </div>
  );
}

export function CmsSectionBlock({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 rounded-card border border-espresso/12 bg-white/55 p-5 sm:p-6",
        className
      )}
    >
      <h2 className="border-b border-espresso/10 pb-3 font-heading text-lg font-semibold text-espresso">
        {title}
      </h2>
      <div className="mt-5 space-y-6">{children}</div>
    </section>
  );
}
