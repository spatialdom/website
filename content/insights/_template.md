# Insight article checklist

Use one `src/data/insights/<slug>.json` file per Insight. For a new article, fill the fields below in the same file as it moves through states. For a legacy rewrite, put the proposed revision in `candidate` inside its existing file; the current published fields remain visible until approval and release.

```json
{
  "slug": "descriptive-stable-slug",
  "cluster": "land",
  "title": "Question answered | Spatialdom Insights",
  "description": "A specific summary for search results.",
  "heading": "Question answered",
  "intro": "Answer the practical question early.",
  "state": "drafting",
  "publishedAt": null,
  "lastReviewed": null,
  "sections": [
    { "id": "clear-section-id", "heading": "Useful heading", "paragraphs": ["Substantive explanation with a practical example."] }
  ],
  "related": [],
  "product": { "name": "Parcel Plotter", "href": "/parcel-plotter/", "label": "Explore Parcel Plotter" },
  "sources": [{ "label": "Primary source and document title", "url": "https://example.org/source" }],
  "disclaimer": "Educational information; explain the relevant professional limit."
}
```

Before `insight:review`, check current primary sources, source links, Philippine context where relevant, claims and caveats, internal links, product fit, spelling, and mobile reading. Set `lastReviewed` to the date of the actual editorial and source review. Add `Article file: \`src/data/insights/<slug>.json\`` to the GitHub issue body for new articles. Do not set a publication date in advance.
