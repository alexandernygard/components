<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import BoldIcon from "@lucide/svelte/icons/bold";
	import ItalicIcon from "@lucide/svelte/icons/italic";
	import UnderlineIcon from "@lucide/svelte/icons/underline";
	import SearchIcon from "@lucide/svelte/icons/search";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

	const { Story } = defineMeta({ title: "Components/Toggle and groups" });
</script>

<Story name="Toggle">
	<div class="flex gap-2">
		<Toggle aria-label="Bold" pressed><BoldIcon /></Toggle>
		<Toggle aria-label="Italic"><ItalicIcon /></Toggle>
		<Toggle variant="outline" aria-label="Underline"><UnderlineIcon /></Toggle>
	</div>
</Story>

<Story name="Toggle group">
	<div class="grid gap-4">
		<ToggleGroup.Root type="single" value="month" variant="outline">
			<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
			<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
			<ToggleGroup.Item value="year">Year</ToggleGroup.Item>
		</ToggleGroup.Root>
		<ToggleGroup.Root type="multiple" value={["bold"]}>
			<ToggleGroup.Item value="bold" aria-label="Bold"><BoldIcon /></ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroup.Item>
			<ToggleGroup.Item value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>
</Story>

<Story name="Button group">
	<ButtonGroup.Root>
		<Button variant="outline">Export</Button>
		<ButtonGroup.Separator />
		<Button variant="outline" size="icon" aria-label="More export options"><ChevronDownIcon /></Button>
	</ButtonGroup.Root>
</Story>

<Story name="Input group">
	<div class="grid w-80 gap-3">
		<InputGroup.Root>
			<InputGroup.Addon><SearchIcon /></InputGroup.Addon>
			<InputGroup.Input placeholder="Search transactions" />
		</InputGroup.Root>
		<InputGroup.Root>
			<InputGroup.Addon><InputGroup.Text>kr</InputGroup.Text></InputGroup.Addon>
			<InputGroup.Input inputmode="decimal" placeholder="0" />
			<InputGroup.Addon align="inline-end"><InputGroup.Button>Add</InputGroup.Button></InputGroup.Addon>
		</InputGroup.Root>
	</div>
</Story>
