# Spatialdom Insights Editorial Workflow

## Purpose

Spatialdom Insights is the long-form knowledge and organic acquisition layer of spatialdom.xyz. It is not a generic company blog. Each article should answer a real question, teach something useful, preserve professional boundaries, and connect naturally to the relevant Spatialdom product or capability.

GitHub is the editorial system of record.

## Editorial states

Every Insight topic/article must be in exactly one of these states:

- `insight:idea` — approved topic in the backlog, not yet being drafted.
- `insight:drafting` — active research and writing are underway.
- `insight:review` — draft is complete and waiting for Dominic's review.
- `insight:approved` — Dominic has reviewed the article and approved it for publication.
- `insight:scheduled` — approved and assigned to a publication slot.
- `insight:published` — live on spatialdom.xyz/insights.

Human approval is mandatory. No article may move from `insight:review` to `insight:approved` automatically.

## Review queue backpressure

The review queue has a hard ceiling of 20 articles.

The weekly writer may prepare up to five articles, but only enough to keep `insight:review` at or below 20.

Examples:

- 20 in review → draft 0.
- 18 in review → draft at most 2.
- 15 in review → draft at most 5.
- 8 in review → draft at most 5.

Articles in `insight:approved`, `insight:scheduled`, and `insight:published` do not count against the review ceiling.

## Publishing cadence

### Relaunch
Rewrite the current legacy Insights first. Once Dominic has approved them, the initial relaunch may publish up to six approved legacy rewrites in the first launch batch/week.

### Normal cadence
After the relaunch, publish at most one approved article per week.

If no article is approved, skip publication. Never publish an unapproved article to preserve cadence.

## Writer behavior

For every article:

1. Research from current authoritative sources.
2. Prioritize Philippine primary sources when the topic is Philippine-specific.
3. Use community discussions only as demand signals or examples of common confusion, not as authoritative evidence.
4. Answer the user's likely question early.
5. Write naturally, without keyword stuffing, filler introductions, fake anecdotes, or repeated SEO-template structures.
6. Vary article depth to match the question.
7. Explain professional, legal, surveying, tax, privacy, or regulatory limits where relevant.
8. Add useful internal links and one appropriate primary Spatialdom product path.
9. Add reviewer notes for Dominic pointing out places where lived experience, professional practice, opinion, examples, or Spatialdom's point of view could improve the draft.
10. Stop at `insight:review`.

## Article presentation

Published articles should show:

- article title
- concise standfirst/description
- calculated `X min read`
- `Last reviewed: [date]`
- `Written and reviewed by Spatialdom`
- appropriate educational/professional disclaimer where relevant
- related Insights
- relevant product CTA

Reading time should be calculated from the final article body rather than manually authored.

## Writing standard

The publication should sound like a knowledgeable practitioner explaining something to a real reader.

Prefer:
- concrete Philippine context
- examples when they clarify the idea
- nuanced statements such as "this depends" when appropriate
- clear explanations of technical terms
- practical limits: what a map, title, survey, dataset, model, or AI system can and cannot establish

Avoid:
- "In today's rapidly evolving world..."
- padded introductions
- rigid "What is / Benefits / 5 Things / Conclusion / FAQ" templates for every article
- generic AI phrasing
- pretending Spatialdom is equally authoritative on law, taxation, surveying, valuation, and policy
- fabricated case studies, statistics, or personal experience

## Topic strategy

The seed bank is intentionally land-heavy, with occasional articles about:
- land titles and parcel transactions
- surveying and parcel geometry
- tax mapping and property administration
- households, census, and local data
- GIS and spatial thinking
- smart cities
- digital twins
- AI and land

The bank is not a fixed project size. New topics may be added based on reader questions, Search Console data, product usage, support questions, and new Spatialdom work.

## Legacy rewrite rule

The existing Insights are topic briefs, not sacred copy. Rewrites should preserve useful concepts and URLs where possible, but perform fresh research and rewrite each article to the current editorial standard.

Existing slugs should normally remain unchanged to avoid unnecessary URL churn.

## Dominic's required action

Dominic's only required workflow action is:

`insight:review` → `insight:approved`

He may edit the draft before approval to add his own knowledge, experience, opinion, examples, or phrasing.
