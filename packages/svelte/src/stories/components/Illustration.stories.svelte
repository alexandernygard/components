<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { groups, motifs, type MotifName } from "@alexandernygard/illustrations";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Empty from "$lib/components/ui/empty/index.js";
	import { Illustration } from "$lib/components/ui/illustration/index.js";

	const { Story } = defineMeta({ title: "Components/Illustration", parameters: { layout: "padded" } });

	const names = Object.keys(motifs) as MotifName[];
</script>

<Story name="Default">
	<Illustration motif="sieve" accent="clay" class="w-96" />
</Story>

<Story name="Motifs">
	<div class="flex flex-col gap-8">
		{#each groups as group (group)}
			<section class="flex flex-col gap-3">
				<h3 class="font-heading text-lg capitalize">{group}</h3>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
					{#each names.filter((name) => motifs[name].group === group) as name (name)}
						<figure class="flex flex-col gap-1">
							<Illustration motif={name} accent="clay" seed="stories" class="rounded-lg border" />
							<figcaption class="text-muted-foreground text-sm">{name}</figcaption>
						</figure>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</Story>

<Story name="In an empty state">
	<Empty.Root class="w-[28rem] border">
		<Empty.Header>
			<Empty.Media>
				<Illustration motif="sieve" accent="teal" size="400x260" class="w-64" />
			</Empty.Media>
			<Empty.Title>No listings match yet</Empty.Title>
			<Empty.Description>We'll let you know as soon as one shows up.</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button variant="outline">Edit search</Button>
		</Empty.Content>
	</Empty.Root>
</Story>

<Story name="Hero">
	<section class="bg-background relative overflow-hidden rounded-xl border">
		<Illustration motif="flow" accent="clay" size="1600x600" position="right" class="absolute inset-0" />
		<div class="relative flex min-h-80 max-w-md flex-col justify-center gap-3 p-10">
			<h1 class="font-heading text-4xl">Crate Sync</h1>
			<p class="text-muted-foreground">Your record library, kept in step with your decks.</p>
			<div><Button>Get started</Button></div>
		</div>
	</section>
</Story>

<Story name="Cover (og image)">
	<Illustration
		title="Timeblock"
		tagline="Plan the day in blocks, then let it run itself."
		byline="alexandernygard.com"
		motif="orbit"
		accent="clay"
		size="og"
		theme="paper"
		background="theme"
		texture
		class="max-w-3xl overflow-hidden rounded-xl border"
	/>
</Story>
