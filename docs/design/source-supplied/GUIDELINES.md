# Spatialdom design guidelines

**Version:** 1.1.0-draft  
**Updated:** 3 November 2026  
**Status:** Proposed public working standard; not yet adopted or deployed  
**Canonical destination:** `https://spatialdom.xyz/design/guidelines/`  
**Applies to:** Spatialdom website, Parcel Plotter, SPARTA (professional Geodetic Engineering workspace), RBIM Cloud, future institutional systems, mobile apps, generated reports, and associated product communications.

> **The interface disappears. The user's task remains.**
>
> Spatialdom designs for confident decisions, not visual novelty. Make technically complex work understandable without hiding its assumptions or limitations.

This is a living, **normative** standard for humans and AI coding agents. It builds on the Spatialdom Product Design Rulebook v1.0 (September 2026) and adopts select general usability lessons from Vercel's Web Interface Guidelines, but the wording, brand choices and geospatial safeguards here are Spatialdom-specific. It is not a reproduction of Vercel's guide.

## How to apply these rules

- **MUST / MUST NOT:** Required unless a documented exception is approved.
- **SHOULD / SHOULD NOT:** Default; explain departures in a pull request.
- **MAY:** Optional when the task benefits from it.
- **Precedence:** Law, accessibility and safety requirements → current domain specification and real-world correctness → these design guidelines → product-specific UI decisions → individual page styling.
- A product's local `AGENTS.md` MAY specify additional rules, but MUST NOT silently override cross-product accessibility, truthfulness, privacy, or geospatial accuracy requirements.
- Proposed changes to canonical tokens or behavior require a design decision record, version increment, and review of affected products. The publicly published guide and the machine-readable `tokens.json` should share a version.
- These rules cover UI, not product roadmap or business decisions. Never infer a feature exists solely because the guidelines show it as an example.

## 01 · Product philosophy

1. **Design the task first.** Before layout, write down the user, context, intended first thought, first action, successful result, and recovery path.
2. **One clear next step.** Each region MUST have a discernible primary action; avoid competing primary buttons.
3. **Reveal complexity progressively.** Advanced tools remain available, but are not prerequisites for completing routine work.
4. **Recognition over recall.** Show relevant units, current selection, project context, and the meaning of technical terms.
5. **Preserve work.** Do not unexpectedly discard inputs, plots, map extents, filters or unsaved changes.
6. **Earn trust with evidence.** Use clear provenance, dates, assumptions, validation states, and reproducible results. Never use visual polish as a substitute for correctness.
7. **No dark patterns.** No fake urgency, deceptive preselection, hidden charges or misleading product status.

## 02 · Personality and product family

- Spatialdom is **calm, grounded, precise, useful, accessible and modern**. It should feel technical, but not cold or overly futuristic.
- All products share design tokens, fonts, icon treatment, interaction semantics, accessibility and content rules.
- **Parcel Plotter:** approachable for landowners and buyers; optional expert information; avoids implying that plotted geometry is a legal boundary.
- **SPARTA:** task-focused professional Geodetic Engineering workspace for projects, relocation/as-built/topographic survey workflows and professional deliverables. It can be denser where that reduces real work.
- **RBIM Cloud / institutional systems:** operational, accountable, audit-friendly; capable of displaying complex records without overwhelming users.
- **PTR and developer tools:** minimal, exact, version-aware, with technically accurate field descriptions and examples.
- Product-specific logos may differ, but MUST NOT create an unrelated look-and-feel or contradictory status semantics.
- The previous usage of the name **SPARTA** for LGU tax mapping is obsolete; use **LGU tax-mapping platform (name pending)** until its new product name is approved.

## 03 · Color and surfaces

**Canonical light-mode tokens:**

| Token | Value | Purpose |
| --- | --- | --- |
| `color.canvas` | `#F7F8FA` | Default quiet work area |
| `color.surface` | `#FFFFFF` | Cards, panels, dialogs |
| `color.text.primary` | `#17202A` | Primary reading |
| `color.text.secondary` | `#596574` | Secondary information |
| `color.action.primary` | `#123B5D` | Spatialdom Blue: important actions |
| `color.action.hover` | `#0E2F4B` | Primary hover |
| `color.action.pressed` | `#09253C` | Primary pressed |
| `color.action.link` | `#1B557F` | Links and interactive text |
| `color.selection.surface` | `#E8F0F6` | Selected list/table rows |
| `color.status.success` | `#27734A` | Completed / validated |
| `color.status.warning` | `#9A6700` | Needs review |
| `color.status.danger` | `#B42318` | Error or destructive action |

