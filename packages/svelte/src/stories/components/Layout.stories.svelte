<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import { DirectionProvider } from "$lib/components/ui/direction/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";

	const { Story } = defineMeta({ title: "Components/Layout" });

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
</script>

<Story name="Resizable">
	<Resizable.PaneGroup direction="horizontal" class="h-48 w-[32rem] rounded-xl border">
		<Resizable.Pane defaultSize={35} class="flex items-center justify-center text-sm">Accounts</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={65} class="flex items-center justify-center text-sm">Transactions</Resizable.Pane>
	</Resizable.PaneGroup>
</Story>

<Story name="Scroll area and separator">
	<ScrollArea class="h-60 w-56 rounded-xl border">
		<div class="p-4">
			<p class="mb-3 text-sm font-medium">Months</p>
			{#each months as month, i (month)}
				{#if i > 0}<Separator class="my-2" />{/if}
				<p class="text-sm">{month}</p>
			{/each}
		</div>
	</ScrollArea>
</Story>

<Story name="Aspect ratio">
	<div class="w-80">
		<AspectRatio ratio={16 / 9} class="flex items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
			16 / 9
		</AspectRatio>
	</div>
</Story>

<Story name="Carousel">
	<Carousel.Root class="w-64">
		<Carousel.Content>
			{#each ["Groceries", "Transport", "Eating out", "Housing"] as name (name)}
				<Carousel.Item>
					<div class="flex aspect-square items-center justify-center rounded-xl border bg-card font-heading text-xl">
						{name}
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</Story>

<Story name="Direction">
	<p class="mb-3 max-w-80 text-sm text-muted-foreground">
		Custom built: shadcn-svelte has no direction provider yet.
	</p>
	<DirectionProvider dir="rtl">
		<div class="grid w-72 gap-2">
			<Label for="rtl-name">الاسم</Label>
			<Input id="rtl-name" placeholder="اكتب اسمك" />
		</div>
	</DirectionProvider>
</Story>
