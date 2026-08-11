# LAWMARKET — Engineering Bible

Companion to BRAND.md. BRAND.md governs how things look; this file governs how they
are built and behave. Reference both in every build prompt. Any behavior not covered
here must be asked about, not improvised.

## 1. Stack & deployment

- Next.js (App Router) + TypeScript strict + Tailwind. React Server Components by
  default; `"use client"` only where interaction demands it (ledger search, checkout
  form, language switcher if needed).
- Deployed on Vercel via GitHub — every push to `main` auto-deploys production, so
  `main` must always be shippable. Feature work happens on branches; Vercel preview
  deployments are the review surface.
- Secrets (Flitt keys, Sentry DSN) live in Vercel environment variables and
  `.env.local` (gitignored). Never hardcoded, never committed. Provide `.env.example`
  listing required variables.

## 2. Data layer (v1 file-based, database-shaped)

- All content lives in typed data modules under `src/data/` — services, lawyers,
  practice areas — edited by hand and redeployed for now, replaced by a database
  later. Therefore:
  - Define schemas with zod in `src/schemas/`: `Service`, `Lawyer`, `CaseEntry`,
    `Review`, `Order`, `PracticeArea`. Data files are validated against schemas at
    build time — bad data fails the build, not production.
  - Pages never import data files directly. They call an access layer
    (`src/lib/repository.ts`) — `getServices()`, `getLawyer(slug)`, etc. — so the
    database swap later touches one file.
  - IDs and slugs are stable and explicit in the data (never derived from names),
    because they become URLs and future database keys.
- Orders: typed `Order` schema with status enum `received | in_progress | completed
  | refunded`, created at checkout behind an `OrderStore` interface. In the current
  mock stage the store is a simple in-memory/dev implementation — enough to build
  and test the full flow. Real persistence (Vercel KV or a single Postgres table)
  arrives with the backend swap, touching only the store implementation. No
  notification system — out of scope; the order record and Flitt's merchant tools
  are the source of truth.

## 3. Payments — Flitt (spec for later; build MockProvider now)

- **Current stage: do NOT integrate Flitt.** Build everything against the provider
  interface (`src/lib/payments/provider.ts`) with the `MockProvider` only. The rest
  of this section specifies the Flitt adapter that will drop in later, so the
  interface must be shaped to accommodate it.
- Flitt sandbox for GEL checkout, as an adapter behind the interface — the site
  talks to the interface only, so the provider can be replaced without touching UI.
- Flow: order created server-side (price read from the data layer, NEVER from the
  client), redirect/iframe to Flitt, verify the payment callback/webhook signature
  server-side, then mark the order paid and show the confirmation (seal) page.
- Handle and design for: declined payment, user-cancelled payment, webhook retries
  (idempotent order updates), and double-submit protection on the pay button.
- Until real Flitt credentials exist, a `MockProvider` implements the same interface
  with a fake approval screen so the whole flow is buildable and testable today.

## 4. Guest checkout (no accounts)

- No login, no user accounts. Checkout collects: name, email, phone (Georgian format
  accepted), and the service. Confirmation shown on-site; the order reference number
  (mono, document-style, e.g. `LM-2026-00042`) is the client's receipt handle.
- Validate server-side with the same zod schemas used client-side.

## 5. i18n mechanics

- Locale-prefixed routing: `/` (ka default) and `/en/...`. Every user-facing string
  lives in locale dictionaries (`src/locales/ka.json`, `en.json`) — zero hardcoded
  strings in components. Content entities carry both locales in their data fields.
- `hreflang` alternates on every page, locale-aware metadata, and the `ქარ / ENG`
  switcher preserves the current route.
- Dates, currency (₾, Georgian formatting), and plurals via `Intl` APIs with the
  active locale.

## 6. SEO

- Per-page `generateMetadata`: unique title/description both locales, canonical URLs,
  OpenGraph images generated on-brand (cream background, serif title, the seal).
- Structured data (JSON-LD): `LegalService` for the organization, `Service` +
  `Offer` (with GEL price) per service page, `Person`/`Attorney` per lawyer page.
- `sitemap.xml` (both locales) and `robots.txt` generated from the data layer.

## 7. Performance budget

- Fonts: woff2 only, `next/font/local`, `font-display: swap` with metric-adjusted
  fallbacks (`adjustFontFallback`) so the swap doesn't shift layout; preload the two
  brand fonts. `font-synthesis: none` globally.
- Static generation for every page except checkout; the ledger search is the only
  client component on the homepage and ships with zero dependencies (plain filtered
  array, no search library).
- No component libraries, no animation libraries, no icon packages. Lighthouse
  targets on mobile: Performance ≥ 95, zero CLS, LCP under 2s on 4G.
- Images (when lawyer photos arrive): `next/image`, AVIF/WebP, espresso duotone
  applied at build/CSS level.

## 8. States & resilience (every page, every component)

- Branded 404 and 500 pages: typeset like a document clause ("§ 404 — ეს მუხლი არ
  არსებობს / This clause does not exist"), with a rule and a link home. No
  illustrations.
- Every form field: on-brand validation states (burgundy rule + message under the
  field, mono, both locales) — never browser-default bubbles.
- Ledger search empty state: single typeset line, offer to clear the query.
- Checkout: distinct designed states for declined, cancelled, and network failure —
  each states what happened and what to do next, in the document voice.
- Loading: prefer instant static content; where async is unavoidable, subtle
  rule-based skeletons (hairline placeholders), no shimmering gray cards.

## 9. Accessibility

- Semantic HTML (real `nav`, `main`, `table` or `dl` for ledgers, `h1–h3` order).
- Focus visible and on-brand: 2px burgundy underline/outline offset, not the default
  ring, never removed.
- Ledger search fully keyboard operable; results announced via `aria-live="polite"`.
- Contrast: espresso on cream passes everywhere; burgundy on cream passes for text;
  **brass is decorative only** — it never carries information alone (stars always
  accompanied by a numeric value in text).
- `prefers-reduced-motion` disables all transitions/animations.
- Both locales get `lang` attributes correctly (`ka`, `en`) for screen readers.

## 10. Analytics, monitoring, privacy

- Privacy-friendly analytics (Plausible or Umami — cookieless, no consent banner
  required) + Sentry for error tracking, loaded without blocking render.
- Privacy policy and terms pages contain real text (owner-provided), covering
  Georgian personal data protection law and the checkout data collected. Since
  analytics are cookieless and checkout data is contractual necessity, no cookie
  banner in v1 — revisit if marketing pixels are ever added.

## 11. Testing & QA gates

- Playwright smoke tests for the money paths: (1) homepage search filters to a known
  service, (2) service page renders in both locales with correct price, (3) checkout
  completes end-to-end against the MockProvider, (4) 404 renders for a bad slug.
- Type-check, lint, build, and smoke tests run in CI (GitHub Actions) before merge
  to `main` — because `main` auto-deploys.
- Every new section is reviewed at 375px, 768px, and 1440px before it is "done"
  (see PROMPTS.md critique loop — mobile screenshots are mandatory, not optional).
