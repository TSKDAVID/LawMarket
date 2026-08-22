import { AlertTriangle } from "lucide-react";

type LegalSection = {
  title: string;
  text: string;
};

type LegalSectionsProps = {
  lastUpdatedLabel: string;
  placeholderNotice: string;
  showPlaceholderNotice?: boolean;
  sections: LegalSection[];
};

export function LegalSections({
  lastUpdatedLabel,
  placeholderNotice,
  showPlaceholderNotice = true,
  sections,
}: LegalSectionsProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <p className="font-body text-sm text-espresso/60">{lastUpdatedLabel}</p>

      {showPlaceholderNotice && placeholderNotice && (
        <div className="mt-6 flex items-start gap-3 rounded-card border border-burgundy/20 bg-burgundy-tint/60 p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-burgundy" />
        <p className="font-body text-sm leading-relaxed text-burgundy-dark">
          {placeholderNotice}
        </p>
      </div>
      )}

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-heading text-lg font-semibold text-espresso">
              {section.title}
            </h2>
            <p className="mt-2 font-body leading-relaxed text-espresso/80">
              {section.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
