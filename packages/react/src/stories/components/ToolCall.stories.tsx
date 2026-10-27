import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CloudSunIcon,
  DatabaseIcon,
  FileIcon,
  FilePenIcon,
  GlobeIcon,
  SearchIcon,
  TerminalIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ToolCall,
  ToolCallApproval,
  ToolCallApprovalActions,
  ToolCallContent,
  ToolCallSection,
  ToolCallSectionLabel,
  ToolCallTrigger,
} from "@/components/ui/tool-call"
import {
  DiffView,
  JsonTree,
  KeyValue,
  TerminalOutput,
  ToolValue,
  ValueTable,
} from "@/components/ui/tool-value"
import {
  ToolTrace,
  ToolViewsProvider,
  defineToolView,
  defineToolViews,
  type ToolCallData,
} from "@/components/ui/tool-views"
import { TraceDescription, TraceIcon, TraceTitle } from "@/components/ui/trace"

const meta = {
  title: "Components/Tool call",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const transactions = [
  { date: "2026-10-02", merchant: "Mathallen Oslo", category: "Groceries", amount: -412.5 },
  { date: "2026-10-09", merchant: "Mathallen Oslo", category: "Groceries", amount: -238 },
  { date: "2026-10-16", merchant: "Mathallen Oslo", category: "Eating out", amount: -689 },
  { date: "2026-10-23", merchant: "Mathallen Oslo", category: "Groceries", amount: -301.9 },
]

const views = defineToolViews({
  search_transactions: defineToolView<{ query: string }, typeof transactions>({
    icon: SearchIcon,
    title: (input) => `Searched transactions for "${input?.query}"`,
    runningTitle: "Searching transactions",
    summary: (output) => `${output.length} results`,
    input: false,
    output: { format: "table", label: false },
  }),
  bash: defineToolView<{ command: string }, { stdout: string; stderr?: string; exitCode: number }>({
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
  web_search: defineToolView<{ query: string }, { results: { title: string; url: string }[] }>({
    icon: GlobeIcon,
    title: (input) => `Searched the web for ${input?.query}`,
    runningTitle: "Searching the web",
    input: false,
    output: (output) => (
      <div className="flex flex-wrap gap-1.5">
        {output.results.map((r) => (
          <Badge key={r.url} variant="secondary" asChild>
            <a href={r.url}>{new URL(r.url).hostname}</a>
          </Badge>
        ))}
      </div>
    ),
  }),
  get_weather: defineToolView<{ city: string }, { tempC: number; summary: string }>({
    icon: CloudSunIcon,
    title: (input) => `Checked the weather in ${input?.city}`,
    runningTitle: (input) => (input ? `Checking the weather in ${input.city}` : "Checking the weather"),
    summary: (output) => `${output.tempC}°C`,
    input: false,
    output: (output, call) => (
      <div className="flex w-fit items-center gap-3 rounded-lg border px-3 py-2 text-foreground">
        <CloudSunIcon className="size-6 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-lg font-medium tabular-nums">{output.tempC}°C</span>
          <span className="text-xs text-muted-foreground">
            {output.summary} in {(call.input as { city: string }).city}
          </span>
        </div>
      </div>
    ),
  }),
})

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
    output: "export const DEPOSIT = 0.15\n\nexport function monthlyCost(price: number, rate: number) {\n  return (price * (1 - DEPOSIT) * rate) / 12\n}\n",
  },
  {
    toolCallId: "4",
    toolName: "query_database",
    state: "output-available",
    input: { sql: "select category, sum(amount) as total\nfrom transactions\nwhere month = '2026-10'\ngroup by category" },
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
]

export const Registry: Story = {
  name: "Renderer registry",
  render: () => (
    <ToolViewsProvider views={views}>
      <ToolTrace tools={calls} className="max-w-xl" />
    </ToolViewsProvider>
  ),
}

export const Statuses: Story = {
  render: function Render() {
    const [approved, setApproved] = React.useState<boolean | null>(null)
    const deploy: ToolCallData =
      approved === null
        ? {
            toolCallId: "d",
            toolName: "bash",
            state: "awaiting-approval",
            input: { command: "wrangler deploy" },
            approval: { reason: "This deploys the budget app to production." },
          }
        : approved
          ? {
              toolCallId: "d",
              toolName: "bash",
              state: "running",
              input: { command: "wrangler deploy" },
            }
          : {
              toolCallId: "d",
              toolName: "bash",
              state: "denied",
              input: { command: "wrangler deploy" },
              approval: { approved: false, message: "Not before the review is done." },
            }

    return (
      <ToolViewsProvider views={views} onApproval={(_, ok) => setApproved(ok)}>
        <ToolTrace
          className="max-w-xl"
          tools={[
            {
              toolCallId: "a",
              toolName: "search_transactions",
              state: "input-streaming",
              inputText: '{"query": "Mathal',
            },
            {
              toolCallId: "b",
              toolName: "get_weather",
              state: "running",
              input: { city: "Bergen" },
            },
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
              output: { content: [{ type: "text", text: '{"budgets": 3, "overspent": ["Eating out"]}' }] },
            },
          ]}
        />
        {approved !== null && (
          <Button variant="link" size="sm" className="mt-4 px-0" onClick={() => setApproved(null)}>
            Reset
          </Button>
        )}
      </ToolViewsProvider>
    )
  },
}

export const NestedCalls: Story = {
  name: "Nested calls",
  render: () => (
    <ToolViewsProvider views={views}>
      <ToolTrace
        className="max-w-xl"
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
    </ToolViewsProvider>
  ),
}

export const Fallback: Story = {
  name: "Without views",
  render: () => (
    <ToolTrace
      className="max-w-xl"
      tools={calls.map((call) => ({ ...call, durationMs: call.durationMs ?? 380 }))}
    />
  ),
}

export const Viewers: Story = {
  name: "Value viewers",
  render: () => (
    <div className="grid max-w-xl gap-6">
      <Labeled label="JsonTree">
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
      </Labeled>
      <Labeled label="KeyValue">
        <KeyValue value={{ city: "Oslo", price: 4200000, deposit: 0.15, years: 30 }} />
      </Labeled>
      <Labeled label="ValueTable">
        <ValueTable rows={transactions} />
      </Labeled>
      <Labeled label="DiffView">
        <DiffView
          value={"@@ -1,3 +1,3 @@\n const DEPOSIT = 0.15\n-const RATE = 0.051\n+const RATE = 0.049\n const YEARS = 30"}
          title="model.ts"
        />
      </Labeled>
      <Labeled label="TerminalOutput">
        <TerminalOutput
          command="pnpm test"
          value={{ stdout: "✓ savings.test.ts (12)\n✗ mortgage.test.ts (1 failed)", stderr: "Expected 19400, got 19150", exitCode: 1 }}
        />
      </Labeled>
      <Labeled label='ToolValue format="code"'>
        <ToolValue format="code" language="sql" value={"select * from budgets\nwhere overspent"} />
      </Labeled>
      <Labeled label='ToolValue format="markdown"'>
        <ToolValue format="markdown" value={"**3 budgets**, one over:\n\n- Eating out: kr 2 890 of kr 2 500\n\n```\n2890 - 2500 = 390 over\n```"} />
      </Labeled>
    </div>
  ),
}

export const Composed: Story = {
  name: "Composed by hand",
  render: () => (
    <div className="max-w-xl">
      <ToolCall status="awaiting-approval" defaultOpen>
        <ToolCallTrigger>
          <TraceIcon>
            <TerminalIcon />
          </TraceIcon>
          <TraceTitle>Run rm -rf dist</TraceTitle>
          <TraceDescription className="text-warning">Needs approval</TraceDescription>
        </ToolCallTrigger>
        <ToolCallApproval>
          <p>This deletes the build folder.</p>
          <ToolCallApprovalActions>
            <Button size="sm">Allow</Button>
            <Button size="sm" variant="outline">
              Deny
            </Button>
          </ToolCallApprovalActions>
        </ToolCallApproval>
        <ToolCallContent>
          <ToolCallSection>
            <ToolCallSectionLabel>Input</ToolCallSectionLabel>
            <ToolValue value={{ command: "rm -rf dist", cwd: "~/budget" }} />
          </ToolCallSection>
        </ToolCallContent>
      </ToolCall>
    </div>
  ),
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
