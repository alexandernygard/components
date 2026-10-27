<script lang="ts">
	import * as Trace from "$lib/components/ui/trace/index.js";
	import type { Collapsible as CollapsiblePrimitive } from "bits-ui";
	import { setToolCallStatus, type ToolCallStatus } from "./context.js";

	let {
		ref = $bindable(null),
		open = $bindable(false),
		status,
		...restProps
	}: CollapsiblePrimitive.RootProps & { status?: ToolCallStatus } = $props();

	setToolCallStatus(() => status);
</script>

<Trace.Collapsible bind:ref bind:open data-slot="tool-call" data-status={status} {...restProps} />
