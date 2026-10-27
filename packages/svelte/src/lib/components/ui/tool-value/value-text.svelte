<script lang="ts">
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import { cn } from "$lib/utils.js";
	import { formatPrimitive } from "./utils.js";

	let { value, class: className }: { value: unknown; class?: string } = $props();

	const text = $derived(formatPrimitive(value));
</script>

{#if text.includes("\n") || text.length > 120}
	<CodeBlock.Root data-tool-value="tool-value-text" size="sm" class={className}>
		<CodeBlock.Actions><CodeBlock.CopyButton value={text} /></CodeBlock.Actions>
		<CodeBlock.Content wrap class="max-h-80" code={text} />
	</CodeBlock.Root>
{:else}
	<p data-slot="tool-value-text" class={cn("text-sm wrap-break-word text-foreground", className)}>
		{text}
	</p>
{/if}
