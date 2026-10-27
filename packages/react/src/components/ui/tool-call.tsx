import * as React from "react"
import { cn } from "@/lib/utils"

import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceLine,
} from "@/components/ui/trace"

// The same states as a tool part in @alexandernygard/ai-kit.
type ToolCallStatus =
  | "input-streaming"
  | "input-available"
  | "awaiting-approval"
  | "awaiting-output"
  | "running"
  | "output-available"
  | "output-error"
  | "denied"

function traceStatus(status?: ToolCallStatus) {
  switch (status) {
    case "input-streaming":
    case "input-available":
    case "awaiting-output":
    case "running":
      return "running"
    case "output-error":
    case "denied":
      return "error"
    default:
      return undefined
  }
}

const ToolCallContext = React.createContext<{ status?: ToolCallStatus }>({})

function ToolCall({
  status,
  className,
  ...props
}: React.ComponentProps<typeof TraceCollapsible> & { status?: ToolCallStatus }) {
  return (
    <ToolCallContext.Provider value={{ status }}>
      <TraceCollapsible
        data-slot="tool-call"
        data-status={status}
        className={className}
        {...(props as React.ComponentProps<typeof TraceCollapsible>)}
      />
    </ToolCallContext.Provider>
  )
}

// A tool call with nothing to expand. Put it straight in a Trace.
function ToolCallLine({
  status,
  ...props
}: Omit<React.ComponentProps<typeof TraceLine>, "status"> & {
  status?: ToolCallStatus
}) {
  return (
    <TraceLine
      data-tool-status={status}
      status={traceStatus(status)}
      {...props}
    />
  )
}

function ToolCallTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TraceCollapsibleTrigger>) {
  const { status } = React.useContext(ToolCallContext)

  return (
    <TraceCollapsibleTrigger
      data-slot="tool-call-trigger"
      className={className}
      {...props}
    >
      <ToolCallLine status={status}>{children}</ToolCallLine>
    </TraceCollapsibleTrigger>
  )
}

function ToolCallContent({
  className,
  ...props
}: React.ComponentProps<typeof TraceCollapsibleContent>) {
  return (
    <TraceCollapsibleContent
      data-slot="tool-call-content"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function ToolCallSection({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tool-call-section"
      className={cn("flex min-w-0 flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function ToolCallSectionLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tool-call-section-label"
      className={cn("text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

// Asks the user to allow a call. Sits under the trigger, outside the
// collapsible content, so it shows while the call is collapsed.
function ToolCallApproval({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tool-call-approval"
      role="group"
      className={cn(
        "mt-2 mb-1 ml-[calc(--spacing(2)-1px)] flex min-w-0 flex-col gap-2.5 border-l border-warning/50 pl-4 text-sm text-foreground",
        className
      )}
      {...props}
    />
  )
}

function ToolCallApprovalActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tool-call-approval-actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  ToolCall,
  ToolCallLine,
  ToolCallTrigger,
  ToolCallContent,
  ToolCallSection,
  ToolCallSectionLabel,
  ToolCallApproval,
  ToolCallApprovalActions,
  type ToolCallStatus,
}
