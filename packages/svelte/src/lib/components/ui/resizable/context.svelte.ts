import { getContext, hasContext, setContext } from "svelte";
import { SvelteMap } from "svelte/reactivity";

export type ResizableSidebarState = {
	readonly open: boolean;
	setOpen: (open: boolean) => void;
	toggle: () => void;
};

const SYMBOL_KEY = Symbol.for("resizable-sidebars");

/**
 * Lets a `Resizable.SidebarTrigger` or `useResizableSidebar` outside the pane
 * group reach its sidebars. A `Resizable.PaneGroup` sets one itself when there
 * is none above it.
 */
export function setResizableSidebars() {
	return setContext(SYMBOL_KEY, new SvelteMap<string, ResizableSidebarState>());
}

export function hasResizableSidebars() {
	return hasContext(SYMBOL_KEY);
}

export function getResizableSidebars(): SvelteMap<string, ResizableSidebarState> | undefined {
	return getContext(SYMBOL_KEY);
}

/**
 * The open state of a `Resizable.Sidebar`, by its id. This is a reactive
 * object, so you cannot destructure `open`.
 */
export function useResizableSidebar(id = "sidebar"): ResizableSidebarState {
	const sidebars = getResizableSidebars();

	if (!sidebars) {
		throw new Error(
			"useResizableSidebar must be used inside a Resizable.PaneGroup or Resizable.SidebarProvider."
		);
	}

	return {
		get open() {
			return sidebars.get(id)?.open ?? false;
		},
		setOpen: (open) => sidebars.get(id)?.setOpen(open),
		toggle: () => sidebars.get(id)?.toggle(),
	};
}
