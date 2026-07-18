# LawMarket

Legal-services marketplace for Georgia. Lawyers publish profiles, list services and show admin-verified successful cases; clients discover providers, message them and book services. Includes a dedicated expat-consultation track for foreigners setting up or operating in Georgia.

Primary language is Georgian, with a full English translation (useful for the expat track).

## Stack

- **Next.js 15** (App Router, TypeScript, Server Actions)
- **Supabase** — Postgres, Auth, Storage, Realtime (RLS on every table)
- **Tailwind CSS 4** with a small hand-rolled shadcn-style component set
- **next-intl** — cookie-based locale switching (`ka` default, `en`)

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. Apply the database schema in `supabase/migrations/` and, optionally, the demo data in `supabase/seed.sql` to your Supabase project.

4. Run the dev server:

   ```bash
   npm run dev
   ```

## Demo accounts (from seed data)

All seeded accounts use the password `Password123!`:

| Email                 | Role     |
| --------------------- | -------- |
| `admin@lawmarket.ge`  | admin    |
| `nino@lawmarket.ge`   | provider |
| `giorgi@lawmarket.ge` | provider |
| `tamar@lawmarket.ge`  | provider |
| `client@lawmarket.ge` | client   |

## Key flows

- **Provider**: sign up → onboarding → publish profile + services → submit cases with case number and proof → admin approves → verified cases appear publicly.
- **Client**: browse `/lawyers` with filters → view profile → message or book → pay (stubbed for now).
- **Expat**: apply at `/expat/apply` → admin accepts/rejects → after acceptance the client pays and a call is scheduled.
- **Admin**: `/admin/cases` and `/admin/applications` review queues.

## Payments

Payments are currently **stubbed**: the full booking/checkout UI exists, but the "pay" step records a fake successful payment. The `app/api/webhooks/payments` route is reserved for the future BOG iPay integration.

## Deployment

The repo deploys to Vercel. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project environment variables.
