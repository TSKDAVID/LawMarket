# LawMarket

A register of legal services with a written guarantee — Georgian (ka) primary at `/`,
English at `/en`. Built as a beautifully typeset legal instrument per `BRAND.md`
(design law), `ENGINEERING.md` (technical law), and `content.md` (the only content
source).

## Stack

- Next.js 16 (App Router, Turbopack) · TypeScript strict · Tailwind CSS v4 · zod
- No component/icon/animation libraries — everything hand-styled
- Self-hosted brand fonts: ALK Sanet (display), BPG Nino Mkhedruli (text),
  IBM Plex Mono (document apparatus)

## Run

```bash
npm install
cp .env.example .env.local   # fill in what you have; mock defaults work
npm run dev                  # http://localhost:3000
```

Quality gates:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e             # Playwright smoke tests (build first)
```

## Architecture ("one swap from live")

- **Data** — typed modules in `src/data/`, validated by zod schemas
  (`src/schemas/`) at module load; all access through `src/lib/repository.ts`.
  A database later replaces only that file.
- **Orders** — `OrderStore` interface with an in-memory implementation
  (`src/lib/orders/store.ts`). Real persistence (Vercel KV / Postgres) swaps the
  implementation only.
- **Payments** — provider interface in `src/lib/payments/provider.ts` with a
  `MockProvider` (fake approval terminal, HMAC-signed callbacks, idempotent
  updates). The Flitt adapter drops in behind the same interface; its webhook
  target is `/api/payments/callback`.
- **i18n** — `src/proxy.ts` rewrites unprefixed traffic to the internal `/ka`
  segment and 301s direct `/ka/...` hits; dictionaries in `src/locales/`.
- **SEO** — per-page metadata with canonical + hreflang, JSON-LD
  (LegalService / Service+Offer / Person), `sitemap.xml` and `robots.txt`
  generated from the repository.

`/styleguide` is a hidden dev page showing tokens, components, and both scripts.

## Placeholders to replace before launch

- Services, prices, lawyers in `src/data/` (owner-approved placeholders)
- Lawyer case entries flagged `placeholder: true` (rendered with a SPECIMEN tag)
- Company identification number and privacy contact in `src/locales/*.json`
- `PAYMENT_PROVIDER=mock` → Flitt credentials in env, plus the Flitt adapter
- `SENTRY_DSN` wiring (error tracking) — analytics (Plausible) is env-gated already
