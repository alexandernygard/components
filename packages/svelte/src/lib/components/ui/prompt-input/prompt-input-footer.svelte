<script lang="ts">
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof InputGroup.Addon> = $props();
</script>

<InputGroup.Addon
	bind:ref
	data-slot="prompt-input-footer"
	align="block-end"
	class={cn(className)}
	{...restProps}
>
	{@render children?.()}
</InputGroup.Addon>
