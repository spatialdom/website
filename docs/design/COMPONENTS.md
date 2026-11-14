# Spatialdom component reference

**Version:** 1.2.0  
**Published:** 14 November 2026  
**Status:** Approved standard; examples demonstrate UI behavior only.

Read [the full guidelines](/design/GUIDELINES.md) for normative safeguards. These examples do not create product features or replace domain specifications. The supplied SPARTA implementation inventory is preserved separately at [source inventory](/design/source/COMPONENTS.md); its local repository paths and historical verification results are not website implementation claims.

## Buttons and controls

Use primary, secondary, tertiary and destructive variants with specific sentence-case action labels. One primary action per region. Small and medium buttons retain 44px common touch targets. Native buttons perform actions; anchors navigate. Loading retains the action name, disables duplicate requests and exposes busy state. Destructive operations require confirmation or reliable undo.

## Text inputs and selects

Use visible labels above native controls, 16px minimum mobile input text and 44px common targets. Associate hints and errors with the field. Preserve input on failure; focus the first invalid field after submission. For exact distances and monetary strings, prefer text with decimal input mode and never parse or round values in a generic UI primitive.

## Cards and panels

Group related information with white surfaces, subtle borders and deliberate spacing. Use restrained radii from tokens; reserve shadows for floating surfaces. Do not make inert cards look clickable.

## Tabs

Expose selected state beyond color. Use tablist/tab/tabpanel semantics, a roving tab stop, arrow keys, Home and End. Retain contextual state when changing tabs.

## Badges and feedback

Pair status colors with words. Static badges are not controls or live regions. Loading, empty, sparse, dense, success, warning, error, disabled, offline, unsaved, partially complete and permission-denied states require meaningful recovery. A computed closed geometry never implies verified ownership, legal boundary or professional approval.

## Tables

Use native tables, captions, scoped headers, tabular numerals and right-aligned numerical values with units. Provide a labelled, keyboard-scrollable region when horizontal overflow is necessary. Do not add inert sorting controls.

## Dialogs

Name dialogs, move focus inside, contain keyboard focus, support Escape and return focus to the opener. Clearly identify destructive actions. A native modal dialog is appropriate for lightweight examples.

## Icons

Use the product's established rounded-outline treatment: 24px base, approximately 1.75–2px strokes with rounded caps and joins. Keep decorative icons hidden from assistive technology and label containing actions. Do not introduce another icon library for this reference.

## Typography and tokens

Use Source Sans 3, body 400, label 500, heading 600 and occasional hero 700. Sentence case; preserve technical identifiers. Readable body text generally 16px, line lengths around 60–75 characters. Use semantic colors and spacing 4, 8, 12, 16, 24, 32, 48, 64px. Map existing application variables through a reviewed migration; do not silently recolor legacy products.

## Adoption

Pin this file together with GUIDELINES.md, AGENTS_SNIPPET.md and tokens.json to version 1.2.0. Record the source commit and adoption date locally. Review upgrades and exceptions per the governance section of the guidelines. Applications do not fetch the public website at runtime.
