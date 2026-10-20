<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Bubble from "$lib/components/ui/bubble/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Markdown } from "$lib/components/ui/markdown/index.js";

	const { Story } = defineMeta({ title: "Components/Markdown", parameters: { layout: "padded" } });

	const reply = `## Your September

You spent **kr 23 480**, which is *kr 1 120 less* than August. The biggest changes:

1. Eating out fell to kr 1 600, mostly fewer weekday lunches.
2. Transport rose by kr 640 after the [Ruter](https://ruter.no) price change.
3. Two subscriptions renewed:
   - Spotify, kr 129
   - iCloud, kr 39

| Category | August | September |
| --- | ---: | ---: |
| Groceries | kr 4 210 | kr 4 080 |
| Eating out | kr 2 000 | kr 1 600 |
| Transport | kr 820 | kr 1 460 |

> At this pace you reach the deposit in **May 2028**.

- [x] Set a limit for eating out
- [ ] Review subscriptions

To export the numbers, run \`lommebok export\`:

\`\`\`bash
lommebok export --month 2026-09 --format csv
\`\`\`

\`\`\`ts
const saved = transactions
  .filter((t) => t.category === "savings")
  .reduce((sum, t) => sum + t.amount, 0)
\`\`\`
`;
</script>

<script lang="ts">
	let length = $state(0);
	const streaming = $derived(length < reply.length);

	$effect(() => {
		if (!streaming) return;
		const timeout = setTimeout(() => (length = Math.min(length + 3, reply.length)), 20);
		return () => clearTimeout(timeout);
	});
</script>

<Story name="Default">
	<div class="max-w-xl">
		<Markdown content={reply} />
	</div>
</Story>

<Story name="Streaming">
	<div class="grid max-w-xl gap-4">
		<Button variant="outline" size="sm" class="w-fit" onclick={() => (length = 0)}>Replay</Button>
		<Bubble.Root variant="ghost">
			<Bubble.Content>
				<Markdown content={reply.slice(0, length)} {streaming} />
			</Bubble.Content>
		</Bubble.Root>
	</div>
</Story>

<Story name="In a bubble">
	<div class="grid max-w-md gap-3">
		<Bubble.Root align="end">
			<Bubble.Content>
				<Markdown content={"Can you **compare** August and September? Use `kr`."} />
			</Bubble.Content>
		</Bubble.Root>
		<Bubble.Root variant="muted">
			<Bubble.Content>
				<Markdown content={"Sure. September was **kr 1 120** lower, and `eating out` fell the most."} />
			</Bubble.Content>
		</Bubble.Root>
	</div>
</Story>
