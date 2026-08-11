# LAWMARKET — Design Bible

This document is law. Every UI decision must be justifiable against it. When in doubt,
re-read the Concept and the Banned Patterns list before writing any markup or CSS.

---

## 1. The Concept (check every decision against this)

**LawMarket is not a website that sells legal services. It is a beautifully typeset
legal instrument — a document — that happens to be interactive.**

The user should feel like they are reading a formal, guaranteed contract prepared for
them personally: cream paper, precise typography, ruled lines, numbered clauses, ledger
prices, and a seal. Calm, exact, and quietly expensive. Nothing decorative that a
document wouldn't have.

Brand promise woven into the design: **every service carries a guarantee** — the
guarantee is rendered as a literal seal/stamp, and it is the brand mark.

## 2. Palette

| Role | Name | Hex | Usage rules |
|---|---|---|---|
| Paper | Cream | `#f6efe3` | ~80% of every screen. The default background. |
| Ink | Espresso | `#1c1210` | All body text, rules/lines, header & footer bands. |
| Stamp | Burgundy | `#6b1423` | ACTIONS ONLY: buttons, active filter, key links, the seal. Never as decoration, never as a section background. If burgundy appears, it must be clickable or be the seal. |
| Trust | Brass | `#8a6d3b` | TRUST ONLY: star ratings, guarantee seal detail, credential marks. Tiny doses. |
| Ink 70 | — | `#453a36` | Secondary text (dates, meta, captions). |
| Paper-deep | — | `#efe6d4` | Alternate band background when a section must separate from paper. Never gray. |

Proportion discipline is what makes a palette feel designed: cream dominates, espresso
structures, burgundy appears rarely enough that it always means "act here."

Hover/active states: darken burgundy toward `#4d0e19`; never lighten, never glow.

## 3. Typography (the site IS typography)

The site is bilingual: **Georgian (ka) is the primary language, English (en) secondary.**
Both languages must look equally designed — the Georgian version is the flagship, not
a translation afterthought.

**The brand fonts are the two self-hosted Georgian webfont kits already in this repo**
(`alk-sanet-master/` and `bpg-nino-mkhedruli-master/`, each with woff2/woff/ttf and a
ready @font-face CSS). Copy the font files into the project and load them with
`next/font/local`. Do not substitute Google Fonts for them.

- **ALK Sanet — the display voice:** headlines, the wordmark, prices in large
  settings, pull-quote statements. Used LARGE with tight leading.
- **BPG Nino Mkhedruli — the text voice:** body copy, UI, forms, captions.
- **IBM Plex Mono — document apparatus:** clause numbers, case codes, ledger prices,
  metadata. Keep mono content numeric/Latin (`§ 01`, `₾ 250`, bar numbers) — neither
  brand font is mono, and Latin/numeric apparatus reads as intentional, like stamps
  and file numbers on a real document.

Critical constraint — **both brand fonts exist in a single regular weight.** There is
no bold. All hierarchy must come from SIZE, SPACING, COLOR, and RULES — never
`font-weight`. Never let the browser synthesize a fake bold (`font-synthesis: none`).
This constraint is a feature: single-weight typography with big size jumps is exactly
the editorial, human-set look we want.

- Eyebrow labels: letter-spaced mono Latin (`§ 03 — FAMILY LAW`) or letter-spaced
  Georgian in BPG Nino Mkhedruli. Do not rely on `text-transform: uppercase` for
  Georgian — these fonts don't include Mtavruli forms; the spacing IS the emphasis.
- English locale: audit how these fonts render Latin text. If their Latin glyphs feel
  weak at display sizes, pair a Latin serif (e.g. Fraunces) for English headlines
  only, matched to the same scale — but Georgian remains the reference design.
- **BANNED fonts:** Inter, Poppins, Roboto, Space Grotesk, Montserrat, DM Sans, and
  any default system fallback for Georgian glyphs (audit for tofu/fallback boxes).

Rules:
- Headlines are large and set in serif with tight tracking; body is modest. The size
  jump between them should feel editorial (like a broadsheet newspaper), not like a
  SaaS landing page (where everything is medium-large).
- ALL-CAPS mono with wide letter-spacing for tiny labels (e.g. `§ 03 — FAMILY LAW`,
  `GUARANTEED`, `EST. 2026`). This is a signature device — use it as section eyebrows.
- Numerals matter: prices, clause numbers, and counts are set in mono or serif with
  intent. Never default sans numerals for a price.

## 4. Layout language

- **Ruled lines instead of boxes.** Structure comes from 1px espresso hairlines
  (full-width horizontal rules, vertical column rules) — like a ledger or a broadsheet.
  Content sits ON the paper, separated by rules, not IN cards floating above it.
- **Asymmetric editorial grid.** A 12-column grid used asymmetrically: e.g. headline
  spans 7 columns starting at column 1, supporting text 3 columns starting at 9.
  Aligned to the grid but never centered-symmetric.
- **The § index.** Services and practice areas are numbered like statute clauses:
  `§ 01`, `§ 02`… in mono. Service listing pages read like a table of contents with
  dot-leaders: `შპს რეგისტრაცია ........................... ₾ 250`. Prices are in GEL
  (₾), set in mono, always visible — transparent fixed pricing is the product.
- **The brand mark — the L-pillar.** The logo and favicon is a letter "L" whose
  vertical stroke is drawn as a classical column/pillar (subtle capital and base,
  fluting suggested with 2–3 hairlines — engraved, not illustrated). Espresso on
  cream, or cream on espresso in the header/footer bands. Wordmark: the L-pillar
  followed by "AWMARKET" set in ALK Sanet. This mark is the favicon and header logo.
