# Law Market

Bilingual (Georgian / English) marketplace for fixed-price legal services in Georgia.

**Live site:** https://lawmarket.ge (Vercel)

Georgian is the default locale — `/` redirects to `/ka/`. English lives under `/en/`.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

The app reads three variables; see [`.env.example`](.env.example).

| Variable | Where it's used | Secret |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | no |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **yes** |

The anon key is safe in the browser because row-level security decides what it
can read. The service-role key bypasses RLS completely and must never be
exposed to the client or committed.

## Database

SQL lives in [`supabase/migrations`](supabase/migrations) and is applied in
order:

1. `0001_init.sql` — tables, enums, triggers, and row-level security policies
2. `0002_seed.sql` — catalog content generated from `data/*.ts`
3. `0003_portal.sql` — lawyer portal, past cases, and the approval queue
4. `0004_first_admin.sql` — first signup becomes the super admin

Apply it either by pasting into the Supabase SQL Editor, or with the CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Regenerate the seed after editing anything in `data/`:

```bash
node --experimental-strip-types scripts/generate-seed.mjs
```

### Making the first admin

The first person who signs up at `/signup` becomes the super admin. Later
signups stay clients. Lawyer logins are created from `/admin/lawyers`.

## Deployment

Vercel builds and serves the app on every push to `main`. Set the same three
environment variables in **Project → Settings → Environment Variables**.

The site is server-rendered rather than statically exported, so content edited
in Supabase appears without a rebuild, and admin routes are authorized before
any HTML is sent.

## Stack

- Next.js 16 (App Router), server-rendered on Vercel
- Supabase — Postgres, auth, storage
- next-intl (ka default, en at `/en`)
- Tailwind CSS v4
