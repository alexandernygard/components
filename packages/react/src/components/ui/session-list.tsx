"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MoreHorizontalIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

// A list of conversations, for a sidebar or a history page. Groups hold a
// label and items; each item is a button or link with a hover menu.
function SessionList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="session-list"
      className={cn("flex min-w-0 flex-col gap-4", className)}
      {...props}
    />
  )
}

function SessionListGroup({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { label?: React.ReactNode }) {
  const id = React.useId()

  return (
    <section
      data-slot="session-list-group"
      aria-labelledby={label ? id : undefined}
      className={cn("flex min-w-0 flex-col gap-0.5", className)}
      {...props}
    >
      {label && (
        <h3 id={id} className="px-2 pb-1 text-xs font-medium text-muted-foreground">
          {label}
        </h3>
      )}
      <ul className="flex min-w-0 flex-col gap-px">{children}</ul>
    </section>
  )
}

function SessionListItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="session-list-item"
      className={cn("group/session relative min-w-0", className)}
      {...props}
    />
  )
}

// The clickable row. Use `asChild` for a link. `active` marks the open one.
function SessionListButton({
  asChild = false,
  active = false,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean; active?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="session-list-button"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left text-sm text-foreground/80 outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-active:bg-accent data-active:font-medium data-active:text-foreground in-data-[slot=sidebar]:hover:bg-sidebar-accent in-data-[slot=sidebar]:data-active:bg-sidebar-accent group-has-data-[slot=session-list-actions]/session:pr-8",
        className
      )}
      {...(asChild ? {} : { type: "button" })}
      {...props}
    />
  )
}

function SessionListTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="session-list-title"
      className={cn("min-w-0 flex-1 truncate", className)}
      {...props}
    />
  )
}

// Small trailing text such as "2h". Hidden while the actions show.
function SessionListMeta({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="session-list-meta"
      className={cn(
        "shrink-0 text-xs text-muted-foreground tabular-nums group-has-data-[slot=session-list-actions]/session:group-hover/session:invisible group-has-data-[slot=session-list-actions]/session:group-focus-within/session:invisible",
        className
      )}
      {...props}
    />
  )
}

// "running" while the agent works, "unread" for a reply not seen yet.
function SessionListStatus({
  status,
  className,
  ...props
}: React.ComponentProps<"span"> & { status: "running" | "unread" | "error" }) {
  const label = { running: "Running", unread: "Unread", error: "Failed" }[status]

  return (
    <span
      data-slot="session-list-status"
      data-status={status}
      role="img"
      aria-label={label}
      className={cn("flex size-4 shrink-0 items-center justify-center", className)}
      {...props}
    >
      {status === "running" ? (
        <Spinner className="size-3.5 text-muted-foreground" />
      ) : (
        <span
          className={cn(
            "size-2 rounded-full",
            status === "unread" ? "bg-highlight" : "bg-destructive"
          )}
        />
      )}
    </span>
  )
}

// Holds the row's menu trigger. Shows on hover, focus, while the row is
// open, while its menu is open, and always on touch screens.
function SessionListActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="session-list-actions"
      className={cn(
        "absolute top-1/2 right-1 flex -translate-y-1/2 items-center opacity-0 transition-opacity group-focus-within/session:opacity-100 group-hover/session:opacity-100 group-has-data-active/session:opacity-100 has-aria-expanded:opacity-100 pointer-coarse:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function SessionListAction({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="session-list-action"
      variant="ghost"
      size="icon-xs"
      aria-label="More"
      className={cn("text-muted-foreground hover:bg-background/60 hover:text-foreground", className)}
      {...props}
    >
      {children ?? <MoreHorizontalIcon />}
    </Button>
  )
}

// Replaces the row while renaming. Enter or leaving the field saves,
// Escape cancels. An empty or unchanged name cancels too.
function SessionListRename({
  defaultValue,
  onRename,
  onCancel,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "defaultValue"> & {
  defaultValue: string
  onRename: (title: string) => void
  onCancel: () => void
}) {
  const done = React.useRef(false)

  function finish(value: string | null) {
    if (done.current) return
    done.current = true
    const title = value?.trim()
    if (title && title !== defaultValue) onRename(title)
    else onCancel()
  }

  return (
    <input
      data-slot="session-list-rename"
      aria-label="Rename"
      autoFocus
      defaultValue={defaultValue}
      onFocus={(event) => event.currentTarget.select()}
      onBlur={(event) => finish(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.nativeEvent.isComposing) {
          event.preventDefault()
          finish(event.currentTarget.value)
        } else if (event.key === "Escape") {
          event.preventDefault()
          finish(null)
        }
      }}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-ring bg-background px-2 text-sm outline-none ring-2 ring-ring/30",
        className
      )}
      {...props}
    />
  )
}

function SessionListEmpty({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="session-list-empty"
      className={cn("px-2 py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function SessionListSkeleton({
  rows = 6,
  className,
  ...props
}: React.ComponentProps<"div"> & { rows?: number }) {
  return (
    <div
      data-slot="session-list-skeleton"
      role="status"
      aria-label="Loading conversations"
      className={cn("flex flex-col gap-px", className)}
      {...props}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex h-8 items-center px-2">
          <Skeleton className="h-3.5" style={{ width: `${45 + ((i * 37) % 45)}%` }} />
        </div>
      ))}
    </div>
  )
}

type SessionGroup<T> = { label: string; items: T[] }

// Groups items into Today, Yesterday, Previous 7 days, Previous 30 days, then
// by month. Expects the items newest first.
function groupSessionsByDate<T>(
  items: T[],
  dateOf: (item: T) => Date | number | string,
  { now = new Date(), locale }: { now?: Date; locale?: string } = {}
): SessionGroup<T>[] {
  const day = 24 * 60 * 60 * 1000
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const groups: SessionGroup<T>[] = []

  for (const item of items) {
    const date = new Date(dateOf(item))
    const time = date.getTime()
    const label =
      time >= today
        ? "Today"
        : time >= today - day
          ? "Yesterday"
          : time >= today - 7 * day
            ? "Previous 7 days"
            : time >= today - 30 * day
              ? "Previous 30 days"
              : date.toLocaleDateString(locale, {
                  month: "long",
                  year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
                })

    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }

  return groups
}

export {
  SessionList,
  SessionListGroup,
  SessionListItem,
  SessionListButton,
  SessionListTitle,
  SessionListMeta,
  SessionListStatus,
  SessionListActions,
  SessionListAction,
  SessionListRename,
  SessionListEmpty,
  SessionListSkeleton,
  groupSessionsByDate,
  type SessionGroup,
}
