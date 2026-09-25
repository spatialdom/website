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

`npm run build` copies `dist/index.html` to `dist/404.html` for SPA fallback routes. It also generates static HTML entries with page-specific metadata and readable content for the three Parcel Plotter routes, plus `sitemap.xml` and `robots.txt`.

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

1. Push to `master` or run the Pages workflow manually.
2. Confirm GitHub Pages is set to `GitHub Actions`.
3. Confirm `public/CNAME` contains `spatialdom.xyz`.
4. After deploy, verify `/`, `/privacy`, `/tools`, `/tools/coordinate-converter`, and the three Parcel Plotter routes listed in `docs/parcel-plotter-pages.md`.
5. If a deep route fails on refresh, confirm `404.html` is present in the deployed Pages artifact and that the custom domain is still attached in the GitHub Pages settings.

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
