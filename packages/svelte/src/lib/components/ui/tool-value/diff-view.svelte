<script lang="ts">
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import { cn } from "$lib/utils.js";
	import { diffLines, diffSides, isPlainObject, parsePatch, stringify } from "./utils.js";

	let {
		value,
		title,
		class: className,
	}: {
		/** A unified diff, or an object with `before` and `after` (or `old_string` and `new_string`). */
		value: unknown;
		title?: string;
		class?: string;
	} = $props();

	const lines = $derived.by(() => {
		const sides = diffSides(value);
		return sides ? diffLines(...sides) : parsePatch(stringify(value));
	});
	const added = $derived(lines.filter((line) => line.kind === "added").length);
	const removed = $derived(lines.filter((line) => line.kind === "removed").length);
	const path = $derived(
		title ??
			(isPlainObject(value)
				? ((value.path ?? value.file_path ?? value.filename) as string | undefined)
				: undefined)
	);
</script>

<CodeBlock.Root data-tool-value="diff-view" size="sm" class={className}>
	<CodeBlock.Header>
		{#if path}
			<CodeBlock.Title class="font-mono">{path}</CodeBlock.Title>
		{/if}
		<span class="font-mono text-xs tabular-nums">
			<span class="text-positive">+{added}</span>
			<span class="text-destructive">−{removed}</span>
		</span>
	</CodeBlock.Header>
	<CodeBlock.Content class="max-h-80">
		{#each lines as line, index (index)}
			<CodeBlock.Line
				variant={line.kind === "added" ? "added" : line.kind === "removed" ? "removed" : "default"}
				class={cn(
					line.kind === "added" && "bg-positive/10 after:text-positive",
					line.kind === "hunk" && "text-muted-foreground"
				)}
				code={line.text}
			/>
		{/each}
	</CodeBlock.Content>
</CodeBlock.Root>
