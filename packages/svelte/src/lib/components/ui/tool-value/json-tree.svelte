<script lang="ts">
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import JsonNode from "./json-node.svelte";
	import { stringify } from "./utils.js";

	let {
		value,
		defaultExpandDepth = 1,
		class: className,
	}: {
		value: unknown;
		/** Objects and arrays deeper than this start collapsed. */
		defaultExpandDepth?: number;
		class?: string;
	} = $props();
</script>

<CodeBlock.Root data-tool-value="json-tree" size="sm" class={className}>
	<CodeBlock.Actions><CodeBlock.CopyButton value={stringify(value)} /></CodeBlock.Actions>
	<div
		class="max-h-80 min-w-0 scrollbar-thin overflow-auto px-2.5 py-2.5 font-mono leading-relaxed"
	>
		<JsonNode {value} depth={0} expandDepth={defaultExpandDepth} />
	</div>
</CodeBlock.Root>
