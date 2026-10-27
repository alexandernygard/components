<script lang="ts" module>
	// "search_transactions" → "Search transactions"
	function humanize(name: string) {
		const words = name
			.replace(/^mcp__[^_]+__/, "")
			.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
			.replace(/[_\-.]+/g, " ")
			.trim()
			.toLowerCase();
		return words.charAt(0).toUpperCase() + words.slice(1);
	}

	function isEmpty(value: unknown) {
		return (
			value === undefined ||
			value === null ||
			(typeof value === "object" && Object.keys(value as object).length === 0)
		);
	}

	function formatDuration(ms: number) {
		return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
	}
</script>

<script lang="ts">
	import WrenchIcon from "@lucide/svelte/icons/wrench";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import * as ToolCall from "$lib/components/ui/tool-call/index.js";
	import { ToolValue, languageFromPath, pathOf } from "$lib/components/ui/tool-value/index.js";
	import * as Trace from "$lib/components/ui/trace/index.js";
	import { cn } from "$lib/utils.js";
	import ToolCallView from "./tool-call-view.svelte";
	import {
		getToolViews,
		type ApprovalHandler,
		type ToolCallData,
		type ToolValueRender,
		type ToolView,
	} from "./types.js";

	let {
		call,
		view: viewProp,
		onApproval: onApprovalProp,
		class: className,
	}: {
		call: ToolCallData;
		/** Overrides the view from ToolViewsProvider. */
		view?: ToolView;
		onApproval?: ApprovalHandler;
		class?: string;
	} = $props();

	const context = getToolViews();
	const view = $derived.by(() => {
		const { views, fallback } = context();
		return viewProp ?? views[call.toolName] ?? fallback ?? {};
	});
	const onApproval = $derived(onApprovalProp ?? context().onApproval);
	const status = $derived(call.state);
	const inputReady = $derived(status !== "input-streaming" && call.input !== undefined);
	const done = $derived(status === "output-available");
	// A denied call never ran, so it keeps the running title ("Running …, Denied").
	const finished = $derived(
		status === undefined || status === "output-available" || status === "output-error"
	);

	const title = $derived.by(() => {
		const fallbackTitle = call.title ?? humanize(call.toolName);
		const titleView = !finished && view.runningTitle !== undefined ? view.runningTitle : view.title;
		if (typeof titleView === "function") {
			try {
				return titleView(inputReady ? call.input : undefined, call) ?? fallbackTitle;
			} catch {
				// A title that reads a missing field falls back to the tool name.
				return fallbackTitle;
			}
		}
		return titleView ?? fallbackTitle;
	});

	const description = $derived.by(() => {
		if (status === "denied") return "Denied";
		if (done && view.summary) {
			try {
				return view.summary(call.output, call);
			} catch {
				return undefined;
			}
		}
		if (done && call.durationMs !== undefined) return formatDuration(call.durationMs);
		return undefined;
	});

	type Section = {
		label: string | false;
		value: unknown;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		render: ToolValueRender<any> | undefined;
	} | null;

	function section(value: unknown, render: ToolValueRender<unknown> | undefined, label: string): Section {
		if (render === false) return null;
		if (typeof render === "object" && render.label !== undefined) {
			return { label: render.label, value, render };
		}
		return { label, value, render };
	}

	// A code view without a language highlights by the file the call works on,
	// and shows that file's name.
	function valueProps(value: unknown, render: ToolValueRender<unknown> | undefined) {
		const options =
			typeof render === "object" ? render : { format: typeof render === "string" ? render : undefined };
		const language = "language" in options ? options.language : undefined;
		const path = options.format === "code" && language === undefined ? pathOf(call.input) : undefined;
		return {
			value: "select" in options && options.select ? options.select(value) : value,
			format: options.format,
			language:
				typeof language === "function" ? language(value, call) : (language ?? languageFromPath(path)),
			title: path,
		};
	}

	const streamingInput = $derived(
		status === "input-streaming" && call.inputText && view.input !== false
			? call.inputText
			: undefined
	);
	const input = $derived(
		!streamingInput && inputReady && !isEmpty(call.input)
			? section(call.input, view.input, "Input")
			: null
	);
	const output = $derived(
		done && call.output !== undefined ? section(call.output, view.output, "Output") : null
	);
	const error = $derived(status === "output-error" ? call.error : undefined);
	const deniedMessage = $derived(status === "denied" ? call.approval?.message : undefined);
	const hasContent = $derived(
		Boolean(streamingInput || input || call.children?.length || error || deniedMessage || output)
	);
	// svelte-ignore state_referenced_locally
	let open = $state(view.defaultOpen ?? false);
