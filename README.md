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

Releases use [Changesets](https://github.com/changesets/changesets) and are published from your machine.

**With each change**, record what changed:

```bash
pnpm changeset
```

Pick the packages and patch, minor or major, and write one sentence for the changelog. Commit the generated file in `.changeset/` along with the change. If you change `packages/tokens`, select the component packages too, because their precompiled `styles.css` includes the tokens.

**To release:**

```bash
pnpm version-packages                 # bumps versions, writes each CHANGELOG.md, bumps dependents
git commit -am "Release" && git push
pnpm release                          # typecheck, build, publish what changed (tokens first), tag
git push --follow-tags
```

`pnpm release` asks you to approve each package in the browser. Only packages whose new version isn't on npm yet are published, and tags look like `@alexandernygard/tokens@0.1.1`. `pnpm changeset status` shows what the next release will contain.
