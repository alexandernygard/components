<script lang="ts">
	// Custom component: shadcn-svelte has no Direction yet. See context.ts.
	// Sets `dir` on a wrapper (display: contents) so CSS logical properties and rtl: variants
	// follow it, and shares the value through useDirection().
	import type { Snippet } from "svelte";
	import { setDirection, type Direction } from "./context.js";

	let {
		dir,
		direction,
		children,
	}: { dir?: Direction; direction?: Direction; children?: Snippet } = $props();

	const value = $derived(direction ?? dir ?? "ltr");
	setDirection(() => value);
</script>

<div data-slot="direction-provider" dir={value} class="contents">
	{@render children?.()}
</div>
