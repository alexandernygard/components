<script lang="ts">
	import PaperclipIcon from "@lucide/svelte/icons/paperclip";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import type { ComponentProps } from "svelte";
	import { usePromptInput } from "./context.svelte.js";

	let {
		ref = $bindable(null),
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
	data-slot="prompt-input-attach-button"
	size="icon-xs"
	aria-label="Attach files"
	disabled={prompt.disabled}
	onclick={(e) => {
		onclick?.(e);
		prompt.openFilePicker();
	}}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<PaperclipIcon />
	{/if}
</InputGroup.Button>
