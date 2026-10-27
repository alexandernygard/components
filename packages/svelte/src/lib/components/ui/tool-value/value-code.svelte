<script lang="ts">
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import { useHighlightedCode } from "$lib/hooks/use-highlighted-code.svelte.js";

	let {
		code,
		language = "",
		title,
		class: className,
	}: {
		code: string;
		language?: string;
		/** Shown in the header. Defaults to the language. */
		title?: string;
		class?: string;
	} = $props();

	const lines = useHighlightedCode(
		() => code,
		() => language
	);
	const label = $derived(title ?? language);
</script>

<CodeBlock.Root data-tool-value="tool-value-code" size="sm" class={className}>
	{#if label}
		<CodeBlock.Header>
			<CodeBlock.Title class="font-mono">{label}</CodeBlock.Title>
			<CodeBlock.Actions><CodeBlock.CopyButton value={code} /></CodeBlock.Actions>
		</CodeBlock.Header>
	{:else}
		<CodeBlock.Actions><CodeBlock.CopyButton value={code} /></CodeBlock.Actions>
	{/if}
	<CodeBlock.Content class="max-h-80">
		{#each lines.current as line, index (index)}
			<CodeBlock.Line code={line} />
		{/each}
	</CodeBlock.Content>
</CodeBlock.Root>
