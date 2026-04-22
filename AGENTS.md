<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:namaste-cam-ui-rules -->
# Namaste Cam — screens and design system

When adding or editing **screens** (pages under `app/`), **layout**, or **feature UI**:

## Use existing components first

- **Primitives:** Import from `@/components/ui/` only — `Button`, `Card`, `Input`, `Badge`, `Modal`, `Table` / table helpers, `Tabs`. Do not recreate buttons, inputs, cards, or modals inline unless a gap is documented and a primitive is extended in `components/ui/`.
- **Chrome:** Dashboard-style pages live under `app/(dashboard)/` and use `DashboardShell` / `Sidebar` / `Header` / `PageContainer` from `@/components/layout/`. Do not duplicate top-level shell markup on each page.
- **Icons:** Use `@/components/MaterialIcon` with Material Symbols ligature names (e.g. `search`, `notifications`). Do not add other icon libraries for standard UI.
- **Utilities:** Use `@/lib/cn` for conditional classes when composing variants.

## Design system only (no one-off visual systems)

- **Tokens:** Colors, radii, shadows, and fonts must come from the theme in [`app/globals.css`](app/globals.css) (`@theme inline`). Use semantic Tailwind classes — e.g. `bg-background`, `bg-surface`, `bg-surface-container-lowest`, `text-on-surface`, `text-secondary`, `text-primary`, `ring-outline-variant/20`, `shadow-primary-soft`, `rounded-xl`, `rounded-full`, `font-headline`, `font-body`.
- **Do not** hard-code hex colors, arbitrary pixel spacings, or new font families on screens unless you are **updating the global theme** and the **design system showcase** together.
- **Reference:** Match patterns shown on the **`/design-system`** page and tokens described in [`design-system.md`](design-system.md). New patterns belong in `components/design-system/` or `components/ui/` first, then screens consume them.
- **Brand:** User-facing product name is **Namaste Cam** (metadata, headers, login, design-system chrome).

## Practical flow for a new screen

1. Wrap content in `PageContainer` (title + description) inside dashboard `main` where applicable.
2. Use `Card` for grouped content; `Button` / `Input` / `Badge` for controls and status.
3. Reuse spacing and typography rhythm from `/design-system` (generous padding, pill actions, soft rings instead of heavy borders).

If a needed variant is missing, **extend the existing primitive** in `components/ui/` (same API style) rather than styling a raw `<button>` or `<input>` on the page.
<!-- END:namaste-cam-ui-rules -->
