<script lang="ts">
	import FileIcon from "@lucide/svelte/icons/file";
	import XIcon from "@lucide/svelte/icons/x";
	import * as Attachment from "$lib/components/ui/attachment/index.js";
	import { usePromptInput } from "./context.svelte.js";

	let { file }: { file: File } = $props();

	const prompt = usePromptInput();
	let preview = $state<string>();

	$effect(() => {
		if (!file.type.startsWith("image/")) {
			preview = undefined;
			return;
		}

		const url = URL.createObjectURL(file);
		preview = url;

		return () => URL.revokeObjectURL(url);
	});

	function formatSize(bytes: number) {
		if (bytes < 1024) {
			return `${bytes} B`;
		}

		if (bytes < 1024 * 1024) {
			return `${Math.round(bytes / 1024)} KB`;
		}

		return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	}
</script>

<Attachment.Root size="sm" data-slot="prompt-input-attachment">
	<Attachment.Media variant={preview ? "image" : "icon"}>
		{#if preview}
			<img src={preview} alt="" />
		{:else}
			<FileIcon />
		{/if}
	</Attachment.Media>
	<Attachment.Content>
		<Attachment.Title>{file.name}</Attachment.Title>
		<Attachment.Description>{formatSize(file.size)}</Attachment.Description>
	</Attachment.Content>
	<Attachment.Actions>
		<Attachment.Action aria-label="Remove {file.name}" onclick={() => prompt.removeFile(file)}>
			<XIcon />
		</Attachment.Action>
	</Attachment.Actions>
</Attachment.Root>
