# Spatialdom

Frontend-only site for `spatialdom.xyz`, built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion. The homepage remains the core brand experience, while a separate `/tools/*` route family supports lightweight geospatial micro tools.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

`npm run build` copies the Vite entry to `dist/404.html` for SPA fallback routes. It also generates indexable HTML with route-specific metadata for Home, Contact, Privacy, Insights and its articles, Parcel Plotter, SPARTA, RBIM Cloud, and tools, plus `sitemap.xml` and `robots.txt`. See `docs/seo-and-insights.md` for the content workflow and Search Console handoff, and `docs/lgu-product-pages.md` for the LGU page briefs.

## Deploy to GitHub Pages

The site is static and deploys to GitHub Pages from the built `dist/` output.

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that:

- builds the Vite app on pushes to `master`
- uploads `dist/`
- publishes that artifact to GitHub Pages
- preserves SPA routing support through the generated `404.html` fallback

In the repository settings, set:

- `Settings > Pages > Source` to `GitHub Actions`

Do not publish from the repository root. The root `index.html` is the Vite source entry and points to `/src/main.tsx`, which GitHub Pages cannot serve as a browser module.

## Base path for GitHub Pages

The Vite base path is configurable through `VITE_BASE_PATH`.

- Custom domain deployment like `https://spatialdom.xyz/`: leave it unset. The default base is `/`.
- Repository-path deployment like `https://username.github.io/repo-name/`: set `VITE_BASE_PATH=/repo-name/` before building.

Examples:

Windows PowerShell:

```powershell
$env:VITE_BASE_PATH="/repo-name/"
npm run build
```

macOS / Linux:

```bash
VITE_BASE_PATH=/repo-name/ npm run build
```

## Custom domain

- Keep `public/CNAME` committed with the domain value.
- GitHub Pages will copy it into the deployed output automatically.
- If the custom domain changes, update `public/CNAME`.
- For `spatialdom.xyz`, point the DNS records to GitHub Pages and keep the custom domain configured in `Settings > Pages`.

## Deployment checklist

1. Run `npm ci && npm run build`. Confirm `dist/CNAME` is `spatialdom.xyz`, `dist/404.html` exists, and `dist/sitemap.xml` and `dist/robots.txt` include the intended public URLs. The build validates all generated route pages.
2. Confirm `Settings > Pages > Source` is `GitHub Actions`, the custom domain is `spatialdom.xyz`, and **Enforce HTTPS** is enabled. Keep `VITE_BASE_PATH=/` for this domain.
3. Push to `master` or run the Pages workflow manually. Wait for both the build and deploy jobs to succeed, then confirm the published site reflects that commit.
4. On `https://spatialdom.xyz/`, check the home page, one product page (`/parcel-plotter/`, `/sparta/`, or `/rbim-cloud/`), an Insights article, an SEO guide, `/privacy/`, `/tools/coordinate-converter/`, and `/tools/geojson-viewer/`. Open each URL directly and refresh it. Confirm the page, title, and navigation load after refresh.
5. Check `https://spatialdom.xyz/sitemap.xml` and `https://spatialdom.xyz/robots.txt`, and confirm the sitemap lists the published routes. Check a missing route returns the generated `404.html` fallback rather than a GitHub default error page.
6. Smoke test the main product and contact CTAs: mail links address `spatialdom@gmail.com`, and Parcel Plotter opens `https://parcel.spatialdom.xyz/` outside React Router. Check the mobile menu and both micro tools.
7. To roll back, revert the release commit on `master` and let the same workflow redeploy. If a direct route fails, inspect the Pages artifact for its `index.html`, `404.html`, and `CNAME` files before changing routing.

## Micro Tools Foundation

`/tools/` is the free utility directory. Coordinate Converter and GeoJSON Viewer have direct-refresh HTML pages with unique metadata and sitemap entries. Their task controls stay above short usage guidance; the GeoJSON viewer reads selected files in the browser and uses cooperative map gestures on mobile. See `docs/tools-pages.md` for the page briefs and event hooks.

The app now uses React Router with a split between the existing homepage and a scalable tools subsystem:

- `/` keeps the homepage structure largely intact through `src/pages/HomePage.tsx`.
- `/privacy` serves a lightweight privacy policy suitable for an early-stage frontend-only product.
- `/tools` acts as the launcher for Spatialdom micro tools.
- `/tools/coordinate-converter` is the first live tool.

Architecture choices:

- `src/shared/layout/MainLayout.tsx` wraps the site-wide shell, navigation, and footer.
- `src/shared/layout/ToolLayout.tsx` provides a reusable tool-page structure without forcing ads onto every tool page.
- `src/shared/ads/ToolAdSlot.tsx` is reserved for tool pages only; the homepage remains ad-free.
- `src/lib/coordinates.ts` contains reusable coordinate conversion and validation logic for future geospatial tools.
- `scripts/prepare-pages.mjs` prepares the SPA fallback and the static Parcel Plotter discovery pages from `src/data/parcelPages.json`.

Extending the tools system:

1. Add a new page under `src/tools/<tool-name>/`.
2. Add a route in `src/App.tsx`.
3. Add a launcher card in `src/pages/ToolsPage.tsx`.
4. Reuse `ToolLayout`, shared UI, and `ToolAdSlot` only where ads are intended.

## Project structure

```text
src/
  components/
    layout/
    ui/
  data/
  hooks/
  lib/
  pages/
  sections/
  shared/
    ads/
    layout/
  tools/
  styles/
scripts/
  prepare-pages.mjs
```

## Notes

- Homepage product paths and supporting content live in `src/data/homeContent.ts`; Parcel Plotter guides live in `src/data/parcelPages.json`.
- The site remains frontend only: no backend, no database, and no server-side rendering.