**Rules**

1. The primary identity is **Spatialdom Blue `#123B5D`**, not the older deep green or gold.
2. Use an off-white canvas and white surfaces. Use borders and spacing before shadows.
3. Use color for semantics and hierarchy, not to fill blank space.
4. Gold MUST NOT be a core brand or interaction color; it MAY be a rare editorial/decorative accent with an explicit purpose.
5. Avoid decorative gradients, glowing borders, neon effects, heavily shaded cards and glassmorphism. Gradients MAY represent continuous measurements in an accessible data visualization.
6. Never indicate approval, errors or map feature classification by color alone. Pair color with words, symbols and/or patterns.
7. Dark mode MAY be offered. If implemented, every semantic role needs an accessible dark value. Do not mechanically invert hex values.
8. Application components MUST consume semantic tokens rather than hardcode hex values. The current site has some token-level variations; reconcile them through a reviewed migration, not silent replacement.

## 04 · Typography and numbers

1. Use **Source Sans 3** for product UIs and documentation. Fallback: `Source Sans 3, Source Sans Pro, system-ui, -apple-system, Segoe UI, sans-serif`.
2. Use weights 400 (body), 500 (labels), 600 (headings), and occasionally 700 (hero). Avoid light-weight interface text.
3. Use **sentence case** in headings, navigation, buttons, labels and errors. Preserve official proper names, acronyms and field nomenclature. Do not adopt Vercel's title-case-button convention.
4. Use a clear scale: body generally 16 px; supplementary content around 14 px only when legible; sufficient line height; readable paragraph width around 60–75 characters.
5. Use `font-variant-numeric: tabular-nums` in tables, bearing/distance fields, currency, dates and survey measurements.
6. Align numbers by decimal where useful and keep significant digits appropriate to the data. Never imply accuracy by showing unjustified decimal places.
7. Display values with explicit units: `24.15 m`, `600 m²`, `0.42 m closure`. Keep number and unit together when practical.
8. Technical identifiers, exact dataset names, PTR keys and code MUST preserve their case and punctuation.

## 05 · Spacing, layout and responsiveness

- Space scale: **4, 8, 12, 16, 24, 32, 48, 64 px**. Prefer those steps.
- Radius scale: **4, 6, 8, 12, 16 px**; pills reserved for chips and badges, not all buttons.
- Mobile-first mental model. Review at **390 px**, **768 px**, **1024 px**, and **1440 px+** widths.
- Prefer CSS Grid, Flexbox and intrinsic sizing. Avoid absolute positioning for major content layouts.
- Marketing content: constrained reading width and generous whitespace. Professional workspaces: more width is acceptable for maps, forms and data tables.
- On mobile, prioritize the current task; secondary panels become tabs, drawers or bottom sheets where appropriate.
- At 200% zoom and text enlargement, content remains operable without clipping or losing actions.
- Embedded maps MUST NOT trap page scrolling. Use an explicit activate-map or map/list experience.
- The default background is clean; do not add topographic contours, parcel grids or satellite imagery merely for visual identity.

## 06 · Icons, borders and elevation

1. Prefer one rounded-outline icon family within each product. Base at 24 px, approximately 1.75–2 px stroke, rounded caps and joins.
2. Icons support text. Unfamiliar icons MUST have visible labels; icon-only controls require accessible names and tooltips where useful.
3. Use a light border to group related content; avoid wrapping every piece of content in its own card.
4. Use modest shadows only when a surface truly floats (menu, popover, dialog) or needs separation.
5. Nested shapes should have visually consistent corner radii.

## 07 · Navigation and context

1. Organize by users' tasks and terms, not backend database or code modules.
2. Current page, active tab and selected record MUST be visually unmistakable beyond color alone.
3. Browser Back and Forward SHOULD restore relevant scroll position and contextual state.
4. Deep-link filters, tabs, records and selected views when sharing them is safe and meaningful.
5. Links navigate; buttons perform actions. Do not make clickable-looking surfaces inert.
6. Make destination and external-site behavior clear. Keep the brand recognizable across product subdomains.

## 08 · Buttons and actions

