# How to prompt Cursor so LawMarket looks human-designed

## The system (why this works)

An AI defaults to the internet's average design whenever a decision is unspecified.
The fix is: (1) a design bible that pre-makes the decisions, (2) explicit bans on the
clichés, (3) building one section at a time with a critique loop, (4) real content.
Never say "make it modern/clean/premium" — those words summon the template.

Before starting: make sure BRAND.md (design), ENGINEERING.md (architecture/behavior),
and content.md (content + decisions) are in the repo, and reference them in every
prompt (`@BRAND.md @ENGINEERING.md @content.md`). BRAND.md governs how it looks,
ENGINEERING.md governs how it is built — both are binding.

---

## Prompt 1 — Foundation (run once)

> Read @BRAND.md and @ENGINEERING.md carefully — they are the constitution for this
> project and override all of your default instincts.
>
> Set up the project per ENGINEERING.md §1–2: Next.js (App Router) + TypeScript
> strict + Tailwind, zod schemas in `src/schemas/`, typed data modules in `src/data/`
> (seed with the real content from @content.md), a repository access layer in
> `src/lib/repository.ts`, locale-prefixed i18n routing (ka default, en secondary)
> with dictionaries in `src/locales/`, and `.env.example`. Then, before building any
> page, create the design foundation as code:
> - Design tokens (CSS variables) for the palette, exactly as specified in BRAND.md.
> - Font setup per BRAND.md §3: the two self-hosted brand fonts already in this repo —
>   ALK Sanet (display) from `alk-sanet-master/fonts/` and BPG Nino Mkhedruli (text)
>   from `bpg-nino-mkhedruli-master/fonts/`. Copy the woff2/woff files into the
>   project and load them with `next/font/local`; add IBM Plex Mono via next/font for
>   document apparatus. Both brand fonts are single-weight regular: set
>   `font-synthesis: none` and build the whole typographic scale from size, spacing,
>   and color — no bold anywhere. Verify Georgian glyphs render from the brand fonts,
>   not a system fallback.
> - i18n scaffolding: Georgian (ka) default locale, English (en) secondary, with the
>   typographic `ქარ / ENG` switcher described in BRAND.md §7.
> - Base components that embody the layout language: `Rule` (1px espresso hairline),
>   `Eyebrow` (mono all-caps spaced label like "§ 03 — FAMILY LAW"), `StampButton`
>   (primary and secondary variants per BRAND.md §4), `Seal` (the circular guaranteed
>   stamp as inline SVG with text on a circular path, brass linework), `LedgerRow`
>   (label + dot-leader + mono price).
> - A `/styleguide` page that renders all tokens and components on cream so I can
>   review the brand before any real page exists.
>
> Constraints: obey BRAND.md §6 (banned patterns) with zero exceptions. No component
> library (no shadcn defaults, no Radix theming) — everything hand-styled.

Review `/styleguide` in the browser. Fix the foundation until the seal, buttons, and
type feel right. Do NOT proceed to pages while the foundation is off — every page
inherits its flaws.

## MASTER PROMPT — build everything from scratch in one run (fresh chat)

Self-contained: assumes nothing, clears any previous attempt, builds foundation
and the complete site. The self-review loop is delegated to the agent, so inspect
the final screenshots hard and run the critique loop (Prompt 3) afterward on
anything that looks off.

