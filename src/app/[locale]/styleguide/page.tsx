import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { Eyebrow } from "@/components/Eyebrow";
import { Rule } from "@/components/Rule";
import { Seal } from "@/components/Seal";
import { LPillar } from "@/components/LPillar";
import { Wordmark } from "@/components/Wordmark";
import { StampButton } from "@/components/StampButton";
import { LedgerRow } from "@/components/LedgerRow";
import { Monogram } from "@/components/Monogram";
import { PracticeIcon } from "@/components/PracticeIcon";
import { BrassStar } from "@/components/BrassStar";
import { MiniSeal } from "@/components/MiniSeal";

/** Hidden dev page — not linked from navigation, not indexed. */
export const metadata: Metadata = {
  title: "Styleguide · LawMarket",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Paper", token: "--color-paper", hex: "#f6efe3", cls: "bg-paper border border-ink/20" },
  { name: "Paper-deep", token: "--color-paper-deep", hex: "#efe6d4", cls: "bg-paper-deep border border-ink/20" },
  { name: "Ink / Espresso", token: "--color-ink", hex: "#1c1210", cls: "bg-ink" },
  { name: "Ink 70", token: "--color-ink-70", hex: "#453a36", cls: "bg-ink-70" },
  { name: "Stamp / Burgundy", token: "--color-stamp", hex: "#6b1423", cls: "bg-stamp" },
  { name: "Stamp press", token: "--color-stamp-press", hex: "#4d0e19", cls: "bg-stamp-press" },
  { name: "Brass", token: "--color-brass", hex: "#8a6d3b", cls: "bg-brass" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <Eyebrow as="h2">{title}</Eyebrow>
      <Rule className="mb-8 mt-2" />
      {children}
    </section>
  );
}

