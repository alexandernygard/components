<script lang="ts">
	// Custom component: shadcn-svelte has no Combobox yet (its docs compose Popover + Command).
	// Built on the Bits UI Combobox primitive to match the React library's Combobox.
	// Replace with the official one when shadcn-svelte ports it.
	import { Combobox as ComboboxPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		disabled = false,
		showTrigger = true,
		...restProps
	}: WithoutChild<ComboboxPrimitive.InputProps> & {
		showTrigger?: boolean;
	} = $props();
</script>

<InputGroup.Root data-slot="combobox-input" class={cn("w-auto", className)}>
	<ComboboxPrimitive.Input bind:ref {disabled} {...restProps}>
		{#snippet child({ props })}
			<InputGroup.Input {...props} />
		{/snippet}
	</ComboboxPrimitive.Input>
	{#if showTrigger}
		<InputGroup.Addon align="inline-end">
			<ComboboxPrimitive.Trigger {disabled}>
				{#snippet child({ props })}
					<InputGroup.Button
						{...props}
						size="icon-xs"
						variant="ghost"
						data-slot="combobox-trigger"
						aria-label="Show options"
					>
						<ChevronDownIcon class="pointer-events-none size-4 text-muted-foreground" />
					</InputGroup.Button>
				{/snippet}
			</ComboboxPrimitive.Trigger>
		</InputGroup.Addon>
	{/if}
</InputGroup.Root>
