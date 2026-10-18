<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import FileSpreadsheetIcon from "@lucide/svelte/icons/file-spreadsheet";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import ImageIcon from "@lucide/svelte/icons/image";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import XIcon from "@lucide/svelte/icons/x";
	import * as Attachment from "$lib/components/ui/attachment/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as Bubble from "$lib/components/ui/bubble/index.js";
	import * as Marker from "$lib/components/ui/marker/index.js";
	import * as Message from "$lib/components/ui/message/index.js";
	import { Spinner } from "$lib/components/ui/spinner/index.js";

	const { Story } = defineMeta({ title: "Components/Chat", parameters: { layout: "padded" } });

	const variants = ["default", "secondary", "muted", "tinted", "outline", "destructive", "ghost"] as const;
	const files = [
		{ icon: FileTextIcon, name: "september-statement.pdf", meta: "PDF, 2.4 MB", state: "done" as const },
		{ icon: FileSpreadsheetIcon, name: "transactions-2026.csv", meta: "Uploading, 64%", state: "uploading" as const },
		{ icon: ImageIcon, name: "receipt.heic", meta: "This file type isn't supported", state: "error" as const },
	];
</script>

<Story name="Conversation">
	<div class="flex max-w-lg flex-col gap-6">
		<Message.Root align="end">
			<Message.Content>
				<Bubble.Root><Bubble.Content>How much did I spend on eating out in September?</Bubble.Content></Bubble.Root>
			</Message.Content>
		</Message.Root>
		<Message.Root>
			<Message.Avatar>
				<Avatar.Root size="sm"><Avatar.Fallback><SparklesIcon class="size-3.5" /></Avatar.Fallback></Avatar.Root>
			</Message.Avatar>
			<Message.Content>
				<Message.Header>Assistant</Message.Header>
				<Bubble.Group>
					<Bubble.Root variant="muted">
						<Bubble.Content>kr 1 600 across 11 purchases. That's kr 400 less than in August.</Bubble.Content>
					</Bubble.Root>
					<Bubble.Root variant="muted">
						<Bubble.Content>The biggest was kr 480 at Mathallen on the 19th.</Bubble.Content>
					</Bubble.Root>
				</Bubble.Group>
				<Message.Footer>2 sources</Message.Footer>
			</Message.Content>
		</Message.Root>
		<Message.Root align="end">
			<Message.Content>
				<Bubble.Root>
					<Bubble.Content>Nice. Set October's limit to kr 1 500.</Bubble.Content>
					<Bubble.Reactions>👍</Bubble.Reactions>
				</Bubble.Root>
			</Message.Content>
		</Message.Root>
		<Marker.Root role="status">
			<Marker.Icon><Spinner /></Marker.Icon>
			<Marker.Content class="shimmer">Updating the budget</Marker.Content>
		</Marker.Root>
	</div>
</Story>

<Story name="Bubble variants">
	<div class="flex max-w-md flex-col gap-4">
		{#each variants as v (v)}
			<Bubble.Root variant={v} align={v === "tinted" ? "end" : "start"}>
				<Bubble.Content><span class="font-medium">{v}</span>: the quick brown fox jumps over the lazy dog.</Bubble.Content>
			</Bubble.Root>
		{/each}
	</div>
</Story>

<Story name="Markers">
	<div class="flex max-w-md flex-col gap-4">
		<Marker.Root><Marker.Content>Today</Marker.Content></Marker.Root>
		<Marker.Root variant="separator"><Marker.Content>Yesterday</Marker.Content></Marker.Root>
		<Marker.Root>
			<Marker.Icon><FileTextIcon /></Marker.Icon>
			<Marker.Content>Read september-statement.pdf</Marker.Content>
		</Marker.Root>
		<Marker.Root role="status"><Marker.Content class="shimmer">Thinking</Marker.Content></Marker.Root>
	</div>
</Story>

<Story name="Attachments">
	<Attachment.Group class="max-w-md flex-col">
		{#each files as f (f.name)}
			<Attachment.Root state={f.state} class="w-full">
				<Attachment.Media><f.icon /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>{f.name}</Attachment.Title>
					<Attachment.Description>{f.meta}</Attachment.Description>
				</Attachment.Content>
				<Attachment.Actions>
					<Attachment.Action aria-label={`Remove ${f.name}`}><XIcon /></Attachment.Action>
				</Attachment.Actions>
			</Attachment.Root>
		{/each}
	</Attachment.Group>
</Story>
