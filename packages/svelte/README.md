# @alexandernygard/components-svelte

The Svelte side of my component library: 64 shadcn-svelte components on Bits UI, with the same theme as the React package [`@alexandernygard/components`](../react). Both read their colours, type and fonts from [`@alexandernygard/tokens`](../tokens). Svelte 5 only.

## Use it in an app

```bash
pnpm add @alexandernygard/components-svelte
```

**With Tailwind 4** (nyggis, portfolio). Import the theme after Tailwind in the app's main CSS file:

```css
@import "tailwindcss";
@import "@alexandernygard/components-svelte/theme.css";
```

**Without Tailwind**, import the precompiled stylesheet once, e.g. in `+layout.svelte` or `main.ts`:

```ts
import "@alexandernygard/components-svelte/styles.css";
```

Import each component from its own path. It's the same as the shadcn-svelte docs, with `$lib/components/ui/` swapped for the package name, so their examples work as written:

```svelte
<script lang="ts">
	import { Button } from "@alexandernygard/components-svelte/button";
	import * as Dialog from "@alexandernygard/components-svelte/dialog";
	import { Toaster, toast } from "@alexandernygard/components-svelte/sonner";
	import { cn } from "@alexandernygard/components-svelte";
</script>

<Dialog.Root>
	<Dialog.Trigger>Open</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Title>Edit budget</Dialog.Title>
	</Dialog.Content>
</Dialog.Root>
<Toaster />
```

The package root exports `cn`, the `IsMobile` and `useHighlightedCode` hooks and the code highlighter. Render `<Toaster />` once if the app uses toasts; it follows the system theme unless you pass `theme="light"` or `"dark"`. Wrap tooltips in `<Tooltip.Provider>`. Dark mode is the `dark` class on `<html>`.

Components are composable and controllable like shadcn-svelte's: compound parts, `bind:open` / `bind:value` / `bind:checked` or uncontrolled, `child` snippets to render your own element, and `class` overrides merged with tailwind-merge.

## What's in it

Accordion, Alert, Alert dialog, Aspect ratio, Attachment, Avatar, Badge, Breadcrumb, Bubble, Button, Button group, Calendar, Card, Carousel, Chart (LayerChart), Checkbox, Code block, Collapsible, Combobox, Command, Context menu, Dialog, Direction, Drawer, Dropdown menu, Empty, Field, Hover card, Input, Input group, Input OTP, Item, Kbd, Label, Marker, Menubar, Message, Message scroller, Native select, Navigation menu, Pagination, Popover, Progress, Questionnaire, Radio group, Range calendar, Resizable, Scroll area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner (toasts), Spinner, Switch, Table, Tabs, Textarea, Toggle, Toggle group, Tooltip, Trace.

**Custom built:** Combobox and Direction aren't in shadcn-svelte yet, so they're written here to match the React library. Combobox is on Bits UI's combobox; filtering is up to the app. Direction is a small context provider with `useDirection()`. Each file says so at the top. Replace them when shadcn-svelte ports its own.

shadcn-svelte's Form component is left out because it ties the package to SvelteKit and superforms. Use Field instead.

## Develop

Run these from `packages/svelte`, or from the repo root with `pnpm dev:svelte`.

```bash
pnpm dev              # Storybook on http://localhost:6007
pnpm typecheck        # svelte-check, stories included
pnpm build            # dist/: .svelte files, .d.ts, styles/theme.css, styles.css
pnpm build-storybook
```

- Components live in `src/lib/components/ui/`. They're shadcn-svelte's `nova` sources with the same theme edits as the React package: cloudberry for on and selected states, Libron for titles, and `positive`/`warning`/`info` variants on Badge and Alert. `pnpm dlx shadcn-svelte@latest add <name>` adds more. Don't pass `--overwrite` to an existing component, or the edits are lost.
- The library imports with `$lib`, which `svelte-package` rewrites to relative paths. SvelteKit 3 replaced `$lib` with `#lib`, but `svelte-package` 2.5 doesn't rewrite `#lib` yet, so `vite.config.ts` keeps the deprecated alias. Expect a deprecation warning.
- Storybook runs on plain Svelte and Vite (`vite.storybook.config.ts`), because `@storybook/sveltekit` doesn't support SvelteKit 3 yet.
- `src/lib/styles/shadcn.css` is vendored from shadcn-svelte's `tailwind.css`.

## Publish

Releases go through Changesets from the repo root. See [Publish](../../README.md#publish) in the root README.
