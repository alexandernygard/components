<script lang="ts">
	// Custom component: shadcn-svelte has no Combobox yet (its docs compose Popover + Command).
	// Built on the Bits UI Combobox primitive to match the React library's Combobox.
	// Replace with the official one when shadcn-svelte ports it.
	import { Combobox as ComboboxPrimitive } from "bits-ui";
	import type { ComponentProps } from "svelte";
	import { cn, type WithoutChild, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 6,
		align = "start",
		portalProps,
		children,
		...restProps
	}: WithoutChild<ComboboxPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof ComboboxPrimitive.Portal>>;
	} = $props();
</script>

<ComboboxPrimitive.Portal {...portalProps}>
	<ComboboxPrimitive.Content
		bind:ref
		{sideOffset}
		{align}
		data-slot="combobox-content"
		class={cn(
			"group/combobox-content relative z-50 max-h-[min(--spacing(72),var(--bits-combobox-content-available-height))] w-(--bits-combobox-anchor-width) min-w-[calc(var(--bits-combobox-anchor-width)+--spacing(7))] origin-(--bits-combobox-content-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
			className
		)}
		{...restProps}
	>
		<ComboboxPrimitive.Viewport class="no-scrollbar max-h-[inherit] scroll-py-1 overflow-y-auto overscroll-contain p-1">
			{@render children?.()}
		</ComboboxPrimitive.Viewport>
	</ComboboxPrimitive.Content>
</ComboboxPrimitive.Portal>
