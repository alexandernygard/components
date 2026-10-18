<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import * as Bubble from "$lib/components/ui/bubble/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Message from "$lib/components/ui/message/index.js";
	import * as MessageScroller from "$lib/components/ui/message-scroller/index.js";

	const { Story } = defineMeta({ title: "Patterns/Assistant" });

	type Chat = { id: string; role: "user" | "assistant"; text: string };
	const replies = [
		"You spent kr 1 600 on eating out in September.",
		"That's kr 400 less than August, mostly fewer weekday lunches.",
		"Want me to set October's limit to kr 1 500?",
	];
</script>

<script lang="ts">
	let messages = $state<Chat[]>([
		{ id: "1", role: "user", text: "How am I doing on eating out?" },
		{ id: "2", role: "assistant", text: replies[0] },
		{ id: "3", role: "assistant", text: replies[1] },
	]);
	let draft = $state("");

	function send(e: SubmitEvent) {
		e.preventDefault();
		if (!draft.trim()) return;
		const n = messages.length;
		messages.push({ id: String(n + 1), role: "user", text: draft });
		messages.push({ id: String(n + 2), role: "assistant", text: replies[n % replies.length] });
		draft = "";
	}
</script>

<Story name="Chat">
	<Card.Root class="h-[32rem] w-[28rem] gap-0 overflow-hidden py-0">
		<MessageScroller.Provider>
			<MessageScroller.Root>
				<MessageScroller.Viewport>
					<MessageScroller.Content class="gap-4 p-4">
						{#each messages as m (m.id)}
							<MessageScroller.Item messageId={m.id} scrollAnchor={m.role === "user"}>
								<Message.Root align={m.role === "user" ? "end" : "start"}>
									<Message.Content>
										<Bubble.Root variant={m.role === "user" ? "default" : "muted"}>
											<Bubble.Content>{m.text}</Bubble.Content>
										</Bubble.Root>
									</Message.Content>
								</Message.Root>
							</MessageScroller.Item>
						{/each}
					</MessageScroller.Content>
				</MessageScroller.Viewport>
				<MessageScroller.Button />
			</MessageScroller.Root>
		</MessageScroller.Provider>
		<form class="border-t p-3" onsubmit={send}>
			<InputGroup.Root>
				<InputGroup.Input bind:value={draft} placeholder="Ask about your money" aria-label="Message" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button type="submit" size="icon-xs" variant="default" aria-label="Send"><ArrowUpIcon /></InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</form>
	</Card.Root>
</Story>
