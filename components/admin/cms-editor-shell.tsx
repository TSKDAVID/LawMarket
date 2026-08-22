"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CmsNavSection = {
  id: string;
  label: string;
};

type CmsToast = {
  type: "ok" | "error";
  messageKey: string;
};

function CmsSaveButton({ label, savingLabel }: { label: string; savingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? savingLabel : label}
    </Button>
  );
}

function CmsFloatingToast({
  toast,
  toastKey,
}: {
  toast: CmsToast | null;
  toastKey: number;
}) {
  const t = useTranslations("admin.content");

  if (!toast || typeof document === "undefined") return null;

  return createPortal(
    <div
      key={toastKey}
      role={toast.type === "ok" ? "status" : "alert"}
      aria-live="polite"
      className={cn(
        "fixed bottom-24 left-4 right-4 z-[200] animate-fade-up sm:left-auto sm:right-8 sm:max-w-md",
        "rounded-card border-2 border-espresso px-4 py-3 shadow-[5px_5px_0_0_var(--color-espresso)]",
        toast.type === "ok"
          ? "bg-burgundy text-cream"
          : "border-burgundy/40 bg-burgundy-tint/95 text-burgundy-dark"
      )}
    >
      <p className="font-body text-sm font-medium leading-snug">
        {toast.type === "ok" ? t("saved") : t(toast.messageKey)}
      </p>
    </div>,
    document.body
  );
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

export function CmsStickySaveBar({ toast }: { toast: CmsToast | null }) {
  const t = useTranslations("admin.content");

  return (
    <div
      className={cn(
        "sticky bottom-0 z-30 -mx-1 mt-8 border-t px-1 py-4 backdrop-blur-sm",
        toast?.type === "ok"
          ? "border-burgundy/30 bg-burgundy-tint/30"
          : "border-espresso/15 bg-cream/95"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {toast ? (
          <p
            role={toast.type === "ok" ? "status" : "alert"}
            className={cn(
              "animate-fade-up font-body text-sm font-medium leading-snug",
              toast.type === "ok" ? "text-burgundy" : "text-burgundy-dark"
            )}
          >
            {toast.type === "ok" ? t("saved") : t(toast.messageKey)}
          </p>
        ) : (
          <p className="font-body text-xs text-espresso/60">{t("saveHint")}</p>
        )}
        <CmsSaveButton label={t("save")} savingLabel={t("saving")} />
      </div>
    </div>
  );
}

export function CmsEditorShell({
  sections,
  children,
  status,
}: {
  sections: CmsNavSection[];
  children: ReactNode;
  status: { ok?: boolean; error: string | null };
}) {
  const t = useTranslations("admin.content");
  const { pending } = useFormStatus();
  const [toast, setToast] = useState<CmsToast | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && status.ok && !status.error) {
      setToast({ type: "ok", messageKey: "saved" });
      setToastKey((key) => key + 1);
    } else if (wasPending.current && !pending && status.error) {
      setToast({ type: "error", messageKey: status.error });
      setToastKey((key) => key + 1);
    }
    wasPending.current = pending;
  }, [pending, status.error, status.ok]);

  useEffect(() => {
    if (!toast || toast.type !== "ok") return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast, toastKey]);

  return (
    <div className="min-w-0">
      <div className="lg:grid lg:grid-cols-[11.5rem_minmax(0,1fr)] lg:gap-10">
        <div className="mb-6 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-espresso/50 lg:mb-3">
            {t("sectionNav")}
          </p>
          <CmsSectionNav sections={sections} />
        </div>

        <div className="min-w-0 pb-2">{children}</div>
      </div>

      <CmsStickySaveBar toast={toast} />
      <CmsFloatingToast toast={toast} toastKey={toastKey} />
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
