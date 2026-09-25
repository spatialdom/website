# Parcel Plotter discovery pages

The three routes share one content source: `src/data/parcelPages.json`. The React page reads it, and `scripts/prepare-pages.mjs` writes a static HTML entry for each route with its own title, description, Open Graph tags, and canonical URL. The build also writes the sitemap and robots file.

| Route | First thought | First action |
| --- | --- | --- |
| `/parcel-plotter/` | This can help me understand the technical description in a land title. | Try Parcel Plotter. |
| `/plot-land-title-technical-description/` | A technical description can be plotted line by line. | Try Parcel Plotter with the source document beside me. |
| `/how-to-read-bearings-and-distances-land-title/` | A bearing gives direction and a distance gives length. | Try Parcel Plotter after checking the entries in my document. |

Keep the guides useful on their own. Explain the limits of a plot on every route: it does not replace an official survey, title verification, or professional geodetic advice. Keep external source links attached to the relevant content.
