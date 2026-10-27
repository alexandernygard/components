<script lang="ts">
	import * as Trace from "$lib/components/ui/trace/index.js";
	import type { ComponentProps } from "svelte";
	import { traceStatus, type ToolCallStatus } from "./context.js";

	// A tool call with nothing to expand. Put it straight in a Trace.
	let {
		ref = $bindable(null),
		status,
		...restProps
	}: Omit<ComponentProps<typeof Trace.Line>, "status"> & { status?: ToolCallStatus } = $props();
</script>

<Trace.Line bind:ref data-tool-status={status} status={traceStatus(status)} {...restProps} />
