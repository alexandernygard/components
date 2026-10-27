<script lang="ts">
	import * as Trace from "$lib/components/ui/trace/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof Trace.CollapsibleContent> = $props();
</script>

<Trace.CollapsibleContent
	bind:ref
	data-slot="tool-call-content"
	class={cn("flex flex-col gap-3", className)}
	{...restProps}
/>
