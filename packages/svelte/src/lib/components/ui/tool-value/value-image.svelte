<script lang="ts">
	import { cn } from "$lib/utils.js";
	import JsonTree from "./json-tree.svelte";
	import { imageSource } from "./utils.js";

	let { value, class: className }: { value: unknown; class?: string } = $props();

	const src = $derived(imageSource(value));
</script>

{#if src}
	<img
		data-slot="tool-value-image"
		{src}
		alt=""
		class={cn("max-h-80 w-auto max-w-full rounded-lg border object-contain", className)}
	/>
{:else}
	<JsonTree {value} class={className} />
{/if}
