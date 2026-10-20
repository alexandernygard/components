<script lang="ts">
	import { BitsConfig } from "bits-ui";
	import type { Snippet } from "svelte";

	// Sets where dialogs, menus, popovers, tooltips and other overlays render.
	// They render into document.body by default, which breaks inside a scaled or
	// transformed container, a zoomable canvas or an iframe.
	let {
		container,
		children,
	}: {
		/** The element, or a selector for it. */
		container: HTMLElement | string | null | undefined;
		children?: Snippet;
	} = $props();
</script>

<BitsConfig defaultPortalTo={container ?? undefined}>
	{@render children?.()}
</BitsConfig>
