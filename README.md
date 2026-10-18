# @alexandernygard/components

The React components behind my apps: 63 shadcn/ui components on Radix, styled with Tailwind 4 and one shared theme. Storybook is the workbench.

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
- **Type.** Schibsted Grotesk for the interface. Libron for titles: cards, dialogs, sheets, drawers, empty states, field legends and questionnaires. Use `font-heading` or `font-serif` for your own.
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

Accordion, Alert, Alert dialog, Aspect ratio, Attachment, Avatar, Badge, Breadcrumb, Bubble, Button, Button group, Calendar, Card, Carousel, Chart, Checkbox, Code block, Collapsible, Combobox, Command, Context menu, Dialog, Direction, Drawer, Dropdown menu, Empty, Field, Hover card, Input, Input group, Input OTP, Item, Kbd, Label, Marker, Menubar, Message, Message scroller, Native select, Navigation menu, Pagination, Popover, Progress, Questionnaire, Radio group, Resizable, Scroll area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner (toasts), Spinner, Switch, Table, Tabs, Textarea, Toggle, Toggle group, Tooltip, Trace.

Bubble, Message, Message scroller, Marker, Attachment, Trace, Code block and Questionnaire cover assistant and chat interfaces.

## Develop

```bash
pnpm install
pnpm dev              # Storybook on http://localhost:6006
pnpm typecheck
pnpm build            # dist/: ES modules, .d.ts, theme.css, styles.css, fonts.css
pnpm build-storybook  # static Storybook in storybook-static/
```

- Components live in `src/components/ui/`. They are shadcn's `radix-nova` sources with theme edits, so `shadcn add <name>` works. Don't pass `--overwrite` to update an existing component, or you lose the edits.
- After adding a component, run `node scripts/gen-index.mjs` to export it, then add a story in `src/stories/components/`.
- Tokens live in `src/styles/tokens.css`. `src/styles/shadcn.css` is vendored from the shadcn package (custom variants, `scroll-fade`, `shimmer`).
- Stories are grouped as Foundations (tokens, type, radius, elevation), Components, and Patterns (app shell, settings page, assistant chat).

## Publish

Publish from your machine, like `@alexandernygard/libron`:

```bash
pnpm version patch       # or minor / major; commits and tags
git push --follow-tags
pnpm publish             # typechecks and builds first, then asks you to approve in the browser
```

The package is scoped and `publishConfig.access` is `public`.
