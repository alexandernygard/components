<script lang="ts">
	import PanelLeftIcon from "@lucide/svelte/icons/panel-left";
	import PanelRightIcon from "@lucide/svelte/icons/panel-right";
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { useResizableSidebar } from "./context.svelte.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		sidebar: sidebarId = "sidebar",
		side = "start",
		onclick,
		children,
		...restProps
	}: ComponentProps<typeof Button> & {
		/** The id of the `Resizable.Sidebar` to toggle. */
		sidebar?: string;
		/** Which edge the sidebar is on, for the icon. */
		side?: "start" | "end";
		onclick?: (e: MouseEvent) => void;
	} = $props();

	// svelte-ignore state_referenced_locally
	const sidebar = useResizableSidebar(sidebarId);
</script>

<Button
	bind:ref
	data-slot="resizable-sidebar-trigger"
	data-state={sidebar.open ? "open" : "collapsed"}
	variant="ghost"
	size="icon-sm"
	aria-expanded={sidebar.open}
	class={cn(className)}
	type="button"
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		{#if side === "end"}
			<PanelRightIcon />
		{:else}
			<PanelLeftIcon />
		{/if}
		<span class="sr-only">Toggle sidebar</span>
	{/if}
</Button>
