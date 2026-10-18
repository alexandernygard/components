# components

My component libraries, one theme for React and Svelte.

| Package | What it is |
| --- | --- |
| [`@alexandernygard/components`](packages/react) | React: shadcn/ui on Radix. For lommebok, interior-designer. |
| [`@alexandernygard/components-svelte`](packages/svelte) | Svelte 5: shadcn-svelte on Bits UI. For nyggis, portfolio. |
| [`@alexandernygard/tokens`](packages/tokens) | The shared colours, type, radius, shadows and fonts both libraries use. |

Snow, granite and frost, with one accent colour, cloudberry, for on and selected states. Everything is set in Libron, from `@alexandernygard/libron`.

## Develop

```bash
pnpm install
pnpm dev          # React Storybook on :6006
pnpm dev:svelte   # Svelte Storybook on :6007
pnpm typecheck    # all packages
pnpm build        # all packages
```

Change a token in `packages/tokens` and both libraries pick it up. A styling change to a component has to be made in both `packages/react` and `packages/svelte`.

## Publish

Each package is published by hand from its folder with `pnpm publish`. Publish `tokens` first when it changed, since the libraries depend on it.
