# Insights and technical SEO

## Publishing an Insight

1. Add one entry to `src/data/insightArticles.json`. Use a unique descriptive `slug`, clear `title` and `description`, a short `intro`, and sections with unique IDs. Keep claims tied to the listed sources.
2. Choose one cluster: `land`, `tax`, or `community`. Give the article exactly one primary `product` path. Add related article slugs that exist in the same file.
3. Run `npm run build`. `src/App.tsx` creates the React routes; `scripts/prepare-pages.mjs` writes indexable HTML, metadata, Article and breadcrumb JSON-LD, and sitemap entries from the same data.
4. Review the generated `dist/insights/<slug>/index.html` and open the route on a phone-sized viewport. Check the source links and the product CTA before publishing.

The Insights index and article pages use data-driven layouts. Existing `/insights/#coordinate-systems` and `/insights/#geojson-basics` links remain available for the tools. Do not add a publication date unless there is a verified publication date to display.

## Metadata for other routes

- `src/data/sitePages.json` describes Home, Contact, Privacy, and the Insights index.
- `src/data/parcelPages.json` describes Parcel Plotter pages.
- `src/data/toolPages.json` describes the Tools index and live tools.
- `src/data/lguProductPages.json` describes the SPARTA and RBIM Cloud product and guide routes.
- `src/shared/utils/RouteMetadata.tsx` updates metadata and structured data during client navigation.
- `scripts/prepare-pages.mjs` generates the corresponding HTML for direct requests on GitHub Pages. Add a new route to both the React router and the build generator, then include it in the sitemap. Use `https://spatialdom.xyz/<path>/` as its canonical URL.

The base document includes Organization and WebSite structured data with supported brand facts. Route JSON-LD adds Article only for article content and BreadcrumbList for deeper pages. Do not add ratings, addresses, customer counts, or dates without verified source data.

## Search Console handoff after deployment

1. Verify ownership of `spatialdom.xyz` in Google Search Console using the DNS or other supported method controlled by the site owner.
2. Submit `https://spatialdom.xyz/sitemap.xml` in the property.
3. Inspect the homepage, `/insights/`, one URL from each Insight cluster, `/tools/`, both live tools, and the Parcel Plotter guides. Confirm the selected canonical URL is the public trailing-slash URL and that the rendered page is available.
4. Monitor indexing coverage and search queries. Investigate excluded or duplicate URLs and update articles when source guidance changes.

The build keeps `public/CNAME`, writes `404.html` for React Router fallback, and generates real `index.html` files for important deep routes. `robots.txt` allows public content and points to the sitemap.
