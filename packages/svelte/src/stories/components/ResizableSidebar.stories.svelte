<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Kbd from "$lib/components/ui/kbd/index.js";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import ChatStatus from "./ResizableSidebarStatus.svelte";

	const { Story } = defineMeta({
		title: "Components/Resizable sidebar",
		parameters: { layout: "fullscreen" },
	});
</script>

<Story name="Editor, inspector and chat">
	<Resizable.SidebarProvider>
		<div class="flex h-[32rem] flex-col border">
			<header class="flex h-11 shrink-0 items-center gap-1 border-b px-2">
				<Resizable.SidebarTrigger sidebar="files" />
				<span class="text-sm font-medium">budget.deck.svelte</span>
				<div class="ml-auto flex items-center gap-2">
					<ChatStatus />
					<Separator orientation="vertical" class="h-4" />
					<Resizable.SidebarTrigger sidebar="chat" side="end" />
				</div>
			</header>
			<Resizable.PaneGroup direction="horizontal" autoSaveId="story-editor-layout">
				<Resizable.Sidebar id="files" defaultSize={18} minSize={12} maxSize={30} shortcut="mod+b">
					<div class="flex h-full flex-col gap-1 p-3 text-sm">
						<p class="mb-1 font-medium">Files</p>
						<p class="text-muted-foreground">budget.deck.svelte</p>
						<p class="text-muted-foreground">savings.csv</p>
					</div>
				</Resizable.Sidebar>
				<Resizable.Handle />
				<Resizable.Pane id="editor" minSize={30}>
					<div class="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
						<p>Drag a handle below a sidebar's minimum width to snap it shut.</p>
						<p class="flex items-center gap-2">
							Files <Kbd.Shortcut keys="mod+b" /> Chat <Kbd.Shortcut keys="mod+j" />
						</p>
						<p>Sizes are saved between visits.</p>
					</div>
				</Resizable.Pane>
				<Resizable.Handle />
				<Resizable.Sidebar id="chat" defaultSize={28} minSize={18} maxSize={45} shortcut="mod+j">
					<div class="flex h-full flex-col p-3 text-sm">
						<p class="font-medium">Assistant</p>
						<p class="mt-auto text-muted-foreground">Ask about this deck…</p>
					</div>
				</Resizable.Sidebar>
			</Resizable.PaneGroup>
		</div>
	</Resizable.SidebarProvider>
</Story>

<Story name="Collapses to a strip">
	<div class="h-80 border">
		<Resizable.PaneGroup direction="horizontal">
			<Resizable.Sidebar defaultSize={25} minSize={18} collapsedSize={5}>
				<div class="flex h-full flex-col gap-2 p-2">
					<Resizable.SidebarTrigger />
				</div>
			</Resizable.Sidebar>
			<Resizable.Handle withHandle />
			<Resizable.Pane>
				<div class="flex h-full items-center justify-center text-sm text-muted-foreground">
					The trigger lives inside the sidebar and stays visible when it is collapsed.
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</div>
</Story>
