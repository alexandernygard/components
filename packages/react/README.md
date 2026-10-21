# @alexandernygard/components

The React components behind my apps: 63 shadcn/ui components on Radix, styled with Tailwind 4 and one shared theme. Storybook is the workbench.

Svelte apps use [`@alexandernygard/components-svelte`](../svelte), which has the same components and theme. Both read their colours, type and fonts from [`@alexandernygard/tokens`](../tokens).

## Use it in an app

```bash
pnpm add @alexandernygard/components
```

**With Tailwind 4** (lommebok, interior-designer and any new Vite app). Import the theme after Tailwind. It adds the tokens and fonts and points Tailwind at the package so the classes get generated:

```css
@import "tailwindcss";
@import "@alexandernygard/components/theme.css";
```

**Without Tailwind**, import the precompiled stylesheet once:

```ts
import "@alexandernygard/components/styles.css"
```

Then:

```tsx
import { Button, Card, CardHeader, CardTitle, TooltipProvider, Toaster } from "@alexandernygard/components"
```

Wrap the app in `TooltipProvider` if it uses tooltips, and render `<Toaster />` once if it uses toasts. `toast()` is exported too, so there's no need to install sonner. Dark mode is the `dark` class on `<html>`. Peer dependencies are `react` and `react-dom` 18.3 or 19.

Every module is its own file and the package is marked side-effect free, so an app only bundles what it imports. Charts (recharts), syntax highlighting (shiki) and the carousel stay out unless you use them.

## The look

- **Colours.** Snow `#f5f7f8`, granite `#18212b`, frost `#dde3e8`, and one accent, cloudberry `#f2a922`. Cloudberry only marks on or selected states: checkboxes, switches, radios, sliders, progress, the active tab, pressed toggles, the active sidebar item and the focus ring.
- **Type.** Libron, from `@alexandernygard/libron`, for everything. Titles in cards, dialogs, sheets, drawers, empty states, field legends and questionnaires use `font-heading`, so an app can give titles a different face by overriding `--font-heading`.
- **Shape.** Corners grow with size: 4px for checkboxes, 8px for controls, 12px for cards, 16px for dialogs, fully round for badges and switches. Shadows are layered and tinted with the ink colour.
- **Status.** `positive`, `warning`, `info` and `destructive` tokens. Badge and Alert have matching variants.

To override a token in an app:

```css
:root {
  --highlight: #3fa36b;
  --ring: #2f8556;
}
```

## What's in it

Accordion, Alert, Alert dialog, Aspect ratio, Attachment, Avatar, Badge, Breadcrumb, Bubble, Button, Button group, Calendar, Card, Carousel, Chart, Checkbox, Code block, Collapsible, Combobox, Command, Context menu, Dialog, Direction, Drawer, Dropdown menu, Empty, Field, Hover card, Illustration, Input, Input group, Input OTP, Item, Kbd, Label, Marker, Menubar, Message, Message scroller, Native select, Navigation menu, Pagination, Popover, Progress, Questionnaire, Radio group, Resizable, Scroll area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner (toasts), Spinner, Switch, Table, Tabs, Textarea, Toggle, Toggle group, Tooltip, Trace.

Bubble, Message, Message scroller, Marker, Attachment, Trace, Code block and Questionnaire cover assistant and chat interfaces.

## Develop

This package lives in a pnpm workspace. Run these from `packages/react`, or from the repo root with `pnpm --filter @alexandernygard/components <script>`.

```bash
pnpm install
pnpm dev              # Storybook on http://localhost:6006
pnpm typecheck
pnpm build            # dist/: ES modules, .d.ts, theme.css, styles.css, fonts.css
pnpm build-storybook  # static Storybook in storybook-static/
```

- Components live in `src/components/ui/`. They are shadcn's `radix-nova` sources with theme edits, so `shadcn add <name>` works. Don't pass `--overwrite` to update an existing component, or you lose the edits.
- After adding a component, run `node scripts/gen-index.mjs` to export it, then add a story in `src/stories/components/`.
- Tokens and fonts live in `packages/tokens`, shared with the Svelte library. `src/styles/shadcn.css` is vendored from the shadcn package (custom variants, `scroll-fade`, `shimmer`).
- Stories are grouped as Foundations (tokens, type, radius, elevation), Components, and Patterns (app shell, settings page, assistant chat).

## Publish

Releases go through Changesets from the repo root. See [Publish](../../README.md#publish) in the root README.
