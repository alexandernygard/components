<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import TerminalIcon from "@lucide/svelte/icons/terminal";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as ToolCall from "$lib/components/ui/tool-call/index.js";
	import {
		DiffView,
		JsonTree,
		KeyValue,
		TerminalOutput,
		ToolValue,
		ValueTable,
	} from "$lib/components/ui/tool-value/index.js";
	import {
		ToolTrace,
		type ToolCallData,
	} from "$lib/components/ui/tool-views/index.js";
	import * as Trace from "$lib/components/ui/trace/index.js";
	import ToolCallDemoViews from "./ToolCallDemoViews.svelte";

	const { Story } = defineMeta({ title: "Components/Tool call" });


	const transactions = [
		{ date: "2026-10-02", merchant: "Mathallen Oslo", category: "Groceries", amount: -412.5 },
		{ date: "2026-10-09", merchant: "Mathallen Oslo", category: "Groceries", amount: -238 },
		{ date: "2026-10-16", merchant: "Mathallen Oslo", category: "Eating out", amount: -689 },
		{ date: "2026-10-23", merchant: "Mathallen Oslo", category: "Groceries", amount: -301.9 },
	];

	const calls: ToolCallData[] = [
		{
			toolCallId: "1",
			toolName: "search_transactions",
			state: "output-available",
			input: { query: "Mathallen" },
			output: transactions,
		},
		{
			toolCallId: "2",
			toolName: "bash",
			state: "output-available",
			input: { command: "pnpm typecheck" },
			output: { stdout: "$ tsc --noEmit\nDone in 4.2s", exitCode: 0 },
			durationMs: 4200,
		},
		{
			toolCallId: "3",
			toolName: "edit_file",
			state: "output-available",
			input: {
				path: "src/shared/finance/model.ts",
				old_string: "const DEPOSIT = 0.15\nconst RATE = 0.051\nconst YEARS = 30",
				new_string: "const DEPOSIT = 0.15\nconst RATE = 0.049\nconst YEARS = 25",
			},
			output: { ok: true },
		},
		{
			toolCallId: "3b",
			toolName: "read_file",
			state: "output-available",
			input: { path: "src/shared/finance/model.ts" },
			output:
				"export const DEPOSIT = 0.15\n\nexport function monthlyCost(price: number, rate: number) {\n  return (price * (1 - DEPOSIT) * rate) / 12\n}\n",
		},
		{
			toolCallId: "4",
			toolName: "query_database",
			state: "output-available",
			input: {
				sql: "select category, sum(amount) as total\nfrom transactions\nwhere month = '2026-10'\ngroup by category",
			},
			output: [
				{ category: "Groceries", total: -4120 },
				{ category: "Eating out", total: -2890 },
				{ category: "Transport", total: -899 },
			],
		},
		{
			toolCallId: "5",
			toolName: "web_search",
			state: "output-available",
			input: { query: "Oslo rent index 2026" },
			output: {
				results: [
					{ title: "Rent index", url: "https://www.ssb.no/rent-index" },
					{ title: "Market", url: "https://www.obos.no/market" },
				],
			},
		},
		{
			toolCallId: "6",
			toolName: "get_weather",
			state: "output-available",
			input: { city: "Oslo" },
			output: { tempC: 4, summary: "Partly cloudy" },
		},
	];
</script>

<script lang="ts">

	let approved = $state<boolean | null>(null);

	const deploy = $derived<ToolCallData>(
		approved === null
			? {
					toolCallId: "d",
					toolName: "bash",
					state: "awaiting-approval",
					input: { command: "wrangler deploy" },
					approval: { reason: "This deploys the budget app to production." },
				}
			: approved
				? { toolCallId: "d", toolName: "bash", state: "running", input: { command: "wrangler deploy" } }
				: {
						toolCallId: "d",
						toolName: "bash",
						state: "denied",
						input: { command: "wrangler deploy" },
						approval: { approved: false, message: "Not before the review is done." },
					}
	);
</script>

<Story name="Renderer registry">
	<ToolCallDemoViews>
		<ToolTrace tools={calls} class="max-w-xl" />
	</ToolCallDemoViews>
</Story>

