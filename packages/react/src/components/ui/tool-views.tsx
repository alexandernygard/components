import * as React from "react"
import { cn } from "@/lib/utils"

import { WrenchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  ToolCall,
  ToolCallApproval,
  ToolCallApprovalActions,
  ToolCallContent,
  ToolCallLine,
  ToolCallSection,
  ToolCallSectionLabel,
  ToolCallTrigger,
  type ToolCallStatus,
} from "@/components/ui/tool-call"
import {
  ToolValue,
  languageFromPath,
  pathOf,
  type ToolValueFormat,
} from "@/components/ui/tool-value"
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceTitle,
} from "@/components/ui/trace"

// A tool call to show. A ToolNode from @alexandernygard/ai-kit fits as is.
interface ToolCallData {
  toolCallId: string
  toolName: string
  state?: ToolCallStatus
  input?: unknown
  /** Raw input JSON while it streams. */
  inputText?: string
  output?: unknown
  error?: string
  /** Short label from the tool definition. Used when the view has no title. */
  title?: string
  approval?: { reason?: string; approved?: boolean; message?: string }
  /** Calls made from inside this one, such as code-mode or subagent calls. */
  children?: ToolCallData[]
  durationMs?: number
}

type ToolValueRender<T> =
  | false
  | ToolValueFormat
  | {
      format?: ToolValueFormat
      /**
       * For `code`: the language to highlight, or a function that picks it for
       * each call. Defaults to the extension of the call's `path`, `file_path`
       * or `filename` input.
       */
      language?: string | ((value: T, call: ToolCallData) => string | undefined)
      /** Replaces the "Input" or "Output" label. Pass `false` to hide it. */
      label?: React.ReactNode | false
      /** Picks the part of the value to show. */
      select?: (value: T) => unknown
    }
  | ((value: T, call: ToolCallData) => React.ReactNode)

interface ToolView<I = any, O = any> {
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  /** The line shown for the call. Receives the input once it has arrived. */
  title?: React.ReactNode | ((input: I | undefined, call: ToolCallData) => React.ReactNode)
  /** Used instead of `title` until the call has finished, such as "Searching for …". */
  runningTitle?: React.ReactNode | ((input: I | undefined, call: ToolCallData) => React.ReactNode)
  /** Shown after the title once the call has finished, such as "11 results". */
  summary?: (output: O, call: ToolCallData) => React.ReactNode
  /** How to show the input. Defaults to `"auto"`. */
  input?: ToolValueRender<I>
  /** How to show the output. Defaults to `"auto"`. */
  output?: ToolValueRender<O>
  defaultOpen?: boolean
}

type ToolViews = Record<string, ToolView>

// Typed helper for one view, so `input` and `output` are checked.
function defineToolView<I = any, O = any>(view: ToolView<I, O>) {
  return view
}

function defineToolViews<T extends ToolViews>(views: T) {
  return views
}

type ApprovalHandler = (call: ToolCallData, approved: boolean) => void

const ToolViewsContext = React.createContext<{
  views: ToolViews
  fallback?: ToolView
  onApproval?: ApprovalHandler
}>({ views: {} })

function ToolViewsProvider({
  views,
  fallback,
  onApproval,
  children,
}: {
  views: ToolViews
  /** Used for tools that have no view. */
  fallback?: ToolView
  /** Called when the user allows or denies a call that needs approval. */
  onApproval?: ApprovalHandler
  children?: React.ReactNode
}) {
  const parent = React.useContext(ToolViewsContext)
  const value = React.useMemo(
    () => ({
      views: { ...parent.views, ...views },
      fallback: fallback ?? parent.fallback,
      onApproval: onApproval ?? parent.onApproval,
    }),
    [parent, views, fallback, onApproval]
  )

  return <ToolViewsContext.Provider value={value}>{children}</ToolViewsContext.Provider>
}

function useToolView(toolName: string): ToolView {
  const { views, fallback } = React.useContext(ToolViewsContext)
  return views[toolName] ?? fallback ?? {}
}

// "search_transactions" → "Search transactions"
function humanize(name: string) {
  const words = name
    .replace(/^mcp__[^_]+__/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .trim()
    .toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function isEmpty(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value as object).length === 0)
  )
}

