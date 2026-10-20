<script lang="ts">
	import type { Token, Tokens } from "marked";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { cn } from "$lib/utils.js";
	import MarkdownBlocks from "./markdown-blocks.svelte";
	import MarkdownCode from "./markdown-code.svelte";
	import MarkdownInline from "./markdown-inline.svelte";

	let { tokens }: { tokens: Token[] } = $props();
</script>

{#each tokens as token, index (index)}
	{#if token.type === "heading"}
		{@const heading = token as Tokens.Heading}
		<svelte:element
			this={`h${heading.depth}`}
			data-slot="markdown-heading"
			class={cn(
				"font-heading font-semibold text-balance not-first:mt-2",
				heading.depth === 1 && "text-xl",
				heading.depth === 2 && "text-lg",
				heading.depth === 3 && "text-base"
			)}
		>
			<MarkdownInline tokens={heading.tokens} />
		</svelte:element>
	{:else if token.type === "paragraph"}
		<p><MarkdownInline tokens={(token as Tokens.Paragraph).tokens} /></p>
	{:else if token.type === "text"}
		{@const text = token as Tokens.Text}
		{#if text.tokens}
			<MarkdownInline tokens={text.tokens} />
		{:else}
			{text.text}
		{/if}
	{:else if token.type === "list"}
		{@const list = token as Tokens.List}
		<svelte:element
			this={list.ordered ? "ol" : "ul"}
			data-slot="markdown-list"
			start={list.ordered && list.start !== 1 && list.start !== "" ? list.start : undefined}
			class={cn(
				"flex flex-col gap-1 ps-5 marker:text-muted-foreground",
				list.ordered ? "list-decimal" : "list-disc",
				list.items.some((item) => item.task) && "ps-0"
			)}
		>
			{#each list.items as item, index (index)}
				<li
					class={cn(
						"ps-1 [&>*+*]:mt-1.5",
						item.loose && "[&>*+*]:mt-3",
						item.task && "list-none ps-0"
					)}
				>
					<MarkdownBlocks tokens={item.tokens} />
				</li>
			{/each}
		</svelte:element>
	{:else if token.type === "checkbox"}
		<input
			type="checkbox"
			checked={(token as Tokens.Checkbox).checked}
			disabled
			class="me-2 size-3.5 translate-y-0.5 accent-primary"
		/>
	{:else if token.type === "blockquote"}
		<blockquote class="flex flex-col gap-3 border-s-2 ps-3 text-muted-foreground">
			<MarkdownBlocks tokens={(token as Tokens.Blockquote).tokens} />
		</blockquote>
	{:else if token.type === "code"}
		{@const code = token as Tokens.Code}
		<MarkdownCode code={code.text} language={code.lang?.split(/\s/)[0] ?? ""} />
	{:else if token.type === "table"}
		{@const table = token as Tokens.Table}
		<Table.Root class="w-auto">
			<Table.Header>
				<Table.Row>
					{#each table.header as cell, index (index)}
						<Table.Head style={cell.align ? `text-align: ${cell.align}` : undefined}>
							<MarkdownInline tokens={cell.tokens} />
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each table.rows as row, index (index)}
					<Table.Row>
						{#each row as cell, index (index)}
							<Table.Cell style={cell.align ? `text-align: ${cell.align}` : undefined}>
								<MarkdownInline tokens={cell.tokens} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else if token.type === "hr"}
		<Separator class="my-1" />
	{:else if token.type === "html"}
		<p>{(token as Tokens.HTML).text}</p>
	{/if}
{/each}
