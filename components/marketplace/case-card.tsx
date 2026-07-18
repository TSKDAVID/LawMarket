import { VerifiedSeal } from "@/components/marketplace/VerifiedSeal";
import type { Tables } from "@/types/database.types";

export function CaseCard({ caseItem }: { caseItem: Tables<"cases"> }): React.JSX.Element {
  return (
    <article className="border border-border p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-xs tracking-wide text-brass">{caseItem.case_number}</p>
        <VerifiedSeal size={28} />
      </div>
      <h3 className="mt-3 font-display text-lg text-ink">{caseItem.title}</h3>
      {caseItem.summary ? (
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-muted">{caseItem.summary}</p>
      ) : null}
      {caseItem.public_decision_reference ? (
        <a
          href={caseItem.public_decision_reference}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm text-seal underline-offset-4 hover:underline"
        >
          გადაწყვეტილების რეფერენსი →
        </a>
      ) : null}
    </article>
  );
}
