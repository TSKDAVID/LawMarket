import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { getExpatProgram } from "@/lib/data/programs";

export default async function ExpatConsultationsPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("expat");
  const program = await getExpatProgram();
  const criteria =
    (program?.config as { eligibility_criteria?: Array<{ id: string; label_ka: string; required?: boolean }> })
      ?.eligibility_criteria ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Program</p>
      <h1 className="mt-3 text-4xl">{t("title")}</h1>
      <p className="mt-4 text-ink-muted leading-relaxed">{t("body")}</p>

      <section className="mt-12 border border-border bg-paper-alt/50 p-6">
        <h2 className="font-display text-xl">{t("criteriaTitle")}</h2>
        <ul className="mt-4 space-y-3">
          {criteria.length === 0 ? (
            <li className="text-sm text-ink-muted">კრიტერიუმები მალე დაემატება.</li>
          ) : (
            criteria.map((c) => (
              <li key={c.id} className="flex gap-3 text-sm text-ink">
                <span className="font-mono text-xs text-brass pt-0.5">{c.required ? "●" : "○"}</span>
                <span>{c.label_ka}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="mt-8">
        <Button asChild size="lg">
          <Link href="/signup?next=/dashboard/expat-applications">{t("applyCta")}</Link>
        </Button>
      </div>
    </div>
  );
}
