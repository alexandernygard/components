<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<!-- Asks the user to allow a call. Sits under the trigger, outside the
collapsible content, so it shows while the call is collapsed. -->
<div bind:this={ref} data-slot="tool-call-approval" role="group" class={cn("mt-2 mb-1 ml-[calc(--spacing(2)_-_1px)] flex min-w-0 flex-col gap-2.5 border-l border-warning/50 pl-4 text-sm text-foreground", className)} {...restProps}>
	{@render children?.()}
</div>
