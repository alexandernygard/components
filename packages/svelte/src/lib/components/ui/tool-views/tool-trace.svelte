<script lang="ts">
	import * as Trace from "$lib/components/ui/trace/index.js";
	import type { ComponentProps } from "svelte";
	import ToolCallView from "./tool-call-view.svelte";
	import type { ApprovalHandler, ToolCallData } from "./types.js";

	let {
		ref = $bindable(null),
		tools,
		onApproval,
		...restProps
	}: Omit<ComponentProps<typeof Trace.Root>, "children"> & {
		tools: ToolCallData[];
		onApproval?: ApprovalHandler;
	} = $props();
</script>

<Trace.Root bind:ref data-slot="tool-trace" {...restProps}>
	{#each tools as call (call.toolCallId)}
		<ToolCallView {call} {onApproval} />
	{/each}
</Trace.Root>
