<script lang="ts">
	import { Pane, type PaneProps } from "paneforge";
	import { useHotkeys } from "$lib/hooks/use-hotkeys.svelte.js";
	import { cn } from "$lib/utils.js";
	import { getResizableSidebars } from "./context.svelte.js";

	// A working pane, such as an inspector or a chat, that resizes, snaps shut
	// when dragged below its minimum size and opens and closes from a trigger
	// or a shortcut. Give each one in a group its own id. Sizes are percentages.
	let {
		id = "sidebar",
		open = $bindable(true),
		onOpenChange,
		shortcut,
		defaultSize = 25,
		minSize = 15,
		collapsedSize = 0,
		class: className,
		onCollapse,
		onExpand,
		...restProps
	}: Omit<PaneProps, "id" | "collapsible"> & {
		id?: string;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		/** A shortcut that toggles the sidebar, such as "mod+b". */
		shortcut?: string;
	} = $props();

	let pane = $state<ReturnType<typeof Pane>>();

	// The state the pane was last moved to. Dragging it open or shut updates
	// this too, so the effect below doesn't move it back.
	// svelte-ignore state_referenced_locally
	let applied = open;

	// Paneforge saves layouts under the panes' sizes, so this stays the same
	// when the sidebar opens and closes.
	// svelte-ignore state_referenced_locally
	const initialSize = open ? defaultSize : collapsedSize;

	function setOpen(next: boolean) {
		open = next;
		onOpenChange?.(next);
	}

	function toggle() {
		setOpen(pane ? pane.isCollapsed() : !open);
	}

	$effect(() => {
		if (applied === open || !pane) {
			return;
		}

		applied = open;

		if (open) {
			pane.expand();
		} else {
			pane.collapse();
		}
	});

	const sidebars = getResizableSidebars();

	$effect(() => {
		const sidebar = {
			get open() {
				return open;
			},
			setOpen,
			toggle,
		};

		sidebars?.set(id, sidebar);

		return () => {
			if (sidebars?.get(id) === sidebar) {
				sidebars.delete(id);
			}
		};
	});

	useHotkeys(
		() => shortcut ?? "",
		toggle,
		() => ({ enabled: !!shortcut })
	);
</script>

<!-- A sidebar collapsed to nothing is hidden, so its controls can't be tabbed to. -->
<Pane
	bind:this={pane}
	{id}
	data-slot="resizable-sidebar"
	data-state={open ? "open" : "collapsed"}
	collapsible
	{collapsedSize}
	{minSize}
	defaultSize={initialSize}
	class={cn(!open && !collapsedSize && "invisible", className)}
	onCollapse={() => {
		if (applied) {
			applied = false;
			setOpen(false);
		}
		onCollapse?.();
	}}
	onExpand={() => {
		if (!applied) {
			applied = true;
			setOpen(true);
		}
		onExpand?.();
	}}
	{...restProps}
/>
