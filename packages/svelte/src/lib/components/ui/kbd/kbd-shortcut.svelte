<script lang="ts">
	import { onMount } from "svelte";
	import { formatHotkey, isApple } from "$lib/hotkeys.js";
	import type { WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import Kbd from "./kbd.svelte";
	import KbdGroup from "./kbd-group.svelte";

	// A shortcut such as "mod+k", printed as ⌘ K on Apple devices and Ctrl K
	// elsewhere. Takes the same format as useHotkeys.
	let {
		ref = $bindable(null),
		keys,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLElement>, "children">> & { keys: string } = $props();

	// Checked after mounting, so server-rendered markup matches on hydration.
	let apple = $state(false);

	onMount(() => {
		apple = isApple();
	});
</script>

<KbdGroup bind:ref data-slot="kbd-shortcut" {...restProps}>
	{#each formatHotkey(keys, apple) as key, index (index)}
		<Kbd>{key}</Kbd>
	{/each}
</KbdGroup>
