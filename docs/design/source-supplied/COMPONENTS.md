# SPARTA UI foundation

**Local implementation inventory, 14 November 2026.** This describes SPARTA's
React/TypeScript/CSS primitives. It is not the missing upstream Spatialdom v1.2
component guide. The selected [guidelines](GUIDELINES.md) and [tokens](tokens.json)
still declare `1.1.0-draft`; [adoption precedence](ADOPTION.md) and current approved
SPARTA interactions continue to control. The [audit](AUDIT.md) is the historical
source snapshot before this foundation; this work does not close its screen-level
findings or claim full accessibility conformance.

## Inventory and demonstrated need

| Asset | Existing duplicate pattern / audit | Scope |
| --- | --- | --- |
| [tokens.css](../../apps/web/src/ui/tokens.css) | F10/F13: repeated literal colors and dimensions across stylesheets | Named reference values and compatibility aliases; no existing palette migration |
| [Icon](../../apps/web/src/Icon.tsx) | F12: existing shared Lucide wrapper plus direct icon/glyph paths | Named sizes/strokes added; all previous semantic names and numeric sizes retained |
| [Button](../../apps/web/src/ui/Button.tsx) | F15: primary/secondary/text/danger actions repeated across project, quotation and financial forms | Native button presentation and loading/disabled semantics |
| [IconButton](../../apps/web/src/ui/IconButton.tsx) | F12/F14/F15: repeated named icon actions in dialogs, viewer and map | Native Button plus existing decorative Icon and required action name |
| [TextField](../../apps/web/src/ui/TextField.tsx) | F03/F06/F07: repeated labels, inputs, help/errors in ProjectDialog, FinanceForm and CalendarEditor | Labelled native input with composed descriptions; no owned value/validation state |
| [Badge](../../apps/web/src/ui/Badge.tsx) | F10/F18: repeated textual status badges in Projects, quotations, ledger and acknowledgments | Textual noninteractive span; no inferred domain status |

