<script lang="ts">
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import { isPlainObject, stringify } from "./utils.js";

	let {
		value,
		command,
		class: className,
	}: {
		/** A string, or `{ stdout, stderr, exitCode }`. */
		value: unknown;
		/** Shown above the output, after a `$`. */
		command?: string;
		class?: string;
	} = $props();

	const output = $derived(isPlainObject(value) ? value : { stdout: stringify(value) });
	const stdout = $derived(
		typeof output.stdout === "string" ? output.stdout.replace(/\n$/, "") : ""
	);
	const stderr = $derived(
		typeof output.stderr === "string" ? output.stderr.replace(/\n$/, "") : ""
	);
	const exitCode = $derived(output.exitCode ?? output.exit_code ?? output.code);
	const failed = $derived(typeof exitCode === "number" && exitCode !== 0);
	const text = $derived([stdout, stderr].filter(Boolean).join("\n"));
</script>

<CodeBlock.Root data-tool-value="terminal-output" size="sm" class={className}>
	{#if command}
		<CodeBlock.Header>
			<CodeBlock.Title class="font-mono"
				><span class="text-muted-foreground">$ </span>{command}</CodeBlock.Title
			>
			<CodeBlock.Actions><CodeBlock.CopyButton value={text} /></CodeBlock.Actions>
		</CodeBlock.Header>
	{:else}
		<CodeBlock.Actions><CodeBlock.CopyButton value={text} /></CodeBlock.Actions>
	{/if}
	<CodeBlock.Content wrap class="max-h-80">
		{#if stdout}
			{#each stdout.split("\n") as line, index (index)}
				<CodeBlock.Line code={line} />
			{/each}
		{/if}
		{#if stderr}
			{#each stderr.split("\n") as line, index (index)}
				<CodeBlock.Line class="text-destructive" code={line} />
			{/each}
		{/if}
		{#if !text}
			<CodeBlock.Line class="text-muted-foreground" code="No output" />
		{/if}
	</CodeBlock.Content>
	{#if failed}
		<CodeBlock.Footer class="font-mono text-xs text-destructive">
			Exited with code {String(exitCode)}
		</CodeBlock.Footer>
	{/if}
</CodeBlock.Root>
