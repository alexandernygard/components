<script lang="ts">
	// Custom component: shadcn-svelte has no Combobox yet (its docs compose Popover + Command).
	// Built on the Bits UI Combobox primitive to match the React library's Combobox.
	// Replace with the official one when shadcn-svelte ports it.
	import { Combobox as ComboboxPrimitive } from "bits-ui";
	import type { ComponentProps } from "svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ComboboxPrimitive.GroupHeading> = $props();
</script>

<ComboboxPrimitive.GroupHeading
	bind:ref
	data-slot="combobox-label"
	class={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</ComboboxPrimitive.GroupHeading>
