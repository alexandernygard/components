<script lang="ts">
	import * as Trace from "$lib/components/ui/trace/index.js";
	import type { ComponentProps } from "svelte";
	import { getToolCallStatus } from "./context.js";
	import ToolCallLine from "./tool-call-line.svelte";

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: ComponentProps<typeof Trace.CollapsibleTrigger> = $props();

	const status = getToolCallStatus();
</script>

<Trace.CollapsibleTrigger bind:ref data-slot="tool-call-trigger" {...restProps}>
	<ToolCallLine status={status()}>{@render children?.()}</ToolCallLine>
</Trace.CollapsibleTrigger>