The foundation PR migrated no existing application screen. The subsequent
[Projects list slice](../acceptance/projects.md#projects-design-system-migration--14-november-2026)
adopts Button, TextField, Badge and Icon for its existing controls and records.
No dialog, table, select, textarea,
combobox, tooltip, form-state manager or new navigation primitive is added.
Existing Dialog/EditorDialog, RouteLink, CourseGrid, PrecisionInput and private
record/finance services retain their separate responsibilities. Import individual
files from `src/ui`; do not introduce another component or icon framework.

## Tokens and appearance

`styles.css` imports the two foundation stylesheets. Rules for components are
opt-in (`sd-*` classes), with enough specificity to override the legacy generic
native-element rules on those components alone.

| Reference | CSS mapping |
| --- | --- |
| `color.canvas`, `surface` | `--sd-color-canvas`, `--sd-color-surface` |
| `color.text.primary`, `secondary` | `--sd-color-text-primary`, `--sd-color-text-secondary` |
| `color.action.primary`, `hover`, `pressed`, `link` | `--sd-color-action-primary`, `--sd-color-action-hover`, `--sd-color-action-pressed`, `--sd-color-action-link` |
| `color.selection.surface` | `--sd-color-selection-surface` |
| `color.status.success`, `warning`, `danger` | `--sd-color-status-success`, `--sd-color-status-warning`, `--sd-color-status-danger` |
| Typography | `--sd-font-family`, `--sd-weight-body/label/heading/hero` |
| Spacing | `--sd-space-4/8/12/16/24/32/48/64`, suffix is pixels, not an ordinal |
| Radius | `--sd-radius-xs/sm/md/lg/xl/pill` |
| Common touch target/mobile input text | `--sd-target-common` (44px), `--sd-input-font-size` (16px) |

`--ui-*` roles resolve to existing `--color-*`/`--radius` variables where available,
with reference fallbacks. Existing root variables and declarations keep their
values; status, map, Calendar and document colors are not globally replaced.
For example `--ui-muted` retains `#526170` while the reference secondary text
remains available as `--sd-color-text-secondary: #596574`.

New TextField borders use existing muted text (`--ui-control-border`) instead of
the old `#AAB9C5`: the audit explicitly identifies its inadequate contrast in F03.
New components use the existing 600 label weight rather than requesting unloaded
500 (F11). Reference 500 remains mapped but is not newly loaded or applied.
Button medium padding (11px/20px), field padding/margins and badge 13px text/3px/10px
padding retain existing base dimensions; these are compatibility choices, not new
universal scale values. Other sizes use reference spacing/radii. Canonical hover
and pressed colors apply to new primary buttons only (F15).

Breakpoint values remain ordinary media-query constants; CSS custom properties
cannot directly substitute into media conditions. No new motion is introduced.
Do not use status tokens to recolor parcel identities, category classifications,
chart series or immutable quotation output.

## Component contract

| Component | Variants / sizes | Accessible names and states |
| --- | --- | --- |
| Icon | `size="small"` 16px, `medium` 20px (unchanged default), `large` 24px; `stroke="standard"` 1.75 (unchanged), `emphasis` 2 | Decorative, hidden from AT, nonfocusable. Name the containing control. Numeric size remains supported for approved dense workspace controls. |
| Button | `variant="primary"` default, `secondary`, `tertiary`, `danger`; `size="medium"` default or `small` | Supply visible sentence-case action text. Native `type="button"` default; explicitly set `submit`/`reset` if intended. Native `disabled`; `loading` also disables and sets `aria-busy`, retains the label and adds decorative ellipsis. Consumer provides long-running success/error/status announcements. |
| IconButton | Same variants/sizes; default secondary; 44px hit area at both sizes, icon 16/20px | Required nonempty `label` becomes `aria-label`, default `title` is supplementary. `aria-labelledby` overrides and children are excluded from its API. Native toggle/menu attributes, descriptions and refs forward. No custom tooltip added. |
| TextField | One standard 44px-minimum, 16px-input-text size; native text/email/password/search/tel/url/number/date/time/datetime-local/month/week types | Required nonempty visible `label`; provided `id` or per-instance `useId`. Optional `hint` and `error` compose with external `aria-describedby`; error sets `aria-invalid`. No automatic focus movement or live alert per field; compose a form summary/announcement when required. Native required/readonly/disabled/autocomplete/name/ref/event props forward. |
| Badge | `tone="neutral"` default, `info`, `success`, `warning`, `danger`; one compact size | Required text children. Color supplements words. Static span, no tab stop, inferred status or automatic live region. Consumer chooses tone from real recorded state; success must not imply professional/geospatial approval. |

All primitives accept a `className` for additive context styling; do not pair them
with conflicting legacy variant classes such as `secondary`, `text-button` or
`status-badge`. Do not override their semantic variables with page-specific
arbitrary colors. Button is for actions; continue using RouteLink/native anchors
for navigation. No polymorphic `as`, link-button, event cancellation or network
behavior is introduced. Icons preserve established semantic names such as `projects`,
`documents`, `layers`, `trash`, `refresh` and `close`.

## Before/after examples for future approved consumers

These illustrate duplicate markup reduction; no corresponding screen is migrated
in this PR. The caller still owns values, validation, loading and retry behavior.

```tsx
// Before
<button type="submit" disabled={saving}>Save project</button>
// After: explicit submission, same action text, standard busy semantics
<Button type="submit" loading={saving}>Save project</Button>

// Before
<button type="button" aria-label="Close dialog" title="Close dialog" onClick={close}>
  <Icon name="close" />
</button>
// After
<IconButton icon="close" label="Close dialog" onClick={close} />

// Before
<label htmlFor="client-name">Client name</label>
<input id="client-name" value={name} onChange={change} aria-describedby="client-hint" />
<small id="client-hint">Optional.</small>
// After
<TextField label="Client name" hint="Optional." value={name} onChange={change} />

// Before
<span className="status-badge">Needs review</span>
// After: caller retains ownership of the real state and displayed wording
<Badge tone="warning">Needs review</Badge>
```

For exact monetary/distance strings, use TextField's default `type="text"` and
`inputMode="decimal"`; it never parses, rounds or validates them. Do not replace
CourseGrid or PrecisionInput in this foundation. A TextField with error retains
both its value and helper text. Caller-supplied IDs must remain unique.

## Verification and limitations

Focused tests cover native keyboard activation, explicit submission, disabled
variants, stable busy names, duplicate activation suppression, icon toggle/ref
forwarding, unique label IDs, help/error/external description composition,
uncontrolled value retention, unparsed controlled input changes and native field
constraints. They also cover noninteractive textual badges and backward-compatible
Icon defaults/numeric dimensions. These are meaningful interaction/contract checks;
they do not certify the browser CSS cascade or screen-reader output.

Run `npm.cmd test -- --maxWorkers=2`, `npm.cmd run lint` and `npm.cmd run build`
from `apps/web`, plus `python scripts/check_docs.py` at the root. Record actual
final results in this PR.

Executed for this foundation on 14 November 2026:

- Focused component suite: **20 passed**. Full frontend suite: **497 passed across
  51 files** with two workers. ESLint and TypeScript/Vite build passed. An initial
  lint warning about exporting an icon-size object was fixed by keeping it internal;
  the final lint/build run passed. Existing Vite large-chunk warning remains.
- Isolated installed-Chrome fixture rendered the actual React primitives to static
  HTML with local Source Sans 3, then exercised browser-native layout/styles at
  **320/390/768/1024/1440px**. Representative pre-existing button/input/status-badge
  computed styles matched the pre-foundation CSS at every width; no page overflow.
  New field font/error/border, 44px icon target, primary hover/pressed, disabled
  hover, visible focus and reduced-motion checks passed. The 390px capture was
  visually reviewed. Fixture code/HTML/captures are ignored local artifacts under
  `artifacts/ui-foundation/`, not new product routes or screenshots of real records.
- This fixture checks the CSS cascade on representative controls; React event
  behavior is covered by component tests. It is not a full application browser
  acceptance, physical-device or screen-reader certification. No backend service
  was started or private project data used.

Existing audit findings for Calendar contrast, tooltip
hoverability, map zoom/scroll, mobile tables, standalone dialogs and page-specific
CSS remain open. The new primitives do not fix screens until separately reviewed
adoption. No dependency, backend, route, financial, geometry or persistent-state
change is included. Stop for founder review; no automatic merge or deployment.

## Design quality checks (14 November 2026; review pending)

From `apps/web`, run `npm run check:design` for the incremental static checks,
`npm run test:design` for the small policy/primitive suite, or `npm run lint` and
`npm test` for the existing complete frontend gates. CI's web job runs the latter
commands and the production build. No dependency or external service is added.

The [ESLint rules](../../apps/web/tools/design-rules.mjs) run through the existing
ESLint TypeScript parser; the [runner](../../apps/web/tools/check-design.mjs) also
checks CSS declarations and package declarations. This is a focused policy check,
not another application framework or a complete accessibility/CSS validator.

| Check | Enforcement and scope |
| --- | --- |
| Fonts and icons | Reject known alternative font/icon packages in runtime/dev dependency declarations and imports/re-exports/dynamic imports/require. Allow locally bundled Source Sans 3 and Lucide React. Flag unfamiliar literal CSS/inline font families and known remote Google font URLs. Generic inherited/system/monospace declarations and semantic font variables remain valid. |
| Hardcoded brand colours | Read canonical action colours from local `tokens.json`; flag literal CSS declarations and static inline JSX style values outside the token layer. Recognize hex, alpha hex and integer RGB/RGBA forms. Use existing semantic roles instead. |
| Accessible icon actions | Reject clearly icon-only native buttons/links/Button without a non-empty `aria-label` or `aria-labelledby`, including direct named/namespace Lucide imports, Icon and SVG. IconButton requires a non-empty label. A title alone is insufficient. |
| Duplicate wrappers | Non-blocking `REVIEW` suggestions for component functions that directly return native button/input or a literal badge-class span. Consider existing Button, IconButton, TextField and Badge. A suggestion is not evidence that extracting a component is safe. |
| Shared behavior | Existing primitive tests plus busy-submit recovery, disabled/toggle keyboard activation, and focused exact-value/error-description transitions. Policy fixtures exercise accepted and rejected examples. |

### Legacy migration and exclusions

The initial [legacy inventory](../../apps/web/tools/design-legacy.json) is pinned
to foundation source `9ba9bec`: **103 brand literal occurrences and two Source
Serif 4 declarations**, grouped into 32 file/rule/property/value allowances.
These preserve current screens and quotation document typography. They do not
approve new brand literals or declare legacy accessibility compliance. New files
have zero allowance. Moving a literal to another file/property or exceeding its
count fails. As migration removes literals, the check requires lowering/removing
the inventory count in the same PR; unused allowance cannot silently accumulate.
Counts are a small, reviewable budget, not a line snapshot: a one-for-one replacement
under the same key still needs diff review.

Every exclusion is intentional:

- `src/ui/tokens.css` may define literal brand colours. Font and remote-font checks
  still apply there. Existing root compatibility/quotation variables outside this
  file remain bounded legacy debt, not an exemption for new page variables.
- SVG `fill`, `stroke`, `stop-color`/`stopColor` and `flood-color`/`floodColor`, SVG
  presentation attributes, non-brand data/category/parcel colours and neutral
  colours are outside the brand rule. There is no whole-map/chart/PDF source-file
  exclusion. Runtime domain values remain runtime values; geometry is not inspected.
- Source Serif 4's existing font face and classic/folio quotation stack retain
  their two bounded declarations. Bundled font/PDF binaries, generated assets,
  uploaded documents, backend rendering, HTML entry files and public assets are not parsed. New
  export styling needs explicit product/design review rather than blanket rejection.
- Test fixtures and test setup are excluded from the production JSX checks so they
  can demonstrate invalid cases. CSS under `src` is still scanned. Checker sources
  are normally ESLint-linted, and checker tests run in the ordinary Vitest suite.
- Only common known alternative package families are recognized; dependency review
  must assess unfamiliar packages and extend focused fixtures when needed. This
  is not dependency classification, a license audit or a font-binary inspection.
- Dynamic names, forwarded spreads/children, conditional content, computed inline
  styles, CSS font shorthand, percentage/HSL/other colour spaces and linked-label
  target existence require component/browser/manual review. Static presence cannot
  prove a usable name at runtime. Keep keyboard, focus, contrast and screen-reader
  checks in feature acceptance; the primitive runtime label guards remain active.
- The four canonical primitive files are excluded only from duplicate suggestions.
  `DocumentViewer.tsx`'s compact Tool and `PrecisionInput.tsx`'s precision-preserving
  adapter each have one retained advisory allowance. The inventory suppresses no
  existing accessible-name or import error. Duplicate CSS/layout/conditional
  patterns and semantic equivalence are manual review work; no clone threshold or
  forced extraction is imposed on domain components.

For a duplicate suggestion, cite the demonstrated repeated pattern and the existing
component considered in the PR. Either reuse it, or explain the needed difference
(precision, state, provenance, dense targets or domain contract), document the
adapter here and retain focused behavior tests. Never simplify business logic just
to remove a suggestion. Follow the
[owner exception procedure](ADOPTION.md#quality-check-exceptions-and-review).
The design runner ignores inline ESLint suppression directives; exceptions change
the reviewed policy/inventory and tests rather than silently disabling a check.

### Verification

The focused policy and primitive suite covers rejection and preservation cases,
including legitimate SVG/data styling. A temporary CLI smoke fixture produced
seven blocking violations plus a non-blocking wrapper suggestion, then was removed;
the unchanged source passes again. Additional CLI smoke checks rejected spare
legacy allowance and an attempted inline suppression. Local results:

| Check | Result |
| --- | --- |
| `npm run check:design` and `npm run lint` | PASS |
| `npm run test:design` | PASS: 59 tests, two files |
| `npm test -- --maxWorkers=2` | PASS: 536 tests, 52 files |
| `npm run build` | PASS; existing Vite chunk-size warning remains |
| `python scripts/check_docs.py` | PASS: 35 Markdown files, 877 links/anchors |
| CLI negative smoke fixtures and `git diff --check` | PASS; fixtures removed |

No application implementation, CSS, dependency,
domain data or user-facing behavior changes in this tooling proposal. Full gate
results are recorded in the PR; this is not a hosted CI or device-accessibility
certification. The supplied guideline/token version remains `1.1.0-draft` under
the adoption qualification.

## Shared page layout refinement (14 November 2026; review pending)

Implemented on the existing `design/brand-strategy` branch after consolidation
commit `24bde2a`, without switching branches, merging or resetting work. The
written refinement brief was available; its five referenced screenshots were
not attached. Therefore the comparison below uses synthetic **before captures of
that existing implementation**, not a claimed comparison with unavailable user
images. Comparison with those external references remains pending founder review.
The existing guideline version qualification and authority order remain in force.

### Issues and resulting screen behavior

| Screen | Observed issue | Refinement |
| --- | --- | --- |
| Projects, expanded filters | Search shared the entire height of a narrow disclosure; selected sort text clipped and filters fragmented the toolbar | Search leads a full-width row with Grid/List; the existing native disclosure follows with an intentional four/two/one-column field grid based on available container width. Long fields span the narrow layout. |
| Projects, collapsed filters | The large search/disclosure flex basis left surplus space and inconsistent action positioning | Search, Grid/List and disclosure share a compact baseline when they fit; hidden fields consume no retained grid rows. DOM/tab order follows the visible order. |
| Project Overview | Fixed selector widths, inconsistent title sizing, nested card margins and large Next Action padding | Shared wrapping heading, fluid selector columns, aligned overflow action, natural-height action panel and 24px section rhythm. Health cards stretch equally within their row; figures retain the existing currency/date formatting and use tabular numbers. |
| Quotations | Detached search/status groups, a legacy 14px action offset and different table/pagination alignment | The same heading and labelled toolbar system; a single-filter disclosure fits beside search when space permits. Action offset removed, desktop cell padding aligned, amounts right-aligned, pagination grouped. Mobile table behavior retained. |
| Knowledge Hub | Search/topic labels and margins differed; cards inherited larger text/padding; selected border changed dimensions; mobile detail was visually reordered before its preceding DOM list | Shared controls, wider guide-list proportion, 12px card padding/8px gaps, steady selected border dimensions and a natural-height detail panel with bounded reading width. Phone layout follows DOM order: list then detail; existing selection scroll/navigation remains. |

### Shared structure and files

[ui/layout.css](../../apps/web/src/ui/layout.css) owns opt-in `layout-page`,
`layout-heading`, `layout-heading-actions`, `layout-toolbar`, `layout-field`,
`layout-search`, `layout-filter-disclosure`, `layout-filter-fields` and
`layout-pagination` rules. `layout-field--wide` provides space for long filter
options on narrow containers. The main entry imports this stylesheet after the
application/navigation styles so ownership and cascade are explicit. Target page
gutters are 24px desktop and 16px tablet/phone; dense Workspace gutters and
quotation output layouts retain their existing rules. Spacing uses `--sd-space-*`,
controls use the existing 44px target, and surfaces/borders/focus use `--ui-*`.
No new font, colour family, framework or dependency is introduced.

| Files | Purpose |
| --- | --- |
| `Projects.tsx`, `Quotations.tsx`, `KnowledgeHub.tsx` | Opt into the shared structural classes; group existing native disclosures/fields; move the unchanged Grid/List controls before advanced filters to match reading/tab order |
| `ProjectHeader.tsx`, `ProjectDetail.tsx` | Shared heading/breadcrumb structure and existing Lucide more-action icon |
| `main.tsx`, `ui/layout.css` | Shared stylesheet entry and parent Flexbox/Grid/container layouts |
| `projects-v3.css` | Fluid project header controls, natural section/card spacing and numeric alignment; no Overview data/financial calculation changes |
| `styles.css`, `projects-list.css` | Remove superseded toolbar/Knowledge/header presentation rules instead of appending overrides to the global file |
| `tools/design-legacy.json` | Reduce the old Knowledge selected-border brand-literal allowance from two to one; no new allowance |
| `scripts/verify_layout_refinement.py` | Reproducible synthetic captures, responsive geometry and interaction checks |

Existing Button, TextField, Badge, Icon, RouteLink and native details/labels remain
in use. The Quotation editor, financial formatter, ProjectOverview logic, guide
content and protected state/effect/API/event/value/route attributes are unchanged.
No backend, permissions, provenance, PTR Core, model, migration or saved-preference
change is part of this refinement. Existing floating menus keep their necessary
popover positioning; main layout uses no absolute-position compensation.

### Before/after evidence and verification

The [five-pair screenshot gallery](../screenshots/README.md#shared-page-layout-review-14-november-2026)
contains representative 1440px before/after images. All records, client names and
monetary values in the browser fixture are synthetic. Full captures at 1720, 1440,
1024, 768 and 390px plus actual Chrome 200% zoom are in ignored
`artifacts/browser-screenshots/layout-refinement/`. The harness intercepts every
API request and allows no mutation request besides the existing quotation search
POST. It does not exercise a backend or establish financial correctness.

Run Vite locally on port 5178, then
`python scripts/verify_layout_refinement.py --phase after` with Playwright and
Chromium available. The origin/browser can be overridden with
`SPARTA_BROWSER_ORIGIN` / `SPARTA_BROWSER_EXECUTABLE`. Native 200% zoom uses an
isolated Chrome profile (1440 physical viewport becomes 720 CSS pixels); keyboard
activation is used for that zoomed run because CDP pointer coordinates are not
reliable under native zoom. Regular widths use real pointer activation.

The browser checks cover expanded/collapsed filters, Grid/List, search/no-result
states, New Project dialog/cancel, guide topic/selection, visible focus and native
keyboard order. After-phase geometry checks cover page overflow, visible control
boundaries and 44px targets, selected-option text room, long-title/control
separation and equal-height KPI rows. Existing component/domain-interface suites
remain the regression authority for creation, pricing, status, pagination,
PDF/PNG, financial, navigation and persistence behavior.

| Validation on the combined current branch | Result |
| --- | --- |
| `npm run lint` (including design checks) | PASS |
| `npm test -- --maxWorkers=2` | PASS: 547 tests, 54 files |
| `npm run build` | PASS; existing Vite chunk-size warning remains |
| New five-view browser suite | PASS at 1720/1440/1024/768/390px and native 200% zoom; 30 before and 30 after captures |
| Existing Projects and Workspace browser suites | PASS at desktop/tablet/phone and native 200% zoom |
| Protected state/effect/API/formatting calls and event/value/route props | Unchanged in all five modified screen/header files; Quotation editor source unchanged |
| Documentation checker | PASS: 35 Markdown files, 922 local links/anchors |
| Browser harness Ruff check/format and `git diff --check` | PASS |

### Remaining review

The supplied five screenshots still need comparison when available. Physical
devices, screen readers and non-Chromium browsers remain manual acceptance work;
the checks do not prove every possible long option, document or data volume fits.
Legacy controls/status labels outside these opt-in surfaces remain incremental
design debt; other modules have not been converted to these opt-in page layouts.
Existing Workspace map gestures/compact targets and operational
release gates remain open. No navigation, financial workflow or quote output is
redesigned. Keep the existing draft PR for founder review; do not merge or deploy.

## Mobile layout follow-up (14 November 2026; review pending)

Mobile-only refinement on the same `design/brand-strategy` branch, using
`8719508` as its synthetic before baseline. Rules extend the existing phone
media query in `ui/layout.css`; the only application JSX change is the
`mobile-action-grid` class on Overview's unchanged Quick Actions group.

| Surface | Mobile refinement |
| --- | --- |
| Page headings | Consistent 24px titles, readable 14px supporting text, full-width primary actions and aligned secondary links |
| Projects | 16px card padding/gaps, tighter title/footer spacing, readable 20px card titles; search/filter/view behavior preserved |
| Project Overview | Selectors stack at 360px and below without clipping values; local tabs keep native horizontal scrolling; Quick Actions use an even two-column grid |
| Actions and disclosures | Next Action links and Project Details have 44px touch targets; focus scroll margins account for the fixed bottom navigation |
| Quotations | Full-width creation action, equal secondary-action slots and consistent 16px list-card padding; amounts, status and pagination unchanged |
| Knowledge Hub | Full disclaimer retained at a readable support size; native guide-list scrolling is bounded to `min(24rem, 50svh)` before the natural-height article. Every guide remains reachable; keyboard Tab leaves the list for the article action, and native scroll chaining is retained. |

The [phone comparison gallery](../screenshots/README.md#mobile-layout-review-14-november-2026)
contains five synthetic 390px before/after pairs. Complete captures remain in
ignored `artifacts/browser-screenshots/mobile-layout/`. All five 768px and 1440px
before/after PNG pairs are byte-identical, confirming the boundary and desktop
presentation remain unchanged for the tested fixtures.

Run `python scripts/verify_layout_refinement.py --mobile --phase after` with the
same local Vite/Playwright setup described above. This adds 320/360/390/430/767px
phone checks, 768/1440px regression captures and actual 200% browser zoom: 40
captures per phase. The after run checks guide-list keyboard access, article
action clearance above the bottom bar, and a separate 390x844 touch-emulated
context for filter, Grid/List, dialog/cancel, project-menu and guide-selection taps.
Touch emulation is not physical-device or mobile Safari acceptance.

The full test run also identified legacy tests querying the removed ellipsis
glyph. Projects/Shell tests now use the existing accessible name, "More project
actions", retaining their metadata/conflict/archive/completion assertions. One
Workspace test now waits for the observable navigation guards to clear after
acknowledgment instead of assuming effect cleanup coincides with the Saved label;
its pending-input assertions remain intact. No autosave implementation changed.

No dependency, API, calculation, permissions, route, saved preference, guide
content or financial/workflow logic change is included. Existing design-version,
reference-image and device/assistive-technology limitations remain open. The
bounded guide list and compact phone density need founder review on actual devices.
