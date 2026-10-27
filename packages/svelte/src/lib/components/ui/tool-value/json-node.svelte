<script lang="ts">
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import JsonNode from "./json-node.svelte";
	import { formatPrimitive, isPlainObject } from "./utils.js";

	let {
		name,
		value,
		depth,
		expandDepth,
	}: { name?: string; value: unknown; depth: number; expandDepth: number } = $props();

	// svelte-ignore state_referenced_locally
	let open = $state(depth < expandDepth);

	const isArray = $derived(Array.isArray(value));
	const branch = $derived(isArray || isPlainObject(value));
	const entries = $derived(
		Array.isArray(value)
			? value.map((v, i) => [String(i), v] as const)
			: isPlainObject(value)
				? Object.entries(value)
				: []
	);
	const start = $derived(isArray ? "[" : "{");
	const end = $derived(isArray ? "]" : "}");
	const preview = $derived(
		isArray
			? `${entries.length} ${entries.length === 1 ? "item" : "items"}`
			: entries.map(([key]) => key).join(", ")
	);
</script>

{#snippet label()}
	{#if name !== undefined}
		<span data-slot="json-tree-key" class="text-foreground"
			>{name}<span class="text-muted-foreground">: </span></span
		>
	{/if}
{/snippet}

{#if !branch}
	<div data-slot="json-tree-item" class="ps-5 wrap-break-word">
		{@render label()}
		{#if typeof value === "string"}
			<span class="text-positive">"{value}"</span>
		{:else if typeof value === "number" || typeof value === "bigint"}
			<span class="text-info">{String(value)}</span>
		{:else}
			<span class="text-warning">{formatPrimitive(value)}</span>
		{/if}
	</div>
{:else if entries.length === 0}
	<div data-slot="json-tree-item" class="ps-5">
		{@render label()}<span class="text-muted-foreground">{start}{end}</span>
	</div>
{:else}
	<div data-slot="json-tree-item">
		<button
			type="button"
			aria-expanded={open}
			onclick={() => (open = !open)}
			class="group/json-tree flex max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-sm text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
		>
			<ChevronRightIcon
				aria-hidden="true"
				class="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded/json-tree:rotate-90"
			/>
			<span class="min-w-0 truncate">
				{@render label()}<span class="text-muted-foreground"
					>{start}{#if !open}&nbsp;{preview} {end}{/if}</span
				>
			</span>
		</button>
		{#if open}
			<div class="ms-2 border-s ps-1">
				{#each entries as [key, v] (key)}
					<JsonNode
						name={isArray ? undefined : key}
						value={v}
						depth={depth + 1}
						{expandDepth}
					/>
				{/each}
			</div>
			<div class="ps-5 text-muted-foreground">{end}</div>
		{/if}
	</div>
{/if}
