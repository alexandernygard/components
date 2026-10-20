<script lang="ts">
	import * as Attachment from "$lib/components/ui/attachment/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { usePromptInput } from "./context.svelte.js";
	import PromptInputAttachment from "./prompt-input-attachment.svelte";

	// The attached files, as chips with a remove button. Renders nothing when
	// there are none.
	let {
		class: className,
		...restProps
	}: Omit<ComponentProps<typeof Attachment.Group>, "children"> = $props();

	const prompt = usePromptInput();
</script>

{#if prompt.files.length}
	<InputGroup.Addon align="block-start" class="cursor-default">
		<Attachment.Group
			data-slot="prompt-input-attachments"
			class={cn("w-full", className)}
			{...restProps}
		>
			{#each prompt.files as file, index (`${file.name}-${file.lastModified}-${index}`)}
				<PromptInputAttachment {file} />
			{/each}
		</Attachment.Group>
	</InputGroup.Addon>
{/if}
