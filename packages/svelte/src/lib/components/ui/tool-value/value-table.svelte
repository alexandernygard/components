<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import { cn } from "$lib/utils.js";
	import { formatPrimitive, type PlainObject } from "./utils.js";

	let {
		rows,
		columns,
		maxRows = 50,
		class: className,
	}: {
		rows: PlainObject[];
		/** Defaults to every key that appears in a row. */
		columns?: string[];
		maxRows?: number;
		class?: string;
	} = $props();

	const keys = $derived(columns ?? [...new Set(rows.flatMap((row) => Object.keys(row)))]);
	const shown = $derived(rows.slice(0, maxRows));
</script>

<div
	data-slot="value-table"
	class={cn(
		"max-h-80 min-w-0 scrollbar-thin overflow-auto rounded-lg border text-foreground dark:bg-input/30",
		className
	)}
>
	<Table.Root class="text-xs">
		<Table.Header>
			<Table.Row>
				{#each keys as key (key)}
					<Table.Head class="h-8 px-2.5">{key}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each shown as row, index (index)}
				<Table.Row>
					{#each keys as key (key)}
						<Table.Cell
							class={cn("px-2.5 py-1.5", typeof row[key] === "number" && "text-end tabular-nums")}
						>
							{row[key] === undefined ? "" : formatPrimitive(row[key])}
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
	{#if rows.length > shown.length}
		<p class="border-t px-2.5 py-1.5 text-xs text-muted-foreground">
			{rows.length - shown.length} more rows
		</p>
	{/if}
</div>
