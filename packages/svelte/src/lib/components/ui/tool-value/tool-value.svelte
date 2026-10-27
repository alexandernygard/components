<script lang="ts">
	import { Markdown } from "$lib/components/ui/markdown/index.js";
	import { cn } from "$lib/utils.js";
	import DiffView from "./diff-view.svelte";
	import JsonTree from "./json-tree.svelte";
	import KeyValue from "./key-value.svelte";
	import TerminalOutput from "./terminal-output.svelte";
	import ValueCode from "./value-code.svelte";
	import ValueImage from "./value-image.svelte";
	import ValueTable from "./value-table.svelte";
	import ValueText from "./value-text.svelte";
	import {
		detectFormat,
		isPlainObject,
		isTable,
		parseJsonString,
		stringify,
		unwrapContent,
		type ToolValueFormat,
	} from "./utils.js";

	let {
		value,
		format = "auto",
		language,
		title,
		class: className,
	}: {
		value: unknown;
		format?: ToolValueFormat;
		/** For `code`: the language to highlight. */
		language?: string;
		/** For `code` and `diff`: shown in the header, such as a file name. */
		title?: string;
		class?: string;
	} = $props();

	const resolved = $derived.by(() => {
		if (format !== "auto") return { value, format };
		let next = unwrapContent(value);
		if (typeof next === "string") next = parseJsonString(next) ?? next;
		return { value: next, format: detectFormat(next) };
	});
</script>

{#if resolved.format === "keyvalue" && isPlainObject(resolved.value)}
	<KeyValue value={resolved.value} class={className} />
{:else if resolved.format === "table" && isTable(resolved.value)}
	<ValueTable rows={resolved.value} class={className} />
{:else if resolved.format === "code"}
	<ValueCode
		code={stringify(resolved.value)}
		language={language ?? (typeof resolved.value === "string" ? "" : "json")}
		{title}
		class={className}
	/>
{:else if resolved.format === "terminal"}
	<TerminalOutput value={resolved.value} class={className} />
{:else if resolved.format === "markdown"}
	<Markdown class={cn("text-foreground", className)} content={stringify(unwrapContent(resolved.value))} />
{:else if resolved.format === "diff"}
	<DiffView value={resolved.value} {title} class={className} />
{:else if resolved.format === "image"}
	<ValueImage value={resolved.value} class={className} />
{:else if resolved.format === "text"}
	<ValueText value={resolved.value} class={className} />
{:else}
	<JsonTree value={resolved.value} class={className} />
{/if}
