<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { formatPrimitive, isPrimitive, type PlainObject } from "./utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLDListElement>, "children">> & {
		value: PlainObject;
	} = $props();
</script>

<dl
	bind:this={ref}
	data-slot="key-value"
	class={cn(
		"grid min-w-0 grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm",
		className
	)}
	{...restProps}
>
	{#each Object.entries(value) as [key, v] (key)}
		<dt class="truncate text-muted-foreground">{key}</dt>
		<dd class="min-w-0 wrap-break-word text-foreground">
			{#if isPrimitive(v)}
				<span class={cn(typeof v !== "string" && "tabular-nums")}>{formatPrimitive(v)}</span>
			{:else}
				<span class="font-mono text-xs text-muted-foreground">{JSON.stringify(v)}</span>
			{/if}
		</dd>
	{/each}
</dl>
