import { locale as getLocale } from "next/root-params";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { StampButton } from "@/components/StampButton";

/** § 404 — typeset like a document clause (ENGINEERING.md §8). */
export default async function NotFound() {
  const raw = (await getLocale()) ?? "ka";
  const locale = isLocale(raw) ? raw : "ka";
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-36">
      <Eyebrow>{dict.notFound.eyebrow} — LAWMARKET</Eyebrow>
      <h1 className="mt-5 max-w-[16ch] font-display text-display-xl">
        {dict.notFound.title}
      </h1>
      <p className="mt-6 max-w-[44ch] text-ink-70">{dict.notFound.body}</p>
      <Rule className="my-10 max-w-[26rem]" />
      <StampButton href={localeHref(locale, "/")} variant="secondary">
        {dict.notFound.link}
      </StampButton>
    </div>
  );
}
