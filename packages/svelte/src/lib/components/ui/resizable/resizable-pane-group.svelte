<script lang="ts">
	import * as ResizablePrimitive from "paneforge";
	import { cn } from "$lib/utils.js";
	import { hasResizableSidebars, setResizableSidebars } from "./context.svelte.js";

	let {
		ref = $bindable(null),
		this: paneGroup = $bindable(),
		class: className,
		...restProps
	}: ResizablePrimitive.PaneGroupProps & {
		this?: ResizablePrimitive.PaneGroup;
	} = $props();

	if (!hasResizableSidebars()) {
		setResizableSidebars();
	}
</script>

<ResizablePrimitive.PaneGroup
	bind:ref
	bind:this={paneGroup}
	data-slot="resizable-pane-group"
	class={cn(
		"flex h-full w-full data-[direction=vertical]:flex-col",
		className
	)}
	{...restProps}
/>
