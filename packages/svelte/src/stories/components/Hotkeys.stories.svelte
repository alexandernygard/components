<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Kbd from "$lib/components/ui/kbd/index.js";
	import { useHotkeys } from "$lib/hooks/use-hotkeys.svelte.js";

	const { Story } = defineMeta({ title: "Components/Hotkeys", parameters: { layout: "padded" } });
</script>

<script lang="ts">
	let log = $state<string[]>([]);
	const add = (entry: string) => (log = [entry, ...log].slice(0, 5));

	useHotkeys(["mod+z", "mod+shift+z"], (_, hotkey) => add(hotkey === "mod+z" ? "Undo" : "Redo"));
	useHotkeys("shift+?", () => add("Show shortcuts"));
</script>

<Story name="useHotkeys">
	<div class="grid max-w-sm gap-4">
		<div class="grid gap-2 text-sm">
			<p class="flex items-center justify-between">Undo <Kbd.Shortcut keys="mod+z" /></p>
			<p class="flex items-center justify-between">Redo <Kbd.Shortcut keys="mod+shift+z" /></p>
			<p class="flex items-center justify-between">Shortcuts <Kbd.Shortcut keys="shift+?" /></p>
		</div>
		<Input placeholder="Typing here doesn't trigger them" />
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Open a dialog</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Shortcuts are paused in dialogs</Dialog.Title>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>
		<ul class="min-h-24 text-sm text-muted-foreground" data-testid="log">
			{#each log as entry, i (i)}
				<li>{entry}</li>
			{/each}
		</ul>
	</div>
</Story>

<Story name="In a menu">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Edit</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-48">
			<DropdownMenu.Item>
				Undo
				<DropdownMenu.Shortcut><Kbd.Shortcut keys="mod+z" /></DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				Find
				<DropdownMenu.Shortcut><Kbd.Shortcut keys="mod+f" /></DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Story>
