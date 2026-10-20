<script lang="ts">
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import { useHighlightedCode } from "$lib/hooks/use-highlighted-code.svelte.js";

	let { code, language }: { code: string; language: string } = $props();

	const lines = useHighlightedCode(
		() => code,
		() => language
	);
</script>

<CodeBlock.Root data-slot="markdown-code" size="sm">
	{#if language}
		<CodeBlock.Header>
			<CodeBlock.Title class="font-mono">{language}</CodeBlock.Title>
			<CodeBlock.Actions>
				<CodeBlock.CopyButton value={code} />
			</CodeBlock.Actions>
		</CodeBlock.Header>
	{:else}
		<CodeBlock.Actions>
			<CodeBlock.CopyButton value={code} />
		</CodeBlock.Actions>
	{/if}
	<CodeBlock.Content>
		{#each lines.current as line, index (index)}
			<CodeBlock.Line code={line} />
		{/each}
	</CodeBlock.Content>
</CodeBlock.Root>
