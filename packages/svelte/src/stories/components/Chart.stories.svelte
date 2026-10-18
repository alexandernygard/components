<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { AreaChart, BarChart } from "layerchart";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Chart from "$lib/components/ui/chart/index.js";

	const { Story } = defineMeta({ title: "Components/Chart" });

	const spending = [
		{ month: "May", groceries: 4200, transport: 900, eatingOut: 1800 },
		{ month: "Jun", groceries: 4500, transport: 1100, eatingOut: 2400 },
		{ month: "Jul", groceries: 3900, transport: 600, eatingOut: 2900 },
		{ month: "Aug", groceries: 4300, transport: 950, eatingOut: 2000 },
		{ month: "Sep", groceries: 4100, transport: 1000, eatingOut: 1600 },
		{ month: "Oct", groceries: 4400, transport: 880, eatingOut: 1450 },
	];
	const spendingConfig = {
		groceries: { label: "Groceries", color: "var(--chart-1)" },
		transport: { label: "Transport", color: "var(--chart-2)" },
		eatingOut: { label: "Eating out", color: "var(--chart-3)" },
	} satisfies Chart.ChartConfig;

	const savings = [
		{ date: new Date(2026, 0, 1), saved: 288000 },
		{ date: new Date(2026, 1, 1), saved: 301000 },
		{ date: new Date(2026, 2, 1), saved: 309500 },
		{ date: new Date(2026, 3, 1), saved: 322000 },
		{ date: new Date(2026, 4, 1), saved: 331500 },
		{ date: new Date(2026, 5, 1), saved: 345000 },
		{ date: new Date(2026, 6, 1), saved: 352000 },
		{ date: new Date(2026, 7, 1), saved: 371500 },
		{ date: new Date(2026, 8, 1), saved: 389000 },
		{ date: new Date(2026, 9, 1), saved: 412000 },
	];
	const savingsConfig = { saved: { label: "Saved", color: "var(--chart-1)" } } satisfies Chart.ChartConfig;
</script>

<Story name="Stacked bars">
	<Card.Root class="w-[36rem]">
		<Card.Header>
			<Card.Title>Spending by category</Card.Title>
			<Card.Description>May to October 2026</Card.Description>
		</Card.Header>
		<Card.Content>
			<Chart.Container config={spendingConfig} class="h-64 w-full">
				<BarChart
					data={spending}
					x="month"
					seriesLayout="stack"
					props={{ bars: { stroke: "none" } }}
					series={Object.entries(spendingConfig).map(([key, c]) => ({ key, label: c.label, color: c.color }))}
				>
					{#snippet tooltip()}
						<Chart.Tooltip />
					{/snippet}
				</BarChart>
			</Chart.Container>
		</Card.Content>
	</Card.Root>
</Story>

<Story name="Area">
	<Card.Root class="w-[36rem]">
		<Card.Header>
			<Card.Title>Flat deposit</Card.Title>
			<Card.Description>Saved so far this year</Card.Description>
		</Card.Header>
		<Card.Content>
			<Chart.Container config={savingsConfig} class="h-56 w-full">
				<AreaChart
					data={savings}
					x="date"
					series={[{ key: "saved", label: "Saved", color: savingsConfig.saved.color }]}
				>
					{#snippet tooltip()}
						<Chart.Tooltip indicator="line" />
					{/snippet}
				</AreaChart>
			</Chart.Container>
		</Card.Content>
	</Card.Root>
</Story>
