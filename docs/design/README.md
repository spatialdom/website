# Public design standard

The canonical destination is https://spatialdom.xyz/design/guidelines/.
This branch prepares publication; it does not merge or deploy the website.

Version **1.2.0**, publication date **14 November 2026**. The owner confirmed in
this task that the supplied `1.1.0-draft` package is the approved v1.2 standard.
The four original files are preserved unchanged under `source-supplied/`.
The version labels and current product names were reconciled in the publication
copies. The supplied COMPONENTS.md is a SPARTA implementation inventory with
historical verification claims and local repository paths. It remains available
as an explicitly identified source snapshot; the public component contract
describes the approved rules and the website examples without presenting those
historical SPARTA checks as website results.

## Architecture and sources

- `GUIDELINES.md`, `COMPONENTS.md`, `AGENTS_SNIPPET.md`, `tokens.json`: versioned
  publication sources. The geospatial, privacy, precision and professional
  accountability requirements remain explicit.
- `../../scripts/design-content.mjs`: a small escaped renderer for the supplied
  Markdown subset, shared by the React page and static HTML generator. No new
  runtime dependencies. Raw HTML is escaped and unsafe link schemes are omitted.
- `../../src/pages/DesignGuidelinesPage.tsx`: contents navigation, full reading
  area, live section indication, copy control and local adoption instructions.
- `../../src/components/design/ComponentExamples.tsx`: synthetic examples using
  existing buttons and native inputs, selects, modal dialog, tabs and tables.
- `../../src/styles/guidelines.css`: restrained responsive layout. Generated
  scoped CSS maps the token manifest to existing semantic role names. Legacy
  product/site token values are not globally replaced. Source Sans 3 and approved
  logo assets are reused; primary marketing navigation retains its items.
- `../../scripts/prepare-pages.mjs`: extends the current Pages pipeline, producing
  `dist/design/guidelines/index.html`, metadata, breadcrumbs and sitemap entry.
  Full normative text and agent instructions remain readable without JavaScript;
  interactive examples have a raw component-reference fallback.
- Raw files are generated under `/design/`; unchanged originals are under
  `/design/source/`. Generated JSON/CSS/public copies are ignored and regenerated
  by `predev` and `build`. Edit the checked-in sources, not generated output.

The document cites the September 2026 Spatialdom Product Design Rulebook and
historical Vercel/WCAG references as supplied provenance. This implementation
uses the supplied Spatialdom material rather than reproducing Vercel styling or
copy. It does not claim a new independent standards or legal audit.

## Product naming and URLs

- `/sparta/` remains available and now describes the professional Geodetic
  Engineering workspace, with a path to the tax-mapping educational material.
- `/kadastra/` identifies the future LGU tax-mapping and property-assessment
  platform: **Coming soon. Development deferred until after SMACCs.** There is no
  subscription, demo, deployment offer or invented launch date for Kadastra.
- Existing tax-mapping guide and Insight URLs are retained. Their product links
  and copy now identify Kadastra with its deferred status. Related links,
  breadcrumbs, homepage, footer, contact copy and generated HTML agree.
- RBIM Cloud attribution and demo behavior and Parcel Plotter content remain.
  All previous configured route slugs remain; only `design/guidelines` and
  `kadastra` were added. No redirects are required. `/sparta/` changes topic under
  the correct product name, so search snippets may take time to refresh.

## Adoption and governance

Each consuming repository copies all four publication files into `docs/design/`,
pins **1.2.0**, records the upstream commit and actual adoption date, and adds the
agent snippet to local AGENTS.md through a reviewed PR. Consumers keep their own
domain specifications and authoritative computation libraries. Applications do
not fetch this website at runtime.

Future changes require a design decision, version increment, changelog and
synchronized guideline/component/agent/token files. Review affected products,
token differences, keyboard, responsive and domain behavior. Each repository
adopts an upgrade explicitly; record exceptions with rule, reason, impact, owner
and review date. Do not silently move version pins or overwrite legacy palettes.
The 1.2.0 changelog is in GUIDELINES.md. Source archive files remain unchanged.

## Validation and screenshots

Executed locally on Windows with installed Chrome:

| Check | Result |
| --- | --- |
| `npm ci` (`npm.cmd ci` on this host) | Pass; lockfile unchanged |
| `npm run build` | Pass: TypeScript, Vite, 28 canonical pages, SEO, sitemap and structured data |
| `npm run test:design` | Pass: 2 content/version/escaping tests |
| `npm run test:insights` | Pass: 9 existing editorial and review tests |
| `npm run validate:tiepoints` | Exit 0; 181/185 within tolerance, 4 outliers in unchanged coordinate data |
| `python scripts/verify-design-browser.py` | Pass at 390/768/1024/1440px and native Chrome 200% zoom (720 CSS px) |
| Configured route comparison against origin/master | All prior routes preserved |
| `git diff --check` | Pass |

The browser harness checks direct load/refresh, title/canonical, unique IDs,
overflow, anchors below navigation, actual clipboard content, validation/input
preservation, keyboard tabs, modal focus containment/Escape/return, visible focus,
raw links and product routes. The build additionally checks raw-file parity,
internal design links/assets and sitemap/structured-data consistency. Install
Python Playwright separately to run the optional browser harness; it is not a
website dependency. Start `npm run preview -- --host 127.0.0.1 --port 4173` first.

Screenshots, captured from the production preview with synthetic data:

- [Desktop guidelines](screenshots/guidelines-1440.png)
- [Mobile guidelines](screenshots/guidelines-390.png)
- [Desktop components](screenshots/components-1440.png)
- [Mobile components](screenshots/components-390.png)
- [Native 200% zoom](screenshots/guidelines-zoom-200.png)

Remaining limits: physical devices, mobile Safari, other browser engines and
screen-reader acceptance require manual review. These checks do not certify full
WCAG conformance. The unchanged dependency lock reports 11 audit findings
(3 moderate, 7 high, 1 critical). Vite reports large chunks and stale Browserslist
data. No unrelated dependency upgrade or coordinate-data correction is included.

## Files changed

Created the four publication sources and four source snapshots, this README,
screenshots, content generator and tests, browser harness, guidelines page,
component examples, guidelines stylesheet and professional SPARTA page.

Added `.gitattributes` to retain intentional Markdown hard breaks and preserve
the source snapshot bytes. Modified `.gitignore`, `package.json`, `src/App.tsx`, `sitePages.json`,
`lguProductPages.json`, `homeContent.ts`, `contact.ts`, the three tax-mapping
Insight JSON sources, `RouteMetadata.tsx`, Navbar, Footer, ContactContent,
LguProductPage, `prepare-pages.mjs` and `validate-seo.mjs`. The original untracked
`docs/design/index.html` is outside this implementation and remains untouched.

## Manual release checks

1. Review the PR, source normalization, Kadastra status and screenshots. Complete
   screen-reader and real-device acceptance before release.
2. Merge only through the repository's normal approval process. This task does
   not merge, trigger deployment or change hosting, DNS, secrets or workflows.
3. After an authorized deployment, open the custom-domain guidelines URL and
   refresh it, then open a section deep link and each raw Markdown/JSON URL.
4. Verify canonical/Open Graph metadata and breadcrumbs in served HTML; confirm
   the sitemap entry and custom-domain root assets. Confirm footer navigation,
   copy controls, product definitions and preserved educational URLs in production.
5. Review search indexing for the corrected SPARTA page and new Kadastra page.
