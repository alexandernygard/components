import { Pane } from "paneforge";
import Handle from "./resizable-handle.svelte";
import PaneGroup from "./resizable-pane-group.svelte";
import Sidebar from "./resizable-sidebar.svelte";
import SidebarProvider from "./resizable-sidebar-provider.svelte";
import SidebarTrigger from "./resizable-sidebar-trigger.svelte";
import { useResizableSidebar, type ResizableSidebarState } from "./context.svelte.js";

export {
	PaneGroup,
	Pane,
	Handle,
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
	useResizableSidebar,
	type ResizableSidebarState,
	//
	PaneGroup as ResizablePaneGroup,
	Pane as ResizablePane,
	Handle as ResizableHandle,
	Sidebar as ResizableSidebar,
	SidebarProvider as ResizableSidebarProvider,
	SidebarTrigger as ResizableSidebarTrigger,
};
