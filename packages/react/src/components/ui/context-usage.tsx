"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ContextUsageLevel = "low" | "medium" | "high" | "full"

// One section of what's in the context: messages, tools, the system prompt.
type ContextUsageSegment = {
  label: React.ReactNode
  tokens: number
  // Any CSS color. Defaults to the chart colors in order.
  color?: string
}

type ContextUsageContextProps = {
  used: number
  limit?: number
  ratio: number
  level: ContextUsageLevel
  segments?: ContextUsageSegment[]
  compactAt?: number
}

const SEGMENT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function segmentColor(segment: ContextUsageSegment, index: number) {
  return segment.color ?? SEGMENT_COLORS[index % SEGMENT_COLORS.length]
}

const ContextUsageContext = React.createContext<ContextUsageContextProps | null>(null)

function useContextUsage() {
  const context = React.useContext(ContextUsageContext)

  if (!context) {
    throw new Error("useContextUsage must be used within a ContextUsage.")
  }

  return context
}

// 0.13 → "13.0%", 0.0004 → "<0.1%", 0 → "0%".
function formatShare(share: number) {
  if (share <= 0) return "0%"
  if (share < 0.001) return "<0.1%"
  return `${(share * 100).toFixed(1)}%`
}

// 1234 → "1.2k", 84_200 → "84.2k", 412_000 → "412k", 1_250_000 → "1.25M".
function formatTokens(tokens: number) {
  if (tokens < 1000) {
    return String(Math.round(tokens))
  }

  if (tokens < 1_000_000) {
    const k = tokens / 1000
    return `${k < 100 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`
  }

  return `${(tokens / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`
}

function levelFor(ratio: number): ContextUsageLevel {
  if (ratio >= 0.95) return "full"
  if (ratio >= 0.8) return "high"
  if (ratio >= 0.5) return "medium"
  return "low"
}

// How much of the context window (or any token budget) a conversation uses,
// as a small ring that opens a breakdown. It turns amber from 80% and red
// from 95%. Without a `limit` it shows the count only. Pass `segments` to
// color the bar by what's using the space, and `compactAt` (0 to 1) to mark
// where the conversation gets summarized.
function ContextUsage({
  used,
  limit,
  segments,
  compactAt,
  ...props
}: React.ComponentProps<typeof Popover> & {
  used: number
  limit?: number
  segments?: ContextUsageSegment[]
  compactAt?: number
}) {
  const ratio = limit ? Math.max(0, used / limit) : 0
  const value = React.useMemo(
    () => ({ used, limit, ratio, level: levelFor(ratio), segments, compactAt }),
    [used, limit, ratio, segments, compactAt]
  )

  return (
    <ContextUsageContext.Provider value={value}>
      <Popover data-slot="context-usage" {...props} />
    </ContextUsageContext.Provider>
  )
}

function ContextUsageRing({
  size = 16,
  strokeWidth = 2,
  className,
  ...props
}: React.ComponentProps<"svg"> & { size?: number; strokeWidth?: number }) {
  const { ratio, level, limit } = useContextUsage()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <svg
      data-slot="context-usage-ring"
      data-level={level}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className={cn(
        "shrink-0 -rotate-90 text-foreground/70 data-[level=full]:text-destructive data-[level=high]:text-warning",
        className
      )}
      {...props}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth={strokeWidth}
      />
      {limit !== undefined && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - Math.min(ratio, 1))}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      )}
    </svg>
  )
}

