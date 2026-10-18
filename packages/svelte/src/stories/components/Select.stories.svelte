<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Combobox from "$lib/components/ui/combobox/index.js";
	import * as Select from "$lib/components/ui/select/index.js";

	const { Story } = defineMeta({ title: "Components/Select and combobox" });

	const categories = [
		{ value: "groceries", label: "Groceries" },
		{ value: "transport", label: "Transport" },
		{ value: "eating-out", label: "Eating out" },
		{ value: "housing", label: "Housing" },
		{ value: "subscriptions", label: "Subscriptions" },
	];

	const cities = ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø", "Kristiansand", "Drammen", "Bodø"];
</script>

<script lang="ts">
	let category = $state("groceries");
	const categoryLabel = $derived(categories.find((c) => c.value === category)?.label ?? "Pick a category");

	let search = $state("");
	const matches = $derived(cities.filter((c) => c.toLowerCase().includes(search.toLowerCase())));
</script>

<Story name="Select">
	<Select.Root type="single" bind:value={category}>
		<Select.Trigger class="w-56" aria-label="Category">{categoryLabel}</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Categories</Select.Label>
				{#each categories as c (c.value)}
					<Select.Item value={c.value} label={c.label} />
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</Story>

<Story name="Combobox">
	<p class="mb-3 max-w-72 text-sm text-muted-foreground">
		Custom built: shadcn-svelte has no combobox yet. Bits UI leaves filtering to the app.
	</p>
	<Combobox.Root type="single" onOpenChange={(open) => !open && (search = "")}>
		<Combobox.Input
			class="w-64"
			placeholder="Search for a city"
			aria-label="City"
			oninput={(e) => (search = e.currentTarget.value)}
		/>
		<Combobox.Content>
			{#each matches as city (city)}
				<Combobox.Item value={city} label={city} />
			{:else}
				<Combobox.Empty>No cities match "{search}".</Combobox.Empty>
			{/each}
		</Combobox.Content>
	</Combobox.Root>
</Story>
