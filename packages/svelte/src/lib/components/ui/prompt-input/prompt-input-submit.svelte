<script lang="ts">
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import SquareIcon from "@lucide/svelte/icons/square";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { usePromptInput } from "./context.svelte.js";

	// Sends the message, or stops the reply while one is on its way.
	let {
		ref = $bindable(null),
		class: className,
		onclick,
		children,
		...restProps
	}: ComponentProps<typeof InputGroup.Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const prompt = usePromptInput();
</script>

<InputGroup.Button
	bind:ref
	data-slot="prompt-input-submit"
	type={prompt.stoppable ? "button" : "submit"}
	variant="default"
	size="icon-xs"
	aria-label={prompt.stoppable ? "Stop" : "Send"}
	disabled={!prompt.stoppable && !prompt.canSubmit}
	class={cn("ml-auto rounded-full", className)}
	onclick={(e) => {
		onclick?.(e);

		if (prompt.stoppable) {
			prompt.stop();
		}
	}}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else if prompt.stoppable}
		<SquareIcon class="fill-current" />
	{:else}
		<ArrowUpIcon />
	{/if}
</InputGroup.Button>
