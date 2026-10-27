"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ContextUsageLevel = "low" | "medium" | "high" | "full"

type ContextUsageContextProps = {
  used: number
  limit?: number
  ratio: number
  level: ContextUsageLevel
}

const ContextUsageContext = React.createContext<ContextUsageContextProps | null>(null)

function useContextUsage() {
  const context = React.useContext(ContextUsageContext)

  if (!context) {
    throw new Error("useContextUsage must be used within a ContextUsage.")
  }

  return context
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
// from 95%. Without a `limit` it shows the count only.
function ContextUsage({
  used,
  limit,
  ...props
}: React.ComponentProps<typeof Popover> & {
  used: number
  limit?: number
}) {
  const ratio = limit ? Math.max(0, used / limit) : 0
  const value = React.useMemo(
    () => ({ used, limit, ratio, level: levelFor(ratio) }),
    [used, limit, ratio]
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

// "84.2k of 200k tokens" with a bar, the default body of the content.
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
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium">{title}</span>
        {limit !== undefined && (
          <span
            data-level={level}
            className="text-xs text-muted-foreground tabular-nums data-[level=full]:text-destructive data-[level=high]:text-warning"
          >
            {Math.round(ratio * 100)}%
          </span>
        )}
      </div>
      {limit !== undefined && (
        <div
          role="meter"
          aria-label="Context used"
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={Math.min(used, limit)}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            data-level={level}
            className="h-full rounded-full bg-foreground/70 transition-[width] duration-500 ease-out data-[level=full]:bg-destructive data-[level=high]:bg-warning"
            style={{ width: `${Math.min(ratio, 1) * 100}%` }}
          />
        </div>
      )}
      <span className="text-xs text-muted-foreground tabular-nums">
        {formatTokens(used)}
        {limit !== undefined && ` of ${formatTokens(limit)}`} tokens
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
  ContextUsageRows,
  ContextUsageRow,
  formatTokens,
  useContextUsage,
  type ContextUsageLevel,
}
