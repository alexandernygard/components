<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import TerminalIcon from "@lucide/svelte/icons/terminal";
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import { useHighlightedCode } from "$lib/hooks/use-highlighted-code.svelte.js";

	const { Story } = defineMeta({ title: "Components/Code block" });

	const install = "pnpm add @alexandernygard/components-svelte";
	const source = `<script lang="ts">
	import * as Card from "@alexandernygard/components-svelte/card";
	import { Progress } from "@alexandernygard/components-svelte/progress";

	let { saved, target }: { saved: number; target: number } = $props();
<\/script>

<Card.Root>
	<Card.Header><Card.Title>Flat deposit</Card.Title></Card.Header>
	<Card.Content><Progress value={(saved / target) * 100} /></Card.Content>
</Card.Root>`;
</script>

<script lang="ts">
	const highlighted = useHighlightedCode(
		() => source,
		() => "svelte"
	);
</script>

<Story name="Terminal">
	<CodeBlock.Root class="w-[32rem]">
		<CodeBlock.Header>
			<CodeBlock.Title><TerminalIcon /> Terminal</CodeBlock.Title>
			<CodeBlock.Actions><CodeBlock.CopyButton value={install} /></CodeBlock.Actions>
		</CodeBlock.Header>
		<CodeBlock.Content code={install} />
	</CodeBlock.Root>
</Story>

<Story name="Highlighted">
	<CodeBlock.Root class="w-[40rem]">
		<CodeBlock.Header>
			<CodeBlock.Title>savings-card.svelte</CodeBlock.Title>
			<CodeBlock.Actions><CodeBlock.CopyButton value={source} /></CodeBlock.Actions>
		</CodeBlock.Header>
		<CodeBlock.Content lineNumbers>
			{#each highlighted.current as line, i (i)}
				<CodeBlock.Line code={line} variant={i >= 8 && i <= 10 ? "highlighted" : "default"} />
			{/each}
		</CodeBlock.Content>
	</CodeBlock.Root>
</Story>

<Story name="Failure">
	<CodeBlock.Root variant="destructive" class="w-[32rem]">
		<CodeBlock.Header><CodeBlock.Title>Build failed</CodeBlock.Title></CodeBlock.Header>
		<CodeBlock.Content wrap code="src/worker/queries.ts(42,7): error TS2322: Type 'string' is not assignable to type 'number'." />
	</CodeBlock.Root>
</Story>
