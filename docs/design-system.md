# Spatialdom design system

The light theme is canonical. Shared values live in `src/styles/index.css` and Tailwind aliases live in `tailwind.config.ts`. Use tokens and shared components instead of page-specific colors or control styles.

## Before implementing a page

Write down its **first thought** (what the visitor should understand immediately) and **first action** (the one useful step they should take next). Put these in the page brief or a nearby code comment before layout work. Keep the heading, content order, and primary action aligned with that decision. Review both at mobile and desktop widths.

## Foundations

- **Type:** Source Sans 3 is bundled locally through Fontsource. Use weight 400 for body, 500 for labels and controls, 600 for section headings, and 700 for major headings. Use tabular numerals for values that align in columns. Avoid decorative monospace.
- **Color:** Canvas `#F7F8FA`, surface `#FFFFFF`, alternate surface `#F1F3F5`, primary text `#17202A`, secondary text `#596574`, border `#DCE2E8`, and Spatialdom Blue `#123B5D`. The CSS tokens also define blue hover, pressed, link, selection, and focus states.
- **Semantic color:** Success, warning, danger, and information each have foreground and soft background tokens. Pair every status color with text or an icon and accessible label.
- **Shape:** Use `rounded-xs` (4px), `rounded-sm` (6px), `rounded-md` (8px), `rounded-lg` (12px), or `rounded-xl` (16px). Use full pills only for chips, tags, status badges, and segmented controls.
- **Surface:** Prefer borders and spacing to shadows. Reserve `shadow-panel` for overlays or elevated navigation. Avoid decorative gradients.
- **Icons:** Use simple outlines with rounded caps and joins. Icon-only buttons need an accessible name.

## Shared UI

- `Button` provides primary, secondary, and danger variants, with hover, pressed, focus, and disabled states. Existing `interactive-accent` and `interactive-outline` classes share those states for links and older controls.
- `Badge` provides success, warning, danger, information, and neutral tones. Its visible text identifies the state.
- `Card` provides the bordered surface. `Container` and `Section` set consistent page widths and vertical rhythm.
- `IconButton` provides the minimum touch target and requires an `aria-label`.
- `Navbar` provides desktop and mobile navigation. Current page links use `aria-current`.
- `.text-link`, `.nav-link`, `.theme-text-link`, and `.form-control` provide consistent links and form styling. `:focus-visible` supplies the shared focus ring across controls.

Use semantic HTML and test keyboard navigation, status messages, and 320px layouts when applying the system to a page.