// The ring, plus the percentage when `showLabel` is set.
function ContextUsageTrigger({
  showLabel = false,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { showLabel?: boolean }) {
  const { used, limit, ratio, level } = useContextUsage()
  const percent = Math.round(ratio * 100)
  const label = limit
    ? `Context: ${percent}% used`
    : `Context: ${formatTokens(used)} tokens used`

  return (
    <PopoverTrigger asChild>
      <button
        data-slot="context-usage-trigger"
        data-level={level}
        type="button"
        aria-label={label}
        className={cn(
          "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs text-muted-foreground tabular-nums transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted data-[level=full]:text-destructive data-[level=high]:text-warning",
          !showLabel && !children && "w-8 px-0",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <ContextUsageRing />
            {showLabel && <span>{limit ? `${percent}%` : formatTokens(used)}</span>}
          </>
        )}
      </button>
    </PopoverTrigger>
  )
}

function ContextUsageContent({
  className,
  side = "top",
  align = "end",
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      data-slot="context-usage-content"
      side={side}
      align={align}
      className={cn("flex w-72 flex-col gap-3 rounded-xl p-3 text-sm", className)}
      {...props}
    >
      {children ?? <ContextUsageSummary />}
    </PopoverContent>
  )
}

// "42% used · 84.2k / 200k" over a bar, the default body of the content.
// With `segments` the bar is split by section, in the same colors as
// ContextUsageBreakdown.
function ContextUsageSummary({
  title = "Context window",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { title?: React.ReactNode }) {
  const { used, limit, ratio, level } = useContextUsage()

  return (
    <div
      data-slot="context-usage-summary"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {title && <span className="font-medium">{title}</span>}
      <div className="flex items-baseline justify-between gap-3 tabular-nums">
        {limit !== undefined ? (
          <span
            data-level={level}
            className="font-medium data-[level=full]:text-destructive data-[level=high]:text-warning"
          >
            {formatPercent(ratio)} used
          </span>
        ) : (
          <span className="font-medium">{formatTokens(used)} tokens</span>
        )}
        {limit !== undefined && (
          <span className="text-xs text-muted-foreground">
            {formatTokens(used)} / {formatTokens(limit)}
          </span>
        )}
      </div>
      {limit !== undefined && <ContextUsageBar />}
    </div>
  )
}

function formatPercent(ratio: number) {
  if (ratio > 0 && ratio < 0.01) return "<1%"
  return `${Math.round(ratio * 100)}%`
}

// The meter on its own: one fill, or one stretch per segment.
function ContextUsageBar({ className, ...props }: React.ComponentProps<"div">) {
  const { used, limit = used, ratio, level, segments, compactAt } =
    useContextUsage()
  const shown = segments?.filter((s) => s.tokens > 0)

  return (
    <div
      data-slot="context-usage-bar"
      role="meter"
      aria-label="Context used"
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-valuenow={Math.min(used, limit)}
      className={cn("relative h-2 rounded-full bg-muted", className)}
      {...props}
    >
      <div className="flex h-full gap-px overflow-hidden rounded-full">
        {shown?.length ? (
          shown.map((segment, i) => (
            <div
              key={i}
              className="h-full min-w-[3px] transition-[width] duration-500 ease-out"
              style={{
                width: `${(segment.tokens / Math.max(limit, 1)) * 100}%`,
                background: segmentColor(segment, segments!.indexOf(segment)),
              }}
            />
          ))
        ) : (
          <div
            data-level={level}
            className="h-full rounded-full bg-foreground/70 transition-[width] duration-500 ease-out data-[level=full]:bg-destructive data-[level=high]:bg-warning"
            style={{ width: `${Math.min(ratio, 1) * 100}%` }}
          />
        )}
      </div>
      {compactAt !== undefined && compactAt > 0 && compactAt < 1 && (
        <div
          aria-hidden="true"
          title={`Summarized at ${Math.round(compactAt * 100)}%`}
          className="absolute -inset-y-0.5 w-px bg-foreground/40"
          style={{ left: `${compactAt * 100}%` }}
        />
      )}
    </div>
  )
}

// One row per segment, with its color, tokens and share of the window, then
// the free space left. Uses the segments given to ContextUsage unless passed.
function ContextUsageBreakdown({
  segments: own,
  showFree = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  segments?: ContextUsageSegment[]
  showFree?: boolean
}) {
  const context = useContextUsage()
  const segments = own ?? context.segments ?? []
  const total = context.limit ?? context.used
  const free = context.limit !== undefined ? Math.max(0, context.limit - context.used) : undefined

  return (
    <div
      data-slot="context-usage-breakdown"
      className={cn(
        "grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-2.5 gap-y-1.5 border-t pt-3 text-xs",
        className
      )}
      {...props}
    >
      {segments.map((segment, i) => (
        <ContextUsageBreakdownRow
          key={i}
          color={segmentColor(segment, i)}
          label={segment.label}
          tokens={segment.tokens}
          share={total ? segment.tokens / total : 0}
        />
      ))}
      {showFree && free !== undefined && (
        <ContextUsageBreakdownRow
          label="Free space"
          tokens={free}
          share={total ? free / total : 0}
          muted
        />
      )}
    </div>
  )
}

function ContextUsageBreakdownRow({
  color,
  label,
  tokens,
  share,
  muted = false,
}: {
  color?: string
  label: React.ReactNode
  tokens: number
  share: number
  muted?: boolean
}) {
  return (
    <div data-slot="context-usage-breakdown-row" className="contents">
      <span
        aria-hidden="true"
        className={cn("size-2.5 rounded-[3px]", muted && "bg-muted ring-1 ring-border ring-inset")}
        style={color ? { background: color } : undefined}
      />
      <span className={cn("truncate", muted ? "text-muted-foreground" : "text-foreground")}>{label}</span>
      <span className="text-right text-muted-foreground tabular-nums">{formatTokens(tokens)}</span>
      <span className={cn("w-12 text-right tabular-nums", muted && "text-muted-foreground")}>
        {formatShare(share)}
      </span>
    </div>
  )
}

function ContextUsageRows({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="context-usage-rows"
      className={cn("grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t pt-3 text-xs", className)}
      {...props}
    />
  )
}

function ContextUsageRow({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { label: React.ReactNode }) {
  return (
    <div data-slot="context-usage-row" className={cn("contents", className)} {...props}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right tabular-nums">{children}</dd>
    </div>
  )
}

export {
  ContextUsage,
  ContextUsageRing,
  ContextUsageTrigger,
  ContextUsageContent,
  ContextUsageSummary,
  ContextUsageBar,
  ContextUsageBreakdown,
  ContextUsageRows,
  ContextUsageRow,
  formatTokens,
  useContextUsage,
  type ContextUsageLevel,
  type ContextUsageSegment,
}