export default async function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-10">
      <Eyebrow>LAWMARKET — FOUNDATION REVIEW · INTERNAL</Eyebrow>
      <h1 className="mt-4 font-display text-display-xl">Styleguide</h1>

      <Section title="01 — PALETTE (BRAND.MD §2)">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-7">
          {swatches.map((swatch) => (
            <div key={swatch.token}>
              <div className={`h-20 ${swatch.cls}`} />
              <p className="mt-2 text-[0.8125rem]">{swatch.name}</p>
              <p className="font-mono text-[0.6875rem] tracking-[0.06em] text-ink-70">
                {swatch.hex}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="02 — TYPE · BOTH SCRIPTS, SINGLE WEIGHT">
        <div className="space-y-10">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
              ALK SANET — DISPLAY / ქართული
            </p>
            <p className="mt-2 font-display text-display-2xl">
              იურიდიული მომსახურება წერილობითი გარანტიით.
            </p>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
              ALK SANET — DISPLAY / LATIN
            </p>
            <p className="mt-2 font-display text-display-xl">
              Legal services, with a written guarantee.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                BPG NINO MKHEDRULI — TEXT
              </p>
              <p className="mt-2 max-w-[46ch]">
                ყოველ მომსახურებას LawMarket-ზე თან ახლავს წერილობითი გარანტია.
                თქვენ მიიღებთ ზუსტად იმ მომსახურებას, რომელიც აღწერილია გვერდზე —
                შესრულებულს დანიშნული იურისტის მიერ, მითითებულ ვადაში.
              </p>
            </div>
            <div>
              <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
                BPG NINO MKHEDRULI — TEXT / LATIN
              </p>
              <p className="mt-2 max-w-[46ch]">
                Every service on LawMarket carries a written guarantee. You receive
                exactly the service described on its page — performed by the
                assigned lawyer, within the stated term.
              </p>
            </div>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] tracking-eyebrow text-ink-70">
              IBM PLEX MONO — DOCUMENT APPARATUS
            </p>
            <p className="mt-2 font-mono text-[0.9375rem] tracking-[0.04em]">
              § 03 — FAMILY LAW · ₾ 250 · GBA #PLACEHOLDER-001 · LM-2026-00042
            </p>
          </div>
        </div>
      </Section>

      <Section title="03 — EYEBROWS & RULES">
        <div className="space-y-6">
          <Eyebrow>§ 03 — FAMILY LAW</Eyebrow>
          <Eyebrow tone="brass">GUARANTEED · EST. 2026</Eyebrow>
          <Rule />
          <Rule tone="soft" />
          <Rule tone="faint" />
        </div>
      </Section>

      <Section title="04 — THE L-PILLAR & WORDMARK">
        <div className="flex flex-wrap items-end gap-12">
          <LPillar className="h-24 w-24 text-ink" strokeWidth={2.2} />
          <LPillar className="h-14 w-14 text-ink" strokeWidth={2.6} />
          <LPillar className="h-8 w-8 text-ink" strokeWidth={3.4} />
          <div className="bg-ink p-5">
            <LPillar className="h-14 w-14 text-paper" strokeWidth={2.6} />
          </div>
          <p className="text-[2.2rem] leading-none">
            <Wordmark />
          </p>
          <p className="text-[1.15rem] leading-none">
            <Wordmark />
          </p>
        </div>
      </Section>

      <Section title="05 — THE SEAL">
        <div className="flex flex-wrap items-end gap-12">
          <Seal size={160} />
          <Seal size={112} />
          <Seal size={72} />
          <div className="bg-ink p-6">
            <Seal size={112} tone="cream" />
          </div>
          <Seal size={112} tone="stamp" rotate={-12} />
          <MiniSeal className="h-4 w-4" />
        </div>
      </Section>

      <Section title="06 — STAMP BUTTONS">
        <div className="flex flex-wrap items-center gap-6">
          <StampButton href="#">დაიწყეთ საქმე — ₾ 250</StampButton>
          <StampButton href="#" variant="secondary">
            უფასო 15-წუთიანი კონსულტაცია
          </StampButton>
          <StampButton type="button" disabled>
            იგზავნება…
          </StampButton>
          <div className="bg-ink p-5">
            <StampButton href="#" variant="secondary-cream">
              Request a consultation
            </StampButton>
          </div>
        </div>
      </Section>

      <Section title="07 — LEDGER ROWS">
        <ul className="divide-y divide-ink/15 border-y border-ink">
          <li>
            <LedgerRow href="#" clause="§ 14" label="შპს რეგისტრაცია" price="₾ 250" />
          </li>
          <li>
            <LedgerRow href="#" clause="§ 01" label="Legal Consultation" price="₾ 80" />
          </li>
          <li>
            <LedgerRow
              href="#"
              clause="§ 06"
              label="განქორწინების წარმოება"
              price="₾ 400"
            />
          </li>
        </ul>
      </Section>

      <Section title="08 — MONOGRAMS, ICONS, STARS">
        <div className="flex flex-wrap items-end gap-10">
          <Monogram initials="ნბ" size="lg" />
          <Monogram initials="გკ" size="md" />
          <Monogram initials="TL" size="sm" />
          <div className="flex items-center gap-6 text-ink">
            <PracticeIcon areaId="civil-law" className="h-6 w-6" />
            <PracticeIcon areaId="labor-law" className="h-6 w-6" />
            <PracticeIcon areaId="corporate-law" className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-1.5">
            <BrassStar />
            <BrassStar />
            <BrassStar />
            <BrassStar />
            <BrassStar filled={false} />
            <span className="ml-2 font-mono text-[0.8125rem]">4 / 5</span>
          </div>
        </div>
      </Section>

      <Section title="09 — FORM FIELD STATES">
        <div className="grid max-w-[26rem] gap-8">
          <div>
            <label htmlFor="sg-name" className="text-[0.9375rem]">
              სახელი და გვარი
            </label>
            <input id="sg-name" className="rule-field mt-1" type="text" />
          </div>
          <div>
            <label htmlFor="sg-phone" className="text-[0.9375rem]">
              ტელეფონი
            </label>
            <input
              id="sg-phone"
              className="rule-field mt-1"
              type="tel"
              aria-invalid="true"
              defaultValue="12"
            />
            <p className="mt-1.5 font-mono text-[0.75rem] leading-relaxed text-stamp">
              მიუთითეთ ქართული მობილურის ნომერი — მაგ. 5XX XX XX XX.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
