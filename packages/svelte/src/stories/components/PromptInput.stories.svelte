<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Bubble from "$lib/components/ui/bubble/index.js";
	import { Markdown } from "$lib/components/ui/markdown/index.js";
	import * as Message from "$lib/components/ui/message/index.js";
	import * as PromptInput from "$lib/components/ui/prompt-input/index.js";

	const { Story } = defineMeta({ title: "Components/Prompt input", parameters: { layout: "padded" } });

	const answer =
		"You spent **kr 1 600** on eating out in September:\n\n- kr 900 on weekday lunches\n- kr 700 on two dinners\n\nThat's `kr 400` less than August.";
</script>

<script lang="ts">
	let messages = $state<{ role: "user" | "assistant"; text: string }[]>([]);
	let status = $state<PromptInput.PromptInputStatus>("idle");
	let timer: ReturnType<typeof setTimeout> | undefined;

	function stream(length: number) {
		messages[messages.length - 1].text = answer.slice(0, length);
		if (length >= answer.length) {
			status = "idle";
			return;
		}
		timer = setTimeout(() => stream(length + 2), 25);
	}

	function send({ text }: { text: string }) {
		messages.push({ role: "user", text }, { role: "assistant", text: "" });
		status = "submitted";
		timer = setTimeout(() => {
			status = "streaming";
			stream(0);
		}, 600);
	}
</script>

<Story name="Default">
	<div class="max-w-xl">
		<PromptInput.Root accept="image/*,.csv,.pdf" onSubmit={(message) => console.log(message)}>
			<PromptInput.Attachments />
			<PromptInput.Textarea placeholder="Ask anything about your budget" />
			<PromptInput.Footer>
				<PromptInput.AttachButton />
				<PromptInput.Submit />
			</PromptInput.Footer>
		</PromptInput.Root>
		<p class="mt-2 text-xs text-muted-foreground">
			Enter sends, Shift+Enter adds a line. Paste or drop images, CSV or PDF files.
		</p>
	</div>
</Story>

<Story name="With a streaming reply">
	<div class="grid max-w-xl gap-4">
		{#each messages as m, i (i)}
			<Message.Root align={m.role === "user" ? "end" : "start"}>
				<Message.Content>
					<Bubble.Root variant={m.role === "user" ? "default" : "ghost"}>
						<Bubble.Content>
							<Markdown content={m.text} streaming={status === "streaming" && i === messages.length - 1} />
						</Bubble.Content>
					</Bubble.Root>
				</Message.Content>
			</Message.Root>
		{/each}
		<PromptInput.Root
			{status}
			onSubmit={send}
			onStop={() => {
				clearTimeout(timer);
				status = "idle";
			}}
		>
			<PromptInput.Attachments />
			<PromptInput.Textarea placeholder="Ask about eating out" />
			<PromptInput.Footer>
				<PromptInput.AttachButton />
				<PromptInput.Submit />
			</PromptInput.Footer>
		</PromptInput.Root>
	</div>
</Story>