<Story name="Statuses">
	<ToolCallDemoViews onApproval={(_, ok) => (approved = ok)}>
		<ToolTrace
			class="max-w-xl"
			tools={[
				{
					toolCallId: "a",
					toolName: "search_transactions",
					state: "input-streaming",
					inputText: '{"query": "Mathal',
				},
				{ toolCallId: "b", toolName: "get_weather", state: "running", input: { city: "Bergen" } },
				deploy,
				{
					toolCallId: "e",
					toolName: "bash",
					state: "output-error",
					input: { command: "wrangler deploy" },
					error: "Not logged in. Run wrangler login first.",
				},
				{
					toolCallId: "f",
					toolName: "list_budgets",
					state: "output-available",
					input: {},
					output: {
						content: [{ type: "text", text: '{"budgets": 3, "overspent": ["Eating out"]}' }],
					},
				},
			]}
		/>
		{#if approved !== null}
			<Button variant="link" size="sm" class="mt-4 px-0" onclick={() => (approved = null)}>
				Reset
			</Button>
		{/if}
	</ToolCallDemoViews>
</Story>

<Story name="Nested calls">
	<ToolCallDemoViews>
		<ToolTrace
			class="max-w-xl"
			tools={[
				{
					toolCallId: "run",
					toolName: "run_code",
					title: "Ran code",
					state: "output-available",
					input: {},
					output: "Average grocery trip: kr 317",
					children: [calls[0], calls[3]],
				},
			]}
		/>
	</ToolCallDemoViews>
</Story>

<Story name="Without views">
	<ToolTrace class="max-w-xl" tools={calls.map((call) => ({ ...call, durationMs: call.durationMs ?? 380 }))} />
</Story>

<Story name="Value viewers">
	<div class="grid max-w-xl gap-6">
		<div class="flex flex-col gap-2">
			<span class="font-mono text-xs text-muted-foreground">JsonTree</span>
			<JsonTree
				value={{
					plan: "savings",
					monthly: 9500,
					target: { amount: 630000, reached: "2028-05" },
					accounts: [
						{ name: "BSU", balance: 312000 },
						{ name: "Buffer", balance: 100000 },
					],
					fixedRate: false,
					note: null,
				}}
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-mono text-xs text-muted-foreground">KeyValue</span>
			<KeyValue value={{ city: "Oslo", price: 4200000, deposit: 0.15, years: 30 }} />
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-mono text-xs text-muted-foreground">ValueTable</span>
			<ValueTable rows={transactions} />
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-mono text-xs text-muted-foreground">DiffView</span>
			<DiffView
				title="model.ts"
				value={"@@ -1,3 +1,3 @@\n const DEPOSIT = 0.15\n-const RATE = 0.051\n+const RATE = 0.049\n const YEARS = 30"}
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-mono text-xs text-muted-foreground">TerminalOutput</span>
			<TerminalOutput
				command="pnpm test"
				value={{
					stdout: "✓ savings.test.ts (12)\n✗ mortgage.test.ts (1 failed)",
					stderr: "Expected 19400, got 19150",
					exitCode: 1,
				}}
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-mono text-xs text-muted-foreground">ToolValue format="code"</span>
			<ToolValue format="code" language="sql" value={"select * from budgets\nwhere overspent"} />
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-mono text-xs text-muted-foreground">ToolValue format="markdown"</span>
			<ToolValue
				format="markdown"
				value={"**3 budgets**, one over:\n\n- Eating out: kr 2 890 of kr 2 500\n\n```\n2890 - 2500 = 390 over\n```"}
			/>
		</div>
	</div>
</Story>

<Story name="Composed by hand">
	<div class="max-w-xl">
		<ToolCall.Root status="awaiting-approval" open>
			<ToolCall.Trigger>
				<Trace.Icon><TerminalIcon /></Trace.Icon>
				<Trace.Title>Run rm -rf dist</Trace.Title>
				<Trace.Description class="text-warning">Needs approval</Trace.Description>
			</ToolCall.Trigger>
			<ToolCall.Approval>
				<p>This deletes the build folder.</p>
				<ToolCall.ApprovalActions>
					<Button size="sm">Allow</Button>
					<Button size="sm" variant="outline">Deny</Button>
				</ToolCall.ApprovalActions>
			</ToolCall.Approval>
			<ToolCall.Content>
				<ToolCall.Section>
					<ToolCall.SectionLabel>Input</ToolCall.SectionLabel>
					<ToolValue value={{ command: "rm -rf dist", cwd: "~/budget" }} />
				</ToolCall.Section>
			</ToolCall.Content>
		</ToolCall.Root>
	</div>
</Story>
