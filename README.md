# LawMarket

Premium legal-services marketplace for Georgia.

**Stack:** Next.js (App Router, TypeScript) · Supabase · Tailwind CSS · shadcn/ui

## Local development

1. Copy env file and fill Supabase keys:

```bash
cp .env.example .env.local
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Apply database migrations (remote project or local CLI):

```bash
# Link to your Supabase project, then:
npx supabase db push
npx supabase db query -f supabase/seed.sql
```

Or paste `supabase/migrations/20260718000001_init.sql` and `supabase/seed.sql` into the Supabase SQL editor.

## GitHub → Vercel deployment

1. Push this repo to GitHub (`TSKDAVID/LawMarket`).
2. Import the repo in [Vercel](https://vercel.com) (Framework: Next.js).
3. Set environment variables (Production + Preview):

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose to client |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://your-app.vercel.app` |

4. In Supabase Auth → URL configuration, add your Vercel URL(s) to redirect allow-list.
5. Run the init migration + seed on the hosted Supabase project before testing signup.

## Phase 1 status

- Design system + Georgian homepage
- Full schema, RLS, storage buckets, `handle_new_user` trigger
- Auth (signup/login/onboarding) — profiles created by DB trigger
- Expat consultation apply flow (placeholder criteria, submittable)
- `lib/data/*` service layer (admin via `lib/data/admin.ts`)

## Scripts

- `npm run dev` — local Next.js
- `npm run build` — production build
- `npm run lint` — ESLint