function formatDuration(ms: number) {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`
}

function renderIcon(icon: ToolView["icon"]) {
  if (icon === undefined) return <WrenchIcon />
  if (React.isValidElement(icon)) return icon
  // Lucide icons are forwardRef objects, not functions.
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)) {
    const Icon = icon as React.ComponentType
    return <Icon />
  }
  return icon as React.ReactNode
}

function renderValue<T>(
  value: T,
  render: ToolValueRender<T> | undefined,
  call: ToolCallData,
  defaultLabel: string
) {
  if (render === false) return null
  if (typeof render === "function") {
    const node = render(value, call)
    return node == null ? null : { label: defaultLabel, node }
  }

  const options = typeof render === "string" ? { format: render } : (render ?? {})
  const shown = options.select ? options.select(value) : value
  // A code view without a language highlights by the file the call works on,
  // and shows that file's name.
  const path = options.format === "code" && options.language === undefined ? pathOf(call.input) : undefined
  const language =
    typeof options.language === "function"
      ? options.language(value, call)
      : (options.language ?? languageFromPath(path))
  return {
    label: options.label === undefined ? defaultLabel : options.label,
    node: (
      <ToolValue
        value={shown}
        format={options.format}
        language={language}
        title={path}
      />
    ),
  }
}

function ToolCallView({
  call,
  view: viewProp,
  onApproval: onApprovalProp,
  className,
}: {
  call: ToolCallData
  /** Overrides the view from ToolViewsProvider. */
  view?: ToolView
  onApproval?: ApprovalHandler
  className?: string
}) {
  const registered = useToolView(call.toolName)
  const context = React.useContext(ToolViewsContext)
  const view = viewProp ?? registered
  const onApproval = onApprovalProp ?? context.onApproval
  const status = call.state
  const inputReady = status !== "input-streaming" && call.input !== undefined
  const done = status === "output-available"

  // A denied call never ran, so it keeps the running title ("Running …, Denied").
  const finished = status === undefined || status === "output-available" || status === "output-error"
  const titleView = !finished && view.runningTitle !== undefined ? view.runningTitle : view.title
  let title: React.ReactNode = call.title ?? humanize(call.toolName)
  if (typeof titleView === "function") {
    try {
      title = titleView(inputReady ? call.input : undefined, call) ?? title
    } catch {
      // A title that reads a missing field falls back to the tool name.
    }
  } else if (titleView !== undefined) {
    title = titleView
  }

  let description: React.ReactNode = null
  if (status === "denied") {
    description = "Denied"
  } else if (status === "awaiting-approval") {
    description = <span className="text-warning">Needs approval</span>
  } else if (done && view.summary) {
    try {
      description = view.summary(call.output, call)
    } catch {
      description = null
    }
  } else if (done && call.durationMs !== undefined) {
    description = formatDuration(call.durationMs)
  }

  const sections: React.ReactNode[] = []

  if (status === "input-streaming" && call.inputText && view.input !== false) {
    sections.push(
      <ToolCallSection key="input">
        <ToolCallSectionLabel>Input</ToolCallSectionLabel>
        <CodeBlock size="sm">
          <CodeBlockContent wrap className="max-h-40 text-muted-foreground">
            {call.inputText}
          </CodeBlockContent>
        </CodeBlock>
      </ToolCallSection>
    )
  } else if (inputReady && !isEmpty(call.input)) {
    const input = renderValue(call.input, view.input, call, "Input")
    if (input) {
      sections.push(
        <ToolCallSection key="input">
          {input.label !== false && <ToolCallSectionLabel>{input.label}</ToolCallSectionLabel>}
          {input.node}
        </ToolCallSection>
      )
    }
  }

  if (call.children?.length) {
    sections.push(
      <ToolCallSection key="children">
        <ToolCallSectionLabel>Calls</ToolCallSectionLabel>
        <ToolTrace tools={call.children} onApproval={onApprovalProp} />
      </ToolCallSection>
    )
  }

  if (status === "output-error" && call.error) {
    sections.push(
      <ToolCallSection key="error">
        <ToolCallSectionLabel>Error</ToolCallSectionLabel>
        <CodeBlock size="sm" variant="destructive">
          <CodeBlockContent wrap className="max-h-80">
            {call.error}
          </CodeBlockContent>
        </CodeBlock>
      </ToolCallSection>
    )
  } else if (status === "denied" && call.approval?.message) {
    sections.push(
      <ToolCallSection key="denied">
        <ToolCallSectionLabel>Reason</ToolCallSectionLabel>
        <p className="text-sm text-foreground">{call.approval.message}</p>
      </ToolCallSection>
    )
  } else if (done && call.output !== undefined) {
    const output = renderValue(call.output, view.output, call, "Output")
    if (output) {
      sections.push(
        <ToolCallSection key="output">
          {output.label !== false && <ToolCallSectionLabel>{output.label}</ToolCallSectionLabel>}
          {output.node}
        </ToolCallSection>
      )
    }
  }

  const line = (
    <>
      <TraceIcon>{renderIcon(view.icon)}</TraceIcon>
      <TraceTitle>{title}</TraceTitle>
      {description != null && description !== false && (
        <TraceDescription>{description}</TraceDescription>
      )}
    </>
  )

  const approval = status === "awaiting-approval" && (
    <ToolCallApproval>
      {call.approval?.reason && <p>{call.approval.reason}</p>}
      {onApproval && (
        <ToolCallApprovalActions>
          <Button size="sm" onClick={() => onApproval(call, true)}>
            Allow
          </Button>
          <Button size="sm" variant="outline" onClick={() => onApproval(call, false)}>
            Deny
          </Button>
        </ToolCallApprovalActions>
      )}
    </ToolCallApproval>
  )

  if (sections.length === 0) {
    return (
      <div data-slot="tool-call-view" className={cn("flex min-w-0 flex-col", className)}>
        <ToolCallLine status={status}>{line}</ToolCallLine>
        {approval}
      </div>
    )
  }

  return (
    <ToolCall
      data-slot="tool-call-view"
      status={status}
      defaultOpen={view.defaultOpen}
      className={className}
    >
      <ToolCallTrigger>{line}</ToolCallTrigger>
      {approval}
      <ToolCallContent>{sections}</ToolCallContent>
    </ToolCall>
  )
}

function ToolTrace({
  tools,
  onApproval,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Trace>, "children"> & {
  tools: ToolCallData[]
  onApproval?: ApprovalHandler
}) {
  return (
    <Trace data-slot="tool-trace" className={className} {...props}>
      {tools.map((call) => (
        <ToolCallView key={call.toolCallId} call={call} onApproval={onApproval} />
      ))}
    </Trace>
  )
}

export {
  ToolViewsProvider,
  ToolCallView,
  ToolTrace,
  useToolView,
  defineToolView,
  defineToolViews,
  type ToolCallData,
  type ToolView,
  type ToolViews,
  type ToolValueRender,
}