</script>

{#snippet value(s: NonNullable<Section>)}
	{@const render = s.render}
	{#if typeof render === "function"}
		{@render render(s.value, call)}
	{:else if typeof render === "object" && render.component}
		{@const Custom = render.component}
		<Custom value={render.select ? render.select(s.value) : s.value} {call} />
	{:else}
		<ToolValue {...valueProps(s.value, render)} />
	{/if}
{/snippet}

{#snippet line()}
	<Trace.Icon>
		{#if view.icon}
			{@const Icon = view.icon}
			<Icon />
		{:else}
			<WrenchIcon />
		{/if}
	</Trace.Icon>
	<Trace.Title>{title}</Trace.Title>
	{#if status === "awaiting-approval"}
		<Trace.Description class="text-warning">Needs approval</Trace.Description>
	{:else if description}
		<Trace.Description>{description}</Trace.Description>
	{/if}
{/snippet}

{#snippet approval()}
	{#if status === "awaiting-approval"}
		<ToolCall.Approval>
			{#if call.approval?.reason}
				<p>{call.approval.reason}</p>
			{/if}
			{#if onApproval}
				<ToolCall.ApprovalActions>
					<Button size="sm" onclick={() => onApproval(call, true)}>Allow</Button>
					<Button size="sm" variant="outline" onclick={() => onApproval(call, false)}>Deny</Button>
				</ToolCall.ApprovalActions>
			{/if}
		</ToolCall.Approval>
	{/if}
{/snippet}

{#if !hasContent}
	<div data-slot="tool-call-view" class={cn("flex min-w-0 flex-col", className)}>
		<ToolCall.Line {status}>{@render line()}</ToolCall.Line>
		{@render approval()}
	</div>
{:else}
	<ToolCall.Root data-slot="tool-call-view" {status} bind:open class={className}>
		<ToolCall.Trigger>{@render line()}</ToolCall.Trigger>
		{@render approval()}
		<ToolCall.Content>
			{#if streamingInput}
				<ToolCall.Section>
					<ToolCall.SectionLabel>Input</ToolCall.SectionLabel>
					<CodeBlock.Root size="sm">
						<CodeBlock.Content wrap class="max-h-40 text-muted-foreground" code={streamingInput} />
					</CodeBlock.Root>
				</ToolCall.Section>
			{:else if input}
				<ToolCall.Section>
					{#if input.label !== false}
						<ToolCall.SectionLabel>{input.label}</ToolCall.SectionLabel>
					{/if}
					{@render value(input)}
				</ToolCall.Section>
			{/if}
			{#if call.children?.length}
				<ToolCall.Section>
					<ToolCall.SectionLabel>Calls</ToolCall.SectionLabel>
					<Trace.Root>
						{#each call.children as child (child.toolCallId)}
							<ToolCallView call={child} onApproval={onApprovalProp} />
						{/each}
					</Trace.Root>
				</ToolCall.Section>
			{/if}
			{#if error}
				<ToolCall.Section>
					<ToolCall.SectionLabel>Error</ToolCall.SectionLabel>
					<CodeBlock.Root size="sm" variant="destructive">
						<CodeBlock.Content wrap class="max-h-80" code={error} />
					</CodeBlock.Root>
				</ToolCall.Section>
			{:else if deniedMessage}
				<ToolCall.Section>
					<ToolCall.SectionLabel>Reason</ToolCall.SectionLabel>
					<p class="text-sm text-foreground">{deniedMessage}</p>
				</ToolCall.Section>
			{:else if output}
				<ToolCall.Section>
					{#if output.label !== false}
						<ToolCall.SectionLabel>{output.label}</ToolCall.SectionLabel>
					{/if}
					{@render value(output)}
				</ToolCall.Section>
			{/if}
		</ToolCall.Content>
	</ToolCall.Root>
{/if}