- **Primary:** solid Spatialdom Blue with white text; one primary action per region.
- **Secondary:** bordered/quiet for alternatives such as Preview or Export.
- **Tertiary:** text for low-emphasis navigation and disclosure.
- **Destructive:** danger styling only when the action actually destroys or rejects something.
- Labels MUST be verbs plus objects or outcomes where reasonable: **Save project**, **Add course**, **Export PTR**, **View survey details**.
- Avoid generic **Submit**, **OK**, **Proceed** or **Click here** when a precise label fits.
- Confirm destructive operations or provide a reliable undo.
- Loading buttons retain the action name and clearly indicate progress; prevent duplicate requests.

## 09 · Forms and validation

1. Use labels, not placeholders, as the primary description of every input.
2. Put labels above controls for scanning and mobile comprehension.
3. Use useful examples for unfamiliar inputs: quadrant bearings, coordinate reference systems, title technical descriptions, dates, and file formats.
4. Let users type and paste; avoid validation that interrupts incomplete but still-being-edited input.
5. Errors appear beside the affected field; after submit, focus or summarize the first invalid input.
6. Preserve all valid input after a server or validation error. Give an explicit draft/unsaved state for long forms.
7. Minimize required fields; explain why sensitive information is needed.
8. Input, processing, and results MUST state what happened when an automatic parse or calculation has uncertainty.
9. Use 16 px+ input text on mobile; common touch targets should be 44 × 44 px or more.

## 10 · Feedback and application states

- Design **loading, empty, sparse, dense, success, warning, error, disabled, offline, unsaved, partially complete and permission-denied** states.
- Small actions get inline feedback; saves and long-running operations get persistent and specific status.
- Every message should answer: **What happened? Is my work safe? What can I do next?**
- Never show a green “Verified” badge for a parcel merely because the geometry closed mathematically.
- Distinguish **computed**, **document-stated**, **manually adjusted**, **reviewed**, and **officially approved** information when such distinctions apply.

## 11 · Maps, parcels and geospatial truth

1. **Shape is not location.** Bearing-distance calls can define local parcel geometry without establishing geographic coordinates. Never guess a map position from an unknown origin.
2. **Local plotting is valid.** If a valid georeference is unavailable, plot locally, label it as such, and disable or explain geographic map/export options that require a CRS.
3. **Georeferencing is explicit.** Display source, CRS/datum, tie point/reference, transformation assumptions and confidence when used.
4. **Do not silently adjust geometry.** Preserve the original plotted courses and geometry; record adjustments separately with user action and reason.
5. **Closure is a metric, not a legal conclusion.** Label linear/relative closure and its units. Do not treat closure alone as title validity or boundary confirmation.
6. **Area is contextual.** Distinguish computed area from declared area. Explain discrepancies without silently overwriting either value.
7. **No legal authority implied.** A parcel plot, overlap, adjacent polygon, geospatial overlay or generated document does not by itself prove ownership, boundary location, cadastral approval or survey validity.
8. **Operational layer first.** Keep the basemap subdued. Highlight selected features in both map and accompanying list, where present.
9. **Accessible map interactions.** Every essential map gesture has keyboard/button alternatives. On mobile, use bottom sheets or a map/list mode for feature information.
10. **Coordinate correctness.** Do not mix CRS, axis order, datum, units or epochs silently. Label transformations and quality limitations.
11. **Uncertainty is visible.** Distinguish approximate location, user-edited geometry, source-record geometry and surveyed/authoritative geometry where the data actually supports those categories.
12. **Useful exports.** Clearly label the format, spatial reference and whether the output is a technical aid or an official deliverable.

## 12 · Tables, data and charts

1. Choose tables for comparable records, cards for objects with varying content, and charts when a pattern matters.
2. Keep column headers clear; make large tables sortable/filterable only when the action is meaningful.
3. Use tabular figures; align text left and numbers right (or by decimal where practical).
4. Design mobile overflow deliberately: key columns, purposeful horizontal scroll, or a structured detail view.
5. Charts should answer a stated question. Prefer position/length over 3D shapes and decorative pie charts.
6. Legends, units, dates, sources, geographic extents and uncertainty MUST accompany analytics where needed for interpretation.
7. Maps are not default charts. Use a map only when spatial relationships are necessary to answer the question.
8. Prefer accessible color palettes; give important charts a text summary or accessible equivalent.

## 13 · Accessibility and interaction

