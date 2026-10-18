# @alexandernygard/tokens

The design tokens and fonts shared by [`@alexandernygard/components`](../react) (React) and [`@alexandernygard/components-svelte`](../svelte). Change a colour here and both libraries pick it up.

You normally don't install this directly: both component packages depend on it and import it from their `theme.css`. Use it on its own for a Tailwind 4 app that wants the look without the components:

```css
@import "tailwindcss";
@import "@alexandernygard/tokens";
```

- `index.css`: fonts and tokens.
- `tokens.css`: CSS variables for light and `.dark`, the Tailwind `@theme inline` mapping (`bg-highlight`, `text-positive`, `font-heading`, ...), radius scale, tinted shadows and base styles.
- `fonts.css`: Schibsted Grotesk (interface) and Libron (`@alexandernygard/libron`, titles).

Override any token in an app:

```css
:root { --highlight: #3fa36b; --ring: #2f8556; }
```

## Publish

```bash
pnpm version patch
pnpm publish
```

Publish this before a component package that needs the new version.
