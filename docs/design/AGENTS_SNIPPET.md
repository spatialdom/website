# Spatialdom design instructions for AI coding agents

**Companion to approved Spatialdom Design Guidelines v1.2.0, published 14 November 2026.** Add this section to each adopting repository's `AGENTS.md` through a reviewed adoption pull request. Keep a version-pinned local copy of the full guidelines in the repository or a reviewed shared package; do not assume an agent can fetch URLs.

## Mandatory design instructions

When creating or changing UI/UX, content, components, charts, maps, exports or customer-facing communication:

1. Read the adopted **Spatialdom Design Guidelines** and this repository's product-specific specifications before generating code. Reference: https://spatialdom.xyz/design/guidelines/ (human-readable URL, not a substitute for the pinned local copy).
2. Build for the user's actual task. Define the target user, first thought, first action, success state and recovery path. Prefer one primary action per region and progressive disclosure.
3. Follow Spatialdom Blue `#123B5D`, canvas `#F7F8FA`, Source Sans 3, sentence case, semantic tokens, restrained surfaces, 4 px-based spacing and rounded-outline icons. Do not resurrect deep green/gold, use decorative gradients, or place generic map/topographic backgrounds.
4. Respect WCAG 2.2 AA, keyboard controls, meaningful focus, clear labels, contrast, touch targets, zoom and reduced motion. Test mobile and desktop states.
5. Write active, concise, factual, action-oriented copy. Use terms consistently and always include measurement units and important source/status distinctions. Prefer specific recovery steps over generic errors.
6. For parcels, **never invent geographic coordinates, CRS, legal boundary truth, parcel ownership, survey approval, or source precision**. Differentiate local vs georeferenced geometry, computed vs declared area, original vs adjusted geometry, and technical plot vs official survey.
7. Preserve input, draft state and navigational context; design empty/loading/error/offline states. Confirm destructive changes or provide Undo. Respect data minimization and sensitive records.
8. Do not duplicate domain computation outside its authoritative library or change PTR semantics through the UI layer. Domain specifications override illustrative examples in this prompt.
9. If a product needs an exception, document the specific rule, user need and QA outcome; do not silently drift.

## Before completing the task

- Identify the guidelines applied and any deliberate exceptions.
- Check responsive states (390 px, tablet, desktop), focus and keyboard operation, user text/units, empty/error states, and geospatial truthfulness.
- Verify tests/build where available. Do not claim to have run checks you could not execute.
- Give the reviewer a concise summary of what changed, why, outstanding QA work and any guidelines not satisfied.

## Version pin

Adopted standard: **1.2.0**. Store GUIDELINES.md, COMPONENTS.md, AGENTS_SNIPPET.md and tokens.json locally in `docs/design/`. Record the upstream commit and adoption date. Do not fetch the public website at application runtime. Upgrade through a reviewed PR with a changelog, token comparison, domain checks and responsive/accessibility QA.

SPARTA is the professional Geodetic Engineering workspace. Kadastra is the future LGU tax-mapping and property-assessment platform: coming soon, with development deferred until after SMACCs. Parcel Plotter is consumer-facing parcel and technical-description plotting.