1. Target **WCAG 2.2 AA** for web applications; test with keyboard, screen reader, zoom and touch.
2. Never hide the focus indicator or place it under a sticky overlay.
3. Use semantic HTML: native buttons, anchors, labels and tables before custom ARIA widgets.
4. Dialogs manage focus and return it on close. Keyboard escape/close behavior is predictable.
5. All core workflows MUST be operable without a mouse, including map or diagram alternatives where practicable.
6. Respect `prefers-reduced-motion` and browser zoom. Do not disable zoom.
7. Aim for at least 4.5:1 normal-text contrast except legitimate standard exceptions and adequate nontext control contrast.
8. Avoid communicating information only through color, position, animation, sound or iconography.
9. Provide accessible names for icon-only controls and meaningful alternative text for essential visuals.
10. Test forms and navigation with assistive technologies and at least one real mobile/desktop configuration.

## 14 · Motion and performance

- Motion should explain a state change, not compete for attention. Prefer CSS transforms/opacity; never use indiscriminate `transition: all`.
- Suggested ranges: micro state 100–180 ms; sheet/panel 180–280 ms; navigation up to 350 ms when helpful. These are defaults, not compulsory delays.
- Every animation must be interruptible; support reduced motion.
- Loading must reflect actual work; never fake a long task or hide an error behind endless activity.
- Keep layout stable; allocate space for images/charts. Avoid UI freezes on computations, large files and large tables.
- Treat performance as part of accessibility, especially on ordinary mobile devices and weak networks.

## 15 · Copywriting and terminology

**Voice:** Clear. Precise. Professional. Respectful. Practical. Never theatrical, pushy or condescending.

1. **Use active voice.** “Enter the technical description” rather than “The technical description should be entered.”
2. **Write for the user.** Explain their outcome before Spatialdom's technology. Use “you” where natural, but not in every sentence.
3. **Keep labels concrete.** “Export coordinate table” beats “Continue” or “Proceed”.
4. **Be concise without removing meaning.** Technical or legal nuance is more important than shaving off a word.
5. **Use sentence case**, including buttons, menus, headings, alerts and notification titles.
6. **Use “and” in prose** rather than Vercel's house preference for `&`. Ampersands may appear in brand names, compact UI labels or conventional technical phrases.
7. **Use numerals, units and conventions consistently:** `3 parcels`, `20.00 m`, `₱20,000` (or `₱20,000.00` when accounting demands two decimals). Do not mix currency precision within one table.
8. **Keep terminology stable:** “technical description”, “course”, “bearing”, “distance”, “local plot”, “georeferenced map”, “computed area”, “declared area”, and “closure error”. Define unfamiliar terms briefly near the first use.
9. **Errors explain recovery.** Say what went wrong, what is preserved and how to fix it. Do not blame the person.
10. **Status labels state real states:** “Draft”, “Needs review”, “Computed”, “Pending approval”. Do not say “Approved” unless an authorized approval occurred.
11. **No inflated claims.** Avoid “100% accurate”, “officially verified”, “guaranteed compliant”, and invented partner/client claims.
12. **No fake affordances.** If a feature is planned, label it “Planned” or “Coming soon”; do not imitate a working checkout or action.
13. **Respect professional boundaries.** Where appropriate, clarify that software outputs do not replace verification by a licensed Geodetic Engineer or an authorized agency.
14. **Use helpful empty states.** Describe why the space is empty and give the smallest useful next action.
15. **Prefer user terms over internal schemas.** Show “Survey date” rather than `survey_date_recorded_at`.

### Copywriting examples

| Situation | Avoid | Prefer |
| --- | --- | --- |
| First-use instruction | Input your TD to begin processing | Enter the technical description to see the parcel |
| Empty workspace | No data available | No parcels yet. Add a parcel to get started. |
| Ambiguous button | Submit | Save project |
| Technical validation | Invalid input | Course 4 has an incomplete bearing. Review the direction and degrees. |
| Local plot | Parcel location confirmed | Parcel plotted locally. Add a valid reference to view it on a map. |
| Non-closing geometry | Survey failed | The traverse does not close. Closure error: 0.42 m. Review the courses before using the result. |
| Save failure | Error 500 | We couldn't save this project. Your changes are still here. Try again. |
| Future feature | Buy now (disabled) | DXF export — planned |
| Source distinction | Actual area: 600 m² | Computed area: 598.7 m² · Declared area: 600 m² |
| Destructive confirmation | Are you sure? | Delete this parcel? This will remove it from the project. |

## 16 · Product-specific overlays

