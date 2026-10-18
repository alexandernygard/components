<script lang="ts">
	// Custom component: shadcn-svelte has no Combobox yet (its docs compose Popover + Command).
	// Built on the Bits UI Combobox primitive to match the React library's Combobox.
	// Replace with the official one when shadcn-svelte ports it.
	import { Combobox as ComboboxPrimitive } from "bits-ui";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof ComboboxPrimitive.Group> = $props();
</script>

<ComboboxPrimitive.Group bind:ref data-slot="combobox-group" {...restProps} />
