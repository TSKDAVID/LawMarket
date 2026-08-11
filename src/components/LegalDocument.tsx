import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";

/**
 * Shared layout for /terms and /privacy — typeset like a legal instrument:
 * eyebrow, display title, effective date, numbered articles on rules.
 */
export function LegalDocument({
  eyebrow,
  title,
  updated,
  articles,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  articles: { title: string; body: string }[];
}) {
  return (
    <article className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="grid grid-cols-12 items-end gap-x-5">
        <h1 className="col-span-12 mt-4 font-display text-display-xl md:col-span-8">
          {title}
        </h1>
        <p className="col-span-12 mt-3 font-mono text-[0.6875rem] tracking-eyebrow text-ink-70 md:col-span-4 md:mt-0 md:justify-self-end">
          {updated}
        </p>
      </div>
      <Rule className="mt-8" />

      <div className="mt-2 grid grid-cols-12 gap-x-5">
        <ol className="col-span-12 md:col-span-8">
          {articles.map((article, index) => (
            <li
              key={index}
              className="grid grid-cols-[3.25rem_1fr] gap-x-3 border-b border-ink/20 py-6"
            >
              <span className="font-mono text-[0.8125rem] leading-[1.9] text-ink-70">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <div>
                <h2 className="text-[1.15rem] leading-snug">{article.title}</h2>
                <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-70">
                  {article.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
