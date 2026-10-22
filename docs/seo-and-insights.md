# Insights and technical SEO

## Google Search site name

This repository is the main **Spatialdom** brand website, with canonical homepage **https://spatialdom.xyz/**, as confirmed by `public/CNAME`, the homepage title, header, hero label, and footer. These values apply to this repository, not automatically to other Spatialdom products or subdomains. `src/data/siteIdentity.json` declares this identity for route metadata, static generation, and validation. The source `index.html` also contains the literal identity so it is present before JavaScript executes; the build checks it for consistency.

The audit found that both the repository and the live homepage already had the correct `WebSite.name`, `WebSite.url`, title, description, and canonical URL. The missing supporting signal was `og:site_name`. The live HTTPS homepage returned 200 without a `noindex` robots directive or `X-Robots-Tag`; robots.txt allowed crawling and advertised a sitemap containing the homepage. HTTP and `www` resolved to the canonical HTTPS homepage. These checks establish crawl eligibility, not actual Google indexing or the reason Google selected the domain label; that requires Search Console inspection.

The HTML head now contains one `og:site_name` and one `site-jsonld` graph containing a single WebSite node and a single Organization node linked with stable IDs. Existing title/description/canonical values and visible branding remain unchanged. Route-specific Article and BreadcrumbList data remain in `route-jsonld`; client navigation updates only that route graph and preserves the site graph. Do not inject another WebSite node from a component or tag manager. No alternate brand name is claimed because the repository establishes only Spatialdom.

The supplied ICO is served at the stable `/favicon.ico` URL from `public/favicon.ico`, rather than a filename containing an asset hash. It includes square 16, 32, and 48 pixel images. Replace `public/favicon.ico` to update the published favicon; the copy under `src/assets/` is not the served favicon source. The homepage HTML, metadata, structured data, favicon, robots.txt, and sitemap are all in the static build output. GitHub Pages serves them directly, without requiring React execution. No page layouts or visible copy were changed for this SEO update.

`npm run build` validates the initial HTML for every generated route: one title/description/canonical and Open Graph/Twitter property, consistent site identity and WebSite URL, linked Organization, available stable favicon, and no noindex directive. It also checks canonical/sitemap agreement and route-specific structured data.

After deployment, verify manually:

1. Open **View Source** for `https://spatialdom.xyz/`. Confirm one WebSite node with `name: Spatialdom`, `url: https://spatialdom.xyz/`, one `og:site_name: Spatialdom`, the existing branded title/description, and one canonical homepage link. Use View Source, not only the browser's post-JavaScript Elements panel.
2. Open `/favicon.ico`, `/robots.txt`, and `/sitemap.xml`. Confirm successful responses, the expected icon, crawling allowed for the homepage and icon, and the canonical homepage listed once in the sitemap. Check that homepage response headers have no restrictive `X-Robots-Tag`.
3. Check that `http://spatialdom.xyz/` and `https://www.spatialdom.xyz/` redirect to `https://spatialdom.xyz/` rather than serving conflicting identities.
4. Validate the homepage with [Schema Markup Validator](https://validator.schema.org/). Google's Rich Results Test does **not** support site-name validation.
5. In Google Search Console, inspect the canonical homepage, run **Test live URL**, review crawl/indexing eligibility and Google's selected canonical, and request indexing after the new build is deployed. Submit/confirm the sitemap there as well.
6. Recheck search appearance after Google recrawls. Site names are selected automatically; these signals express the preference and do not guarantee a particular label or immediate update.

References: [Google site-name documentation](https://developers.google.com/search/docs/appearance/site-names), [favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search), [title links](https://developers.google.com/search/docs/appearance/title-link), [snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet), and [robots metadata](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

## Publishing an Insight

1. Follow [the editorial workflow](insights-editorial-workflow.md) and add one `src/data/insights/<slug>.json` file. Use a unique descriptive `slug`, clear `title` and `description`, a short `intro`, and sections with unique IDs. Keep claims tied to the listed sources.
2. Choose a content cluster. Give the article exactly one primary `product` path. Related article slugs must point to existing articles. The public manifest shows these links only when their targets are published, so drafts can be released independently.
3. After Dominic approves the saved draft in the local review dashboard and commits/merges/pushes it, the weekly publisher promotes its article state. GitHub issue approval is also supported for articles not managed locally. Run `npm run build` to regenerate the public manifest. `src/App.tsx` creates public routes only for published Insights; `scripts/prepare-pages.mjs` writes indexable HTML, metadata, Article and breadcrumb JSON-LD, and sitemap entries from the same public data.
4. Review the generated `dist/insights/<slug>/index.html` and open the route on a phone-sized viewport. Check the source links and the product CTA before publishing.

The Insights index and article pages use data-driven layouts. Existing `/insights/#coordinate-systems` and `/insights/#geojson-basics` links remain available for the tools. Do not add a publication or review date unless it is verified.

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
