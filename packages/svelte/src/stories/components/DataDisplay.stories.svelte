<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { getLocalTimeZone, today } from "@internationalized/date";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import PiggyBankIcon from "@lucide/svelte/icons/piggy-bank";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Item from "$lib/components/ui/item/index.js";
	import * as Kbd from "$lib/components/ui/kbd/index.js";
	import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
	import * as Table from "$lib/components/ui/table/index.js";

	const { Story } = defineMeta({ title: "Components/Data display" });

	const transactions = [
		{ date: "17 Oct", merchant: "Rema 1000", category: "Groceries", amount: -312 },
		{ date: "16 Oct", merchant: "Ruter", category: "Transport", amount: -44 },
		{ date: "15 Oct", merchant: "Salary", category: "Income", amount: 42318.5 },
		{ date: "14 Oct", merchant: "Mathallen", category: "Eating out", amount: -480 },
	];
	const kr = (n: number) =>
		new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK" }).format(n);
</script>

<script lang="ts">
	let date = $state(today(getLocalTimeZone()));
	let range = $state({ start: today(getLocalTimeZone()).subtract({ days: 6 }), end: today(getLocalTimeZone()) });
</script>

<Story name="Card">
	<Card.Root class="w-96">
		<Card.Header>
			<Card.Title>Flat deposit</Card.Title>
			<Card.Description>kr 412 000 of kr 600 000</Card.Description>
			<Card.Action><Badge variant="positive">On track</Badge></Card.Action>
		</Card.Header>
		<Card.Content>
			<p class="text-sm text-muted-foreground">At kr 9 000 a month you'll reach it in March 2028.</p>
		</Card.Content>
		<Card.Footer class="gap-2">
			<Button size="sm">Add money</Button>
			<Button size="sm" variant="outline">Edit goal</Button>
		</Card.Footer>
	</Card.Root>
</Story>

<Story name="Table">
	<Table.Root class="w-[34rem]">
		<Table.Caption>Last four transactions</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Date</Table.Head>
				<Table.Head>Merchant</Table.Head>
				<Table.Head>Category</Table.Head>
				<Table.Head class="text-right">Amount</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each transactions as t (t.merchant)}
				<Table.Row>
					<Table.Cell class="text-muted-foreground">{t.date}</Table.Cell>
					<Table.Cell class="font-medium">{t.merchant}</Table.Cell>
					<Table.Cell>{t.category}</Table.Cell>
					<Table.Cell class={["text-right tabular-nums", t.amount > 0 && "text-positive"]}>{kr(t.amount)}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Story>

<Story name="Avatar">
	<div class="flex items-center gap-3">
		<Avatar.Root size="sm"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
		<Avatar.Root><Avatar.Image src="https://github.com/alexandernygard.png" alt="Alexander" /><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
		<Avatar.Root size="lg"><Avatar.Fallback>KN</Avatar.Fallback></Avatar.Root>
	</div>
</Story>

<Story name="Item">
	<Item.Group class="w-96">
		<Item.Root variant="outline">
			<Item.Media variant="icon"><PiggyBankIcon /></Item.Media>
			<Item.Content>
				<Item.Title>Buffer account</Item.Title>
				<Item.Description>Three months of fixed costs</Item.Description>
			</Item.Content>
			<Item.Actions><ChevronRightIcon class="size-4 text-muted-foreground" /></Item.Actions>
		</Item.Root>
	</Item.Group>
</Story>

<Story name="Kbd">
	<p class="text-sm text-muted-foreground">
		Press <Kbd.Group><Kbd.Root>⌘</Kbd.Root><Kbd.Root>K</Kbd.Root></Kbd.Group> to search.
	</p>
</Story>

<Story name="Calendar">
	<div class="flex flex-wrap gap-6">
		<Calendar type="single" bind:value={date} class="rounded-xl border" />
		<RangeCalendar bind:value={range} class="rounded-xl border" />
	</div>
</Story>
