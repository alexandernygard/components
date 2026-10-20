<script lang="ts">
	import type { Snippet } from "svelte";
	import { setResizableSidebars } from "./context.svelte.js";

	let { children }: { children?: Snippet } = $props();

	setResizableSidebars();
</script>

{@render children?.()}
