# Insights editorial workflow

The [topic bank](../content/insights/topic-bank.md) lists 45 seed topics. Nine are rewrites of existing public articles, preserving their slugs; 36 are future topics. The bank is not a quota. Each topic has a GitHub issue with exactly one `insight:*` label. Article content lives in one JSON file per slug under `src/data/insights/`.

## States and approval

`insight:idea` → `insight:drafting` → `insight:review` → `insight:approved` → `insight:scheduled` → `insight:published`.

The writer researches and drafts, then moves a complete article to `insight:review`. Dominic (`kingd0mz`) alone changes the issue from review to approved. The publication script checks the approving GitHub actor and requires that approval happened after the article file's last commit. A later edit requires a fresh approval. `insight:scheduled` is optional for planning; the weekly publisher selects approved or scheduled issues only after verifying the approval event.

For a new article, its JSON file carries the current state. For a rewrite of an existing public article, the file keeps the currently published article and a `candidate` object carrying the next complete article and its state. Only the published fields go into the site manifest. The publication script promotes the candidate in the same file after approval. No draft or review text is included in the site bundle or sitemap.

## Weekly run

The Monday GitHub Action prints a plan and publishes at most one approved article. If none is approved, it publishes nothing. The plan selects at most five ideas for drafting and limits that selection to `20 - number of review issues`; at a review count of 20, it selects zero. This is a writer capacity plan: writers still research and create complete drafts before moving issues to review. Run `node scripts/insights-editorial.mjs plan` locally to inspect it.

For the initial legacy relaunch, manually dispatch the workflow with `relaunch` enabled. That run selects only approved issues 001–009 and releases at most six in that week. Further weeks use the normal limit of one. The action checks article data, builds and validates the site, commits published files, and then labels the corresponding issues `insight:published`. It does not bypass Dominic's approval.

## Dates and legacy content

The nine migrated public articles have no known original publication or last review dates. Their pages state that the review date is not recorded. Do not infer a date from a Git commit. A new article needs an actual review date before publication. The weekly action records the release date when it publishes; a legacy rewrite keeps its original publication date unknown and records its new review and release dates.

## Writing and release checks

Use the [article template](../content/insights/_template.md) and the topic issue brief. Answer a real reader's question, verify current primary sources, use concrete Philippine examples where relevant, and describe professional limits. Keep one relevant product path near the end, related links to published Insights, and a disclaimer where appropriate. Reading time is calculated from the final text. The build supplies unique metadata, canonical and social URLs, Article structured data, and sitemap entries for published articles only. Run `npm run build` before requesting review.