> Read @BRAND.md @ENGINEERING.md @content.md fully before writing any code. They are
> binding law: BRAND.md governs every visual decision, ENGINEERING.md every technical
> one, content.md is the only source of content (use it verbatim — never invent
> services, prices, lawyers, or reviews). BRAND.md §6 is a hard ban list — if any
> output matches it, that output is wrong regardless of how it looks.
>
> CLEAN SLATE: this repo may contain a previous build attempt. Delete all app code
> (package.json, src/, app config files, node_modules, lockfiles) but PRESERVE:
> BRAND.md, ENGINEERING.md, content.md, PROMPTS.md, alk-sanet-master/,
> bpg-nino-mkhedruli-master/. Start fresh.
>
> TASK: Build the COMPLETE LawMarket website from scratch — production-ready design,
> finished UX, one step from live. Do not stop for approval between stages; work
> through everything below and finish.
>
> STAGE 0 — FOUNDATION
> - Next.js (App Router, latest) + TypeScript strict + Tailwind v4. No component,
>   icon, or animation libraries anywhere — everything hand-styled.
> - zod schemas (PracticeArea, Service, Lawyer, CaseEntry, Review, Order) in
>   src/schemas/; typed data in src/data/ seeded verbatim from content.md, parsed
>   through the schemas at module load so bad data fails the build; all access via
>   src/lib/repository.ts only. .env.example with placeholder keys.
> - Fonts per BRAND.md §3: copy woff2 from alk-sanet-master/fonts/ and
>   bpg-nino-mkhedruli-master/fonts/ into src/fonts/, load via next/font/local
>   (ALK Sanet = display, BPG Nino Mkhedruli = text), IBM Plex Mono via
>   next/font/google. Both brand fonts are single-weight regular: font-synthesis:
>   none, no bold anywhere — hierarchy only from size, spacing, color, rules. No
>   text-transform: uppercase on Georgian. Verify Georgian renders from brand fonts,
>   not fallbacks.
> - Design tokens in globals.css exactly per BRAND.md §2, mapped through @theme so
>   bg-paper / text-ink / text-stamp etc. exist.
> - i18n per ENGINEERING.md §5: ka default at /, en at /en; proxy.ts (NOT
>   middleware.ts) rewrites unprefixed → /ka internally and 301s direct /ka/... hits
>   to unprefixed; <html lang> set in the [locale] root layout; dictionaries in
>   src/locales/ — zero hardcoded strings in components.
> - Brand components: Rule, Eyebrow, StampButton (primary burgundy / secondary
>   bordered, sharp corners, press-down hover ≤200ms), Seal (circular "LAWMARKET ·
>   GUARANTEED ·" text path around the engraved L-pillar, brass linework), LPillar
>   (logo + favicon: L whose vertical stroke is a classical column — capital, base,
>   2–3 fluting hairlines), LedgerRow (label · dot-leader · mono ₾ price).
> - /styleguide as a hidden dev page (not linked from nav) showing tokens,
>   components, and both scripts.
>
> STAGE 1 — THE SITE (all pages, both locales)
> 1. Homepage (/): a complete, dense working document. Mono eyebrow + large ALK
>    Sanet statement hero (asymmetric editorial grid, left-aligned, seal stamped
>    over the closing rule). Then the FULL services ledger — all 15 services grouped
>    by practice area (§ NN · name · dot-leader · mono ₾ price) with a real-time
>    client-side search on a rule-underlined input filtering as the user types
>    (both locales, zero layout jump, typeset empty state). Then the guarantee as
>    numbered signed clauses (exact content.md wording). Then the lawyers register
>    preview: 3 rule-separated rows with the engraved-monogram device — no photos,
>    no avatars. Espresso footer colophon: seal, mono legal text, nav,
>    jurisdictions. No filler sections, no dead whitespace; vary section density
>    per BRAND.md §4.
> 2. /services/[slug] × 15: what's included, price, guarantee terms, assigned
>    lawyer(s), StampButton into checkout.
> 3. /lawyers (full bar register) and /lawyers/[slug]: case-file layout — identity
>    header, then two registers side by side split by a vertical hairline:
>    completed cases left (typed array, mono case codes + dates), reviews right
>    (typeset empty state from content.md, layout ready for real entries). Stacked
>    on mobile, cases first.
> 4. /checkout: guest only (name, email, Georgian phone). Order summary typeset as
>    an engagement letter; price read server-side from the repository, never from
>    the client. Payments ONLY through the provider interface in
>    src/lib/payments/provider.ts with a MockProvider (fake approval screen) — NO
>    real Flitt integration. Orders behind an OrderStore interface (in-memory).
>    Design ALL states: success (confirmation stamps the seal on the executed
>    order, mono reference LM-YYYY-NNNNN), declined, cancelled, network failure —
>    each in the document voice. Idempotent updates, double-submit protection.
> 5. /guarantee, /about, /terms, /privacy — typeset like legal instruments, copy
>    written in the content.md voice, both locales.
> 6. Branded 404/500: "§ 404 — ეს მუხლი არ არსებობს / This clause does not exist."
> 7. Persistent header: L-pillar wordmark, nav, ქარ / ENG switcher (mono, active
>    underlined, preserves route). Mobile nav = full-screen espresso document
>    index, not a hamburger drawer with gray dividers.
>
> UX REQUIREMENTS (this is a store — buying must be effortless):
> - From landing to checkout in at most 2 clicks: ledger row → service page →
>   checkout. The purchase path is always visible and obvious.
> - Every interactive element has a designed hover, focus, and active state
>   (≤200ms, ease-out). Nothing moves on scroll; no parallax; zero layout shift.
> - Forms: labels always visible, inline validation on blur with burgundy rule +
>   mono message under the field, large tap targets (≥44px), correct input types
>   and autocomplete attributes, Georgian phone format accepted.
> - Search: instant, keyboard operable, results announced via aria-live="polite",
>   visible result count, one-keystroke clear.
> - Mobile is a designed narrow-column document, not generic stacking: rules and
>   ledger structure survive at 375px, type scale steps down proportionally.
> - Semantic HTML, heading order, on-brand focus rings, prefers-reduced-motion
>   respected. Static generation everywhere except checkout.
>
> SEO: per-page generateMetadata (unique titles/descriptions both locales),
> canonical + hreflang alternates per page, JSON-LD (LegalService org; Service +
> Offer with GEL price per service page; Person per lawyer), sitemap.xml +
> robots.txt generated from the repository.
>
> SELF-REVIEW LOOP (mandatory per page, do not skip): render at 1440px and 375px,
> review against BRAND.md as a ruthless art director — list the 10 most
> template-like/AI-generated things, fix the top 5, THEN move on. Uniform section
> rhythm, centered symmetric layouts, card grids, gray backgrounds, rounded
> corners, and dead whitespace are automatic failures.
>
> FINISH LINE: npm run build passes clean (types, lint, schema validation); every
> page works in both locales; checkout completes end-to-end against MockProvider;
> no BRAND.md §6 violation anywhere. Finish with: a list of every page built, and
> screenshots of homepage, one service page, one lawyer profile, and the checkout
> confirmation at 1440px and 375px. Do not ask me questions — the three documents
> answer everything; when truly ambiguous, choose whatever looks most like a
> beautifully typeset legal document.

## Prompt 2 — One section at a time (repeat per section)

Never ask for "the homepage." Ask for one section with its real content pasted in:

> Using @BRAND.md and our existing components, build ONLY the hero section of the
> homepage. Concept: the page opens like the first page of a formal legal instrument.
>
> - Asymmetric editorial grid: the serif headline spans ~7 of 12 columns, left-aligned;
>   a mono eyebrow above it ("LAWMARKET — LEGAL SERVICES, GUARANTEED"); a short
>   supporting paragraph and one StampButton offset to the right columns.
> - The guarantee Seal is placed like a real stamp, overlapping the bottom rule of
>   the section, rotated slightly.
> - A full-width 1px rule closes the section. No imagery, no gradient, no cards.
> - Copy comes from @content.md (guarantee wording, service names, prices) — verbatim.
>
> Then stop. Do not build anything else.

Repeat for: services ledger (§ index with dot-leader prices), the lawyers register,
how the guarantee works (numbered clauses 1. 2. 3., not icon cards), footer colophon.

### Section prompt — services ledger with live search

> Using @BRAND.md and @content.md, build the homepage services ledger. It is the
> heart of the homepage: a document-style table of contents of every service —
> `§ NN`, service name, dot-leader, mono ₾ price — grouped by practice area with
> mono eyebrow headings. Above it, a real-time search field that filters the ledger
> as the user types (match service names and practice areas, both locales; filtering
> is instant, client-side, with no layout jump). The input is a bare field on a 1px
> espresso underline with a mono placeholder — not a rounded search pill, no
> magnifying-glass-in-a-gray-box. Empty state: a single typeset line, no illustration.
> Each row links to the service page and shows the guarantee seal small at row end.
> Then stop.

### Page prompt — lawyer profile

> Using @BRAND.md (see "Lawyer profile pages") and @content.md, build the lawyer
> profile page as a case file: identity header with the engraved-monogram device
> (photos come later), bar number and practice areas in mono; then two side-by-side
> registers separated by a vertical hairline — left: achievements and completed
> cases as rule-separated entries with mono case codes and dates (structure the data
> as a typed array so a database can replace it later); right: client reviews with
> brass stars and plain typeset quotes — since no real reviews exist yet, render the
> typeset empty state from @content.md "Reviews", with the layout ready for real
> entries. Both scroll with the page as one document; stacked on mobile, cases
> first. No cards, no avatars, no tabs. Then stop.

### Page prompt — checkout (guest, Flitt)

> Using @BRAND.md, @ENGINEERING.md §3–4, and @content.md, build the checkout flow:
> guest only (name, email, Georgian phone), order summary typeset as an engagement
> letter (ledger rows, rules, service price read server-side from the repository —
> never trusted from the client). Payment goes through the provider interface in
> `src/lib/payments/provider.ts`; implement the `MockProvider` with a fake approval
> screen now, structured so the Flitt adapter drops in later with sandbox keys.
> Design ALL states per ENGINEERING.md §8: success (the confirmation page stamps the
> guarantee seal on the executed order, with mono order reference `LM-YYYY-NNNNN`),
> declined, cancelled, and network failure — each in the document voice, both
> locales. Idempotent order updates, double-submit protection. Then stop.

### Hardening prompt — run once per page after design is approved

> Audit this page against @ENGINEERING.md and fix violations: semantic HTML and
> heading order; on-brand focus states (2px burgundy, never removed); ledger/search
> keyboard operability with aria-live announcements; prefers-reduced-motion; both
> locales complete with correct lang attributes and hreflang; generateMetadata with
> canonical + OG; JSON-LD per §6; validation and error states per §8; no client
> component where a server component would do. Do not change the approved visual
> design while hardening.

### Final prompts — run once near launch

> 1. Build the branded 404 and 500 pages per ENGINEERING.md §8.
> 2. Generate sitemap.xml and robots.txt from the repository layer.
> 3. Add Playwright smoke tests per ENGINEERING.md §11 and a GitHub Actions workflow
>    running type-check, lint, build, and the smoke tests on every push to main.
> 4. Add Plausible (or Umami) and Sentry per §10, non-blocking.
> 5. Run a full Lighthouse pass on mobile; fix anything below the §7 budget.

### Asset prompt — brand mark and icon placeholders

> Per @BRAND.md §4, draw as inline SVGs: (1) the L-pillar logo — an L whose vertical
> stroke is a classical column with subtle capital, base, and 2–3 hairline flutes,
> engraved not illustrated; (2) the favicon from the same mark; (3) the guarantee
> seal with the L-pillar at its center; (4) a placeholder icon set on a shared grid
> (square-cornered 1.5px espresso strokes) for each practice area, to be replaced by
> final custom icons later. Render all of them on /styleguide at multiple sizes.

## Prompt 3 — The critique loop (this is the secret weapon)

After each section renders, screenshot it at desktop (1440px) AND mobile (375px) —
both screenshots, every time — attach them, and run:

> You are a ruthless art director reviewing these screenshots against @BRAND.md.
> List the 10 most template-like / AI-generated things about this section — spacing
> rhythm, symmetry, typography defaults, anything that violates the bible or that a
> generic site would also have — and note anywhere the mobile layout collapses into
> generic stacking instead of a designed narrow-column version of the document.
> Then fix the top 5. Do not add decoration; removing and refining is preferred
> over adding.

Run this loop 2–3 times per section. This is where "AI look" actually dies — first
drafts are always average; humans get to good through revision, and so does the model.

## Prompt 4 — Whole-page rhythm pass (once per page)

> Screenshot review of the full page: check the vertical rhythm against BRAND.md §4
> "Density varies." If sections have uniform height and padding, restructure: make one
> section a single huge serif statement on empty paper, make the services ledger dense.
> Check that burgundy appears ONLY on interactive elements and the seal. Check that no
> two adjacent sections have the same grid structure.

---

## Build order (deadline: August 20)

Run the prompts in this order. Each step's design must be approved (critique loop)
before moving on — the foundation and homepage set the pattern everything else copies.

1. **Foundation** (Prompt 1) + brand-mark/asset prompt → judge `/styleguide` hard.
   Days 1–2. Nothing proceeds until the seal, L-pillar, buttons, and Georgian type
   at display size feel right.
2. **Homepage**, section by section: hero → services ledger with live search →
   guarantee clauses → lawyers register preview → footer colophon. Days 3–5.
3. **Service detail page** and **lawyer profile page** (templates driven by the
   repository layer). Days 5–6.
4. **Checkout** with MockProvider — all states designed (success/declined/
   cancelled/failure). Day 7.
5. **Remaining pages**: /guarantee, /about, /terms, /privacy, 404/500. Day 8.
6. **Hardening prompt on every page**, then the final prompts (sitemap, tests, CI,
   analytics, Lighthouse). Days 8–9. Ship to Vercel preview throughout — review on
   the real URL, not just localhost.

Scope guard: no Flitt connection, no real database, no notification system — mocks
behind the ENGINEERING.md interfaces only. The finished site must be one swap away
from live.

## Rules of thumb

- **Content comes from content.md, verbatim.** The services, prices, lawyers, and
  guarantee there are approved — use them exactly; never lorem ipsum, never invented
  extras. (Generic filler content = template output.)
- **Name references, not adjectives.** "Like a broadsheet newspaper's table of
  contents," "like a notarized deed," "like a wax-sealed letter" — concrete artifacts
  the model can emulate. Never "sleek," "modern," "premium."
- **Ban lists outperform wish lists.** When something looks AI, add it to BRAND.md §6
  and re-run the critique loop.
- **One signature motif, repeated.** The seal + § numbering + dot-leaders carry the
  brand. Resist adding more devices; discipline reads as human.
- If a section fights you after 3 critique loops, delete it and re-prompt from the
  concept sentence rather than patching.
