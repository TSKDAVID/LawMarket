# LawMarket

Premium legal-services marketplace for Georgia.

**Stack:** Next.js (App Router, TypeScript) · Supabase · Tailwind CSS · shadcn/ui

## Important: do not use GitHub Pages

This app uses **Server Components, middleware, Server Actions, and cookie-based auth**.  
**GitHub Pages only serves static files** — it cannot host LawMarket.

If you enabled **Settings → Pages → GitHub Actions**, turn Pages **off** for this repo.  
Use **Vercel** (connected to this GitHub repo) instead.

---

## Local development

1. Copy env and fill keys:

```bash
cp .env.example .env.local
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Database (already applied on the linked LawMarket Supabase project):

```bash
npx supabase link --project-ref gqgoulzulbfejzertqzj
npx supabase db push
npx supabase db query -f supabase/seed.sql
```

---

## Deploy for testing (recommended): GitHub → Vercel

### What you do once

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import `TSKDAVID/LawMarket`.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (**Production** and **Preview**):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gqgoulzulbfejzertqzj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your publishable / anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your **secret** / service_role key (server only) |
| `NEXT_PUBLIC_SITE_URL` | your Vercel URL, e.g. `https://lawmarket.vercel.app` |

4. Deploy. Every push to `main` will auto-deploy.
5. In Supabase → **Authentication → URL configuration**:
   - Site URL = your Vercel URL
   - Redirect URLs include `https://YOUR-APP.vercel.app/**` and `http://localhost:3000/**`

### What GitHub Actions already does

- **CI** (`.github/workflows/ci.yml`): on every push/PR to `main`, runs `lint` + `build` so broken code is caught before deploy.
- **Optional Vercel Actions deploy** (`.github/workflows/deploy-vercel.yml`): only needed if you prefer Actions over Vercel’s GitHub integration. Leave it off unless you add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets.

---

## Checklist

- [ ] Disable GitHub Pages on this repo (if enabled)
- [ ] Import repo in Vercel and set the 4 env vars above
- [ ] Paste **secret** key into Vercel + local `.env.local` (`SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Add Vercel URL to Supabase Auth redirect allow-list
- [ ] Confirm CI is green on GitHub → Actions

## Phase 1 status

- Design system + Georgian homepage
- Full schema, RLS, storage buckets, `handle_new_user` trigger
- Auth (signup/login/onboarding) — profiles created by DB trigger
- Expat consultation apply flow (placeholder criteria, submittable)
- `lib/data/*` service layer (admin via `lib/data/admin.ts`)
- GitHub Actions CI + Vercel deploy docs

## Scripts

- `npm run dev` — local Next.js
- `npm run build` — production build
- `npm run lint` — ESLint
