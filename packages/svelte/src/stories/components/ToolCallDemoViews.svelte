<script lang="ts" module>
	type Transaction = { date: string; merchant: string; category: string; amount: number };
	type WebResults = { results: { title: string; url: string }[] };
	type Weather = { tempC: number; summary: string };
</script>

<script lang="ts">
	import type { Snippet } from "svelte";
	import CloudSunIcon from "@lucide/svelte/icons/cloud-sun";
	import DatabaseIcon from "@lucide/svelte/icons/database";
	import FileIcon from "@lucide/svelte/icons/file";
	import FilePenIcon from "@lucide/svelte/icons/file-pen";
	import GlobeIcon from "@lucide/svelte/icons/globe";
	import SearchIcon from "@lucide/svelte/icons/search";
	import TerminalIcon from "@lucide/svelte/icons/terminal";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import {
		ToolViewsProvider,
		defineToolView,
		defineToolViews,
		type ApprovalHandler,
		type ToolCallData,
	} from "$lib/components/ui/tool-views/index.js";

	// The views the Tool call stories share. Story files cannot pass their own
	// snippets to a script, so the custom outputs live here.
	let { onApproval, children }: { onApproval?: ApprovalHandler; children?: Snippet } = $props();

	const views = defineToolViews({
		search_transactions: defineToolView<{ query: string }, Transaction[]>({
			icon: SearchIcon,
			title: (input) => `Searched transactions for "${input?.query}"`,
			runningTitle: "Searching transactions",
			summary: (output) => `${output.length} results`,
			input: false,
			output: { format: "table", label: false },
		}),
		bash: defineToolView<{ command: string }>({
			icon: TerminalIcon,
			title: (input) => `Ran ${input?.command}`,
			runningTitle: (input) => (input ? `Running ${input.command}` : "Running a command"),
			input: false,
			output: { format: "terminal", label: false },
		}),
		edit_file: defineToolView<{ path: string; old_string: string; new_string: string }>({
			icon: FilePenIcon,
			title: (input) => `Edited ${input?.path}`,
			runningTitle: "Editing a file",
			input: { format: "diff", label: false },
			output: false,
		}),
		read_file: defineToolView<{ path: string }, string>({
			icon: FileIcon,
			title: (input) => `Read ${input?.path}`,
			runningTitle: "Reading a file",
			input: false,
			// No language: it comes from the path's extension.
			output: { format: "code", label: false },
		}),
		query_database: defineToolView<{ sql: string }>({
			icon: DatabaseIcon,
			title: "Queried the database",
			input: { format: "code", language: "sql", label: "Query", select: (input) => input.sql },
			output: "auto",
		}),
		web_search: defineToolView<{ query: string }, WebResults>({
			icon: GlobeIcon,
			title: (input) => `Searched the web for ${input?.query}`,
			runningTitle: "Searching the web",
			input: false,
			output: webResults,
		}),
		get_weather: defineToolView<{ city: string }, Weather>({
			icon: CloudSunIcon,
			title: (input) => `Checked the weather in ${input?.city}`,
			runningTitle: (input) => (input ? `Checking the weather in ${input.city}` : "Checking the weather"),
			summary: (output) => `${output.tempC}°C`,
			input: false,
			output: weatherCard,
		}),
	});
</script>

{#snippet webResults(output: WebResults)}
	<div class="flex flex-wrap gap-1.5">
		{#each output.results as r (r.url)}
			<Badge variant="secondary" href={r.url}>{new URL(r.url).hostname}</Badge>
		{/each}
	</div>
{/snippet}

{#snippet weatherCard(output: Weather, call: ToolCallData)}
	<div class="flex w-fit items-center gap-3 rounded-lg border px-3 py-2 text-foreground">
		<CloudSunIcon class="size-6 text-muted-foreground" />
		<div class="flex flex-col">
			<span class="text-lg font-medium tabular-nums">{output.tempC}°C</span>
			<span class="text-xs text-muted-foreground">
				{output.summary} in {(call.input as { city: string }).city}
			</span>
		</div>
	</div>
{/snippet}

<ToolViewsProvider {views} {onApproval}>
	{@render children?.()}
</ToolViewsProvider>