- **The Seal.** A circular stamp mark (SVG): "LAWMARKET · GUARANTEED ·" text on a
  circular path around the L-pillar at its center, brass line-work, optionally
  rotated ~-8°, placed like a real stamp (overlapping a rule or a corner, slightly
  imperfect). Appears on every service that carries the guarantee, in the footer,
  and on order confirmations. The seal is the guarantee device; the L-pillar is
  the identity.
- **Custom icons only.** No icon libraries (no Heroicons, Feather, Lucide, Font
  Awesome). Icons are bespoke engraved-style line drawings: single 1px–1.5px stroke,
  espresso, square-cornered, drawn on a shared grid so the set feels like one
  engraver's hand. Until final icons are made, use placeholder SVGs that already
  follow these rules (simple geometric stand-ins on the same grid) — never emoji,
  never library icons as "temporary."
- **The homepage is a working document, not a brochure.** It leads with the services
  ledger itself, filterable by a real-time search that narrows the ledger as the user
  types (the search input styled as a rule-underlined field, not a rounded pill).
  No filler sections, no decorative dead space: every section either sells, proves
  (guarantee, lawyers), or navigates. Whitespace is deliberate breathing room around
  type, never empty padding between thin content.
- **Lawyer profile pages.** Each lawyer has a dedicated page structured like a case
  file: identity header (name in ALK Sanet, bar number and practice areas in mono),
  then a two-register body — the left register lists achievements and completed
  cases (rule-separated entries with mono case codes and dates; this will later be
  fed from a database as services complete), the right register lists client reviews
  (brass stars, plain typeset quotes, no avatar circles or quote-mark icons). The two
  registers sit side by side on desktop separated by a vertical hairline and scroll
  with the page as one document; on mobile they stack, cases first.
- **Lawyers as a register, not a team grid.** Lawyer profiles presented like entries
  in a bar register: rule-separated rows, name in serif, Georgian Bar Association
  number / practice areas in mono. The design must stand WITHOUT photos (portraits
  come later): until then use a typographic device — serif initials set like an
  engraved monogram inside a hairline rule frame — never avatar circles or placeholder
  silhouettes. When real portraits arrive, they are treated in espresso duotone.
- **Buttons look stamped:** rectangular, sharp corners (0–2px radius max), burgundy
  fill with cream text, mono or grotesque ALL-CAPS label, generous horizontal padding.
  Secondary button: 1px espresso border, transparent, same shape. No pill buttons.
- **Density varies.** Some sections are airy (one huge serif line on empty paper),
  some are dense (the ledger of services). Uniform section rhythm is the AI tell —
  break it deliberately.
- Header and footer are espresso bands: the footer is large and document-like
  (colophon: jurisdictions, bar associations, the seal, mono legal text).

## 5. Motion & texture

- Motion is restrained and physical: content settles like paper, no bounce, no
  parallax, no floating blobs. Hovers: underline draws in, rule thickens, stamp
  "presses" (1px translate + slight scale). Max 200ms, ease-out.
- Allowed texture: an extremely subtle paper grain on cream (barely perceptible),
  and letterpress-style slight ink-bleed on the seal only. No other texture, no noise
  overlays on everything.

## 6. BANNED PATTERNS (the AI-look kill list)

Never, under any circumstance:
- Cards with rounded corners and drop shadows; any `border-radius` above 2px except the circular seal.
- Gradients of any kind. Glassmorphism. Glow effects.
- Centered hero with a symmetric headline + subline + two buttons.
- Three-column icon + title + paragraph "features" grids.
- Emoji or generic line-icon sets (Feather/Heroicons decorating headings).
- Stock-photo hero of gavels, scales of justice, pillars, or handshakes. (The drawn
  L-pillar brand mark is not this — the ban is on photography and illustration
  clichés, not on our own engraved mark.)
- Purple/indigo/teal anywhere. Gray section backgrounds.
- "Trusted by 10,000+ clients" logo carousels.
- Uniform vertical padding on every section (`py-24` repeated down the page).
- Testimonial cards with avatar circles and quote marks icons.
- Cookie-cutter FAQ accordions with chevron icons as the default answer to content.

If a section draft contains any of these, it is wrong regardless of how it looks.

## 7. Language & commerce

- Georgian is the default locale; English is secondary. Full i18n from day one —
  every string translated, never mixed-language pages.
- The language switcher is a small typographic detail in the header, styled like a
  document annotation: `ქარ / ENG` in mono, active language underlined. No flags,
  no globe icons, no dropdowns.
- Services are purchased by **direct checkout at the fixed listed price**. The
  checkout flow keeps the document concept: the order summary is typeset like an
  invoice/engagement letter (ledger rows, rules, seal on confirmation), not a
  generic e-commerce cart. The confirmation page stamps the seal on the "executed"
  order — this is the brand's best moment, design it with care.
- Tone: old-world editorial prestige. Formal, engraved, law-library. The Georgian
  copy should read like a distinguished Georgian law firm's letterhead.

## 8. Content voice

Precise, calm, first-person-plural, lightly formal — a good lawyer's letter, not a
startup. "We register your LLC. Guaranteed, or your money back." Never "Unlock,"
"Empower," "Seamless," "Elevate," "journey." Prices stated plainly and prominently —
transparency IS the product.
