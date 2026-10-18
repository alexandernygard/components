<script lang="ts">
	// Custom component: shadcn-svelte has no Combobox yet (its docs compose Popover + Command).
	// Built on the Bits UI Combobox primitive to match the React library's Combobox.
	// Replace with the official one when shadcn-svelte ports it.
	import { Combobox as ComboboxPrimitive } from "bits-ui";

	let {
		open = $bindable(false),
		value = $bindable(),
		...restProps
	}: ComboboxPrimitive.RootProps = $props();
</script>

<ComboboxPrimitive.Root bind:open bind:value={value as never} {...restProps} />
