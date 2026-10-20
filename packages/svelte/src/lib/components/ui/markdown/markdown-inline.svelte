<script lang="ts">
	import type { Token, Tokens } from "marked";
	import { safeUrl } from "$lib/markdown.js";
	import MarkdownBlocks from "./markdown-blocks.svelte";
	import MarkdownInline from "./markdown-inline.svelte";

	let { tokens }: { tokens: Token[] } = $props();
</script>

{#each tokens as token, index (index)}
	{#if token.type === "strong"}
		<strong class="font-semibold"><MarkdownInline tokens={(token as Tokens.Strong).tokens} /></strong>
	{:else if token.type === "em"}
		<em><MarkdownInline tokens={(token as Tokens.Em).tokens} /></em>
	{:else if token.type === "del"}
		<del><MarkdownInline tokens={(token as Tokens.Del).tokens} /></del>
	{:else if token.type === "codespan"}
		<code class="rounded-sm bg-current/10 px-1 py-0.5 font-mono text-[0.9em]"
			>{(token as Tokens.Codespan).text}</code
		>
	{:else if token.type === "link"}
		{@const link = token as Tokens.Link}
		{@const url = safeUrl(link.href)}
		{#if url}
			{@const external = /^https?:/i.test(url)}
			<a
				href={url}
				title={link.title ?? undefined}
				target={external ? "_blank" : undefined}
				rel={external ? "noreferrer" : undefined}
				class="font-medium underline underline-offset-4"
			>
				<MarkdownInline tokens={link.tokens} />
			</a>
		{:else}
			<MarkdownInline tokens={link.tokens} />
		{/if}
	{:else if token.type === "image"}
		{@const image = token as Tokens.Image}
		{@const url = safeUrl(image.href)}
		{#if url}
			<img
				src={url}
				alt={image.text}
				title={image.title ?? undefined}
				class="inline max-w-full rounded-lg"
			/>
		{:else}
			{image.text}
		{/if}
	{:else if token.type === "br"}
		<br />
	{:else if token.type === "text"}
		{@const text = token as Tokens.Text}
		{#if text.tokens}
			<MarkdownInline tokens={text.tokens} />
		{:else}
			{text.text}
		{/if}
	{:else if token.type === "checkbox"}
		<MarkdownBlocks tokens={[token]} />
	{:else if token.type === "escape" || token.type === "html"}
		{(token as Tokens.Escape | Tokens.Tag).text}
	{/if}
{/each}
