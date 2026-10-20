<script lang="ts">
	import { Lexer } from "marked";
	import { completeMarkdown } from "$lib/markdown.js";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import MarkdownBlocks from "./markdown-blocks.svelte";

	// Renders markdown (GFM) as Svelte elements. Raw HTML is shown as text and
	// links with a script URL are dropped, so model output is safe to pass in.
	let {
		ref = $bindable(null),
		class: className,
		content,
		streaming = false,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, "children" | "content">> & {
		/** The markdown to render. */
		content: string;
		/** Set while the text is still arriving, to close half-written syntax. */
		streaming?: boolean;
	} = $props();

	const tokens = $derived(Lexer.lex(streaming ? completeMarkdown(content) : content));
</script>

<div
	bind:this={ref}
	data-slot="markdown"
	class={cn("flex min-w-0 flex-col gap-3 text-sm leading-relaxed wrap-break-word", className)}
	{...restProps}
>
	<MarkdownBlocks {tokens} />
</div>
