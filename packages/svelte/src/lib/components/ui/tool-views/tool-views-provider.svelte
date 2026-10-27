<script lang="ts">
	import type { Snippet } from "svelte";
	import {
		getToolViews,
		setToolViews,
		type ApprovalHandler,
		type ToolView,
		type ToolViews,
	} from "./types.js";

	let {
		views,
		fallback,
		onApproval,
		children,
	}: {
		views: ToolViews;
		/** Used for tools that have no view. */
		fallback?: ToolView;
		/** Called when the user allows or denies a call that needs approval. */
		onApproval?: ApprovalHandler;
		children?: Snippet;
	} = $props();

	const parent = getToolViews();

	setToolViews(() => {
		const outer = parent();
		return {
			views: { ...outer.views, ...views },
			fallback: fallback ?? outer.fallback,
			onApproval: onApproval ?? outer.onApproval,
		};
	});
</script>

{@render children?.()}
