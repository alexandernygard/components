<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import InfoIcon from "@lucide/svelte/icons/info";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import * as HoverCard from "$lib/components/ui/hover-card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	const { Story } = defineMeta({ title: "Components/Overlays" });
</script>

<Story name="Dialog">
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Edit budget</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Edit October budget</Dialog.Title>
				<Dialog.Description>Changes apply from today. Past transactions keep their category.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="limit">Monthly limit</Label>
					<Input id="limit" value="kr 12 000" />
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
				<Button>Save</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</Story>

<Story name="Alert dialog">
	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>Delete goal</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Delete "Flat deposit"?</AlertDialog.Title>
				<AlertDialog.Description>
					The kr 412 000 you've saved stays in your account. Only the goal and its history go.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Keep it</AlertDialog.Cancel>
				<AlertDialog.Action>Delete goal</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Story>

<Story name="Sheet">
	<Sheet.Root>
		<Sheet.Trigger class={buttonVariants({ variant: "outline" })}>Open filters</Sheet.Trigger>
		<Sheet.Content>
			<Sheet.Header>
				<Sheet.Title>Filters</Sheet.Title>
				<Sheet.Description>Narrow down the transactions list.</Sheet.Description>
			</Sheet.Header>
			<div class="grid gap-2 px-4">
				<Label for="sheet-search">Merchant</Label>
				<Input id="sheet-search" placeholder="Rema 1000" />
			</div>
			<Sheet.Footer>
				<Button>Apply</Button>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</Story>

<Story name="Drawer">
	<Drawer.Root>
		<Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Quick add</Drawer.Trigger>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title>Add an expense</Drawer.Title>
					<Drawer.Description>Logged to today's date.</Drawer.Description>
				</Drawer.Header>
				<div class="px-4">
					<Input aria-label="Amount" placeholder="kr 0" />
				</div>
				<Drawer.Footer>
					<Button>Add</Button>
					<Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
</Story>

<Story name="Popover">
	<Popover.Root>
		<Popover.Trigger class={buttonVariants({ variant: "outline" })}>Split bill</Popover.Trigger>
		<Popover.Content class="w-72">
			<div class="grid gap-3">
				<p class="text-sm font-medium">Split kr 1 240 at Mathallen</p>
				<div class="grid gap-2">
					<Label for="people">People</Label>
					<Input id="people" type="number" value="3" />
				</div>
				<p class="text-sm text-muted-foreground">kr 413 each</p>
			</div>
		</Popover.Content>
	</Popover.Root>
</Story>

<Story name="Hover card">
	<HoverCard.Root>
		<HoverCard.Trigger class="text-sm underline underline-offset-4">@alexandernygard</HoverCard.Trigger>
		<HoverCard.Content class="w-72">
			<div class="flex gap-3">
				<Avatar.Root>
					<Avatar.Fallback>AN</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid gap-1">
					<p class="text-sm font-medium">Alexander Nygård</p>
					<p class="text-sm text-muted-foreground">Builds lommebok, nyggis and this component library.</p>
				</div>
			</div>
		</HoverCard.Content>
	</HoverCard.Root>
</Story>

<Story name="Tooltip">
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="About the buffer">
				<InfoIcon />
			</Tooltip.Trigger>
			<Tooltip.Content>Three months of fixed costs</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</Story>
