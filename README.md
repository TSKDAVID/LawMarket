# Law Market

Bilingual (Georgian / English) marketplace for fixed-price legal services in Georgia.

**Live site (after Pages is enabled):** https://lawmarket.ge  
**GitHub Pages URL:** https://TSKDAVID.github.io/LawMarket/

Georgian is the default locale (`/`, also `/ka/`). English lives under `/en/`.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/ka`).

## Production build (static export)

```bash
npm run build
```

Output is written to `out/` for GitHub Pages. A post-build step hoists the Georgian (`ka`) pages to the site root and writes `.nojekyll`.

## Deploy to GitHub Pages + custom domain

This repo deploys automatically on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### One-time GitHub setup

1. Open https://github.com/TSKDAVID/LawMarket/settings/pages
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Open the **Actions** tab and confirm the **Deploy to GitHub Pages** workflow succeeds
4. After the first green run, the site is live

### Connect `lawmarket.ge` (or your domain)

1. In **Settings → Pages → Custom domain**, enter `lawmarket.ge` and save  
   (this repo already includes [`public/CNAME`](public/CNAME))
2. Enable **Enforce HTTPS** once DNS has propagated
3. At your DNS provider, add:

| Type | Name | Value |
|------|------|--------|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `TSKDAVID.github.io` |

GitHub’s current Pages IPs are listed in [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

DNS can take from a few minutes up to 48 hours.

## Stack

- Next.js (App Router) static export
- next-intl (ka default, en at `/en`)
- Tailwind CSS v4
- Placeholder marketplace data in `data/`
