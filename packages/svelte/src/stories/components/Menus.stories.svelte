<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import PiggyBankIcon from "@lucide/svelte/icons/piggy-bank";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Menubar from "$lib/components/ui/menubar/index.js";

	const { Story } = defineMeta({ title: "Components/Menus" });
</script>

<script lang="ts">
	let showHidden = $state(false);
</script>

<Story name="Dropdown menu">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={buttonVariants({ variant: "outline" })}>Account</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.Label>Everyday account</DropdownMenu.Label>
				<DropdownMenu.Item>
					<CreditCardIcon /> Cards
					<DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<SettingsIcon /> Settings
					<DropdownMenu.Shortcut>⌘,</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.CheckboxItem bind:checked={showHidden}>Show hidden accounts</DropdownMenu.CheckboxItem>
			<DropdownMenu.Separator />
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>Export</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item>CSV</DropdownMenu.Item>
					<DropdownMenu.Item>PDF statement</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Separator />
			<DropdownMenu.Item variant="destructive">Close account</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Story>

<Story name="Context menu">
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground"
		>
			Right-click a transaction
		</ContextMenu.Trigger>
		<ContextMenu.Content class="w-52">
			<ContextMenu.Item>Recategorise</ContextMenu.Item>
			<ContextMenu.Item>Split</ContextMenu.Item>
			<ContextMenu.Item>Add note</ContextMenu.Item>
			<ContextMenu.Separator />
			<ContextMenu.Item variant="destructive">Hide</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>
</Story>

<Story name="Menubar">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>New budget <Menubar.Shortcut>⌘N</Menubar.Shortcut></Menubar.Item>
				<Menubar.Item>Import CSV</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Print</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>View</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>Month</Menubar.Item>
				<Menubar.Item>Year</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</Story>

<Story name="Command">
	<Command.Root class="w-96 rounded-xl border shadow-md">
		<Command.Input placeholder="Search or jump to…" />
		<Command.List>
			<Command.Empty>No results.</Command.Empty>
			<Command.Group heading="Go to">
				<Command.Item><CalendarIcon /> Calendar</Command.Item>
				<Command.Item><PiggyBankIcon /> Savings goals</Command.Item>
				<Command.Item><CreditCardIcon /> Cards</Command.Item>
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Settings">
				<Command.Item>
					<SettingsIcon /> Preferences
					<Command.Shortcut>⌘,</Command.Shortcut>
				</Command.Item>
			</Command.Group>
		</Command.List>
	</Command.Root>
</Story>