**Parcel Plotter**
- Landowner/buyer-first defaults; expert settings do not obstruct basic plot comprehension.
- Editing a technical description SHOULD update the plot responsively in workflows that support live computation; do not invent a mandatory “Plot parcel” button if the product computes automatically.
- Show parsing as assisted interpretation, not authoritative recognition. Let users inspect and edit extracted courses.
- State “local plot” versus “map” clearly; explain why a map may be unavailable.

**SPARTA (professional GE workspace)**
- Organize around real project workflows, not features invented for a demo.
- Start with relocation, as-built, and topographic surveys; maintain continuity across quotation, project work, field notes and deliverables as those features exist.
- Distinguish original plot, field observations, edits/adjustments, professional review and deliverable status; preserve traceability.
- Do not auto-label files “approved” or imply approval by DENR/LRA/other bodies without evidence.

**RBIM / institutional systems**
- Optimize routine operational tasks, auditability and record stewardship.
- Treat personal/household records as sensitive. Reduce exposure and display only necessary fields by role and purpose.
- Avoid implying model-generated statistics are authoritative administrative records without review.

**PTR / developer experiences**
- Preserve the precise PTR schema version, input assumptions, errors and reproducibility.
- Explain technical representation without suggesting it confers legal rights or official survey status.
- Avoid hard-coded domain semantics in a presentation layer when the underlying specification owns them.

## 17 · Privacy, trust and reporting

- Collect only what the action requires. Make saving, sharing, telemetry and document processing transparent.
- Do not log raw land titles, owner details, technical descriptions, exact parcels or household records merely to measure clicks.
- Separate analytics metadata from source-record data. Share exact input for debugging only with permission and clear retention controls.
- Explain source date, transformations, uncertainty and status wherever they affect consequential decisions.
- Clearly distinguish Spatialdom's computation from government authority and regulated professional services.
- Reports, downloads, emails, social posts and print materials SHOULD follow the same vocabulary, brand palette and truthfulness standards as the UI.

## 18 · Quality gates

**Before design**
- [ ] Name the user, context, main task, first thought, first action, success and recovery path.
- [ ] Confirm whether a map is genuinely necessary.
- [ ] Confirm the correct product overlay and professional/legal boundary.

**Before merging**
- [ ] Uses semantic tokens and Source Sans 3, with no retired palette or decorative geospatial background.
- [ ] Sentence-case, action-oriented copy with explicit measurements/units.
- [ ] Empty, loading, success, warning, error and offline states considered.
- [ ] Responsive at 390 px, tablet, desktop and 200% zoom.
- [ ] Keyboard, labels, focus, touch targets, contrast and reduced-motion behaviors reviewed.
- [ ] No invented coordinates, CRS or unexplained geometric adjustment.
- [ ] Preserves work, asks before destructive operations and doesn't overclaim authority.
- [ ] Product-specific override documented where needed.
- [ ] Unit/interaction tests and manual verification completed as appropriate.

## 19 · Design tokens and machine use

- The accompanying `tokens.json` is the **proposed** machine-readable companion to this draft. Production CSS and components should map their existing semantic variables to this vocabulary, with visual regression review for differences.
- AI assistants should read the relevant repository's `AGENTS.md` and this document **before** generating or modifying UI.
- Use a short local `AGENTS.md` reference in each repository, pinned to an adopted version. Do not rely on an external web page being fetched automatically at execution time.
- If a visual or content exception is needed, record **rule, reason, impact, owner and review date** in the PR or design decision.
- The public site SHOULD expose human-readable guidance, a copyable agent prompt, raw Markdown, a token manifest, version, change log and source repository links.

## 20 · Governance and changelog

- **Draft 1.1.0, 2026-11-03:** Consolidates the September Product Design Rulebook into a web-friendly, agent-friendly guide; aligns with current Spatialdom Blue, Source Sans 3, consumer Parcel Plotter, professional SPARTA, accessible interactions and geospatial truth standards. **Pending review/adoption**.
- **Source baseline:** Spatialdom Product Design Rulebook v1.0, September 2026.
- **Additional reference:** Vercel Web Interface Guidelines, consulted 3 November 2026 — https://vercel.com/design/guidelines
- **Accessibility baseline:** W3C WCAG 2.2 — https://www.w3.org/TR/WCAG22/
- **Source of architectural truth:** Product specifications and current implementation repositories. This guide does not replace PTR schema, PTR Core, surveying standards, law or product-specific decisions.
