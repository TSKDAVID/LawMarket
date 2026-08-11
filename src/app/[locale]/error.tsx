"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { errorStrings } from "@/locales/error-strings";

/** § 500 — the branded error clause, in the document voice. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ka";
  const t = errorStrings[locale];

  useEffect(() => {
    // Surfaced to the console until Sentry is wired at launch (§10).
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-36">
      <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
        {t.eyebrow} — LAWMARKET
      </p>
      <h1 className="mt-5 max-w-[18ch] font-display text-display-xl">{t.title}</h1>
      <p className="mt-6 max-w-[44ch] text-ink-70">{t.body}</p>
      <hr className="my-10 max-w-[26rem] border-0 border-t border-ink" />
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[46px] items-center justify-center bg-stamp px-7 py-2.5 text-[0.9375rem] leading-tight text-paper transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-press active:translate-y-[1px]"
        >
          {t.retry}
        </button>
        <Link
          href={locale === "en" ? "/en" : "/"}
          className="inline-flex min-h-[46px] items-center justify-center border border-ink px-7 py-2.5 text-[0.9375rem] leading-tight transition-[background-color,transform] duration-150 ease-out hover:bg-ink/[0.07] active:translate-y-[1px]"
        >
          {t.home}
        </Link>
      </div>
    </div>
  );
}
