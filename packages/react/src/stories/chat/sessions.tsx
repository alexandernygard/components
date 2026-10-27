// Session data and a session list wired with a menu, for the Chat stories.
import * as React from "react"
import { GitBranchIcon, PencilIcon, PinIcon, PinOffIcon, Trash2Icon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  groupSessionsByDate,
  SessionList,
  SessionListAction,
  SessionListActions,
  SessionListButton,
  SessionListEmpty,
  SessionListGroup,
  SessionListItem,
  SessionListMeta,
  SessionListRename,
  SessionListStatus,
  SessionListTitle,
} from "@/components/ui/session-list"

export type DemoSession = {
  id: string
  title: string
  updatedAt: number
  status?: "running" | "unread" | "error"
  pinned?: boolean
}

// Fixed, so the groups in the stories don't move from day to day.
export const now = new Date(2026, 9, 27, 15, 0)

const ago = (hours: number) => now.getTime() - hours * 60 * 60 * 1000

export const sampleSessions: DemoSession[] = [
  { id: "s1", title: "September spending by category", updatedAt: ago(0.2), status: "running" },
  { id: "s2", title: "Deposit plan for the flat", updatedAt: ago(2), status: "unread", pinned: true },
  { id: "s3", title: "Forgotten subscriptions", updatedAt: ago(5) },
  { id: "s4", title: "Compare electricity providers", updatedAt: ago(26) },
  { id: "s5", title: "Tax return questions", updatedAt: ago(30), status: "error" },
  { id: "s6", title: "Budget for the trip to Lisbon", updatedAt: ago(24 * 3) },
  { id: "s7", title: "Mortgage rates explained", updatedAt: ago(24 * 5), pinned: true },
  { id: "s8", title: "Groceries: how to spend less without eating worse", updatedAt: ago(24 * 12) },
  { id: "s9", title: "Savings account interest", updatedAt: ago(24 * 20) },
  { id: "s10", title: "Car insurance renewal", updatedAt: ago(24 * 45) },
  { id: "s11", title: "Christmas gift budget", updatedAt: ago(24 * 300) },
]

export function shortAgo(time: number) {
  const minutes = Math.max(0, Math.round((now.getTime() - time) / 60000))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.round(hours / 24)
  return days < 30 ? `${days}d` : `${Math.round(days / 30)}mo`
}

export type DemoSessionListProps = {
  sessions: DemoSession[]
  activeId?: string
  showMeta?: boolean
  onSelect?: (id: string) => void
  onRename?: (id: string, title: string) => void
  onPin?: (id: string, pinned: boolean) => void
  onFork?: (id: string) => void
  onDelete?: (id: string) => void
}

export function DemoSessionList({
  sessions,
  activeId,
  showMeta = true,
  onSelect,
  onRename,
  onPin,
  onFork,
  onDelete,
}: DemoSessionListProps) {
  const [renaming, setRenaming] = React.useState<string | null>(null)

  if (sessions.length === 0) {
    return <SessionListEmpty>No conversations yet</SessionListEmpty>
  }

  const pinned = sessions.filter((s) => s.pinned)
  const groups = [
    ...(pinned.length ? [{ label: "Pinned", items: pinned }] : []),
    ...groupSessionsByDate(
      sessions.filter((s) => !s.pinned),
      (s) => s.updatedAt,
      { now, locale: "en" },
    ),
  ]

  return (
    <SessionList>
      {groups.map((group) => (
        <SessionListGroup key={group.label} label={group.label}>
          {group.items.map((session) => (
            <SessionListItem key={session.id}>
              {renaming === session.id ? (
                <SessionListRename
                  defaultValue={session.title}
                  onRename={(title) => {
                    onRename?.(session.id, title)
                    setRenaming(null)
                  }}
                  onCancel={() => setRenaming(null)}
                />
              ) : (
                <>
                  <SessionListButton active={session.id === activeId} onClick={() => onSelect?.(session.id)}>
                    <SessionListTitle>{session.title}</SessionListTitle>
                    {session.status ? (
                      <SessionListStatus status={session.status} />
                    ) : (
                      showMeta && <SessionListMeta>{shortAgo(session.updatedAt)}</SessionListMeta>
                    )}
                  </SessionListButton>
                  <SessionListActions>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SessionListAction aria-label={`More for ${session.title}`} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-44"
                        // Renaming focuses the field, so don't send focus back to the trigger.
                        onCloseAutoFocus={(event) => event.preventDefault()}
                      >
                        <DropdownMenuItem onSelect={() => setRenaming(session.id)}>
                          <PencilIcon />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onPin?.(session.id, !session.pinned)}>
                          {session.pinned ? <PinOffIcon /> : <PinIcon />}
                          {session.pinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onFork?.(session.id)}>
                          <GitBranchIcon />
                          Fork
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(session.id)}>
                          <Trash2Icon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SessionListActions>
                </>
              )}
            </SessionListItem>
          ))}
        </SessionListGroup>
      ))}
    </SessionList>
  )
}

// The list with its own state, calling the handlers as well.
export function useDemoSessions(initial: DemoSession[], handlers: Omit<DemoSessionListProps, "sessions"> = {}) {
  const [activeId, setActiveId] = React.useState<string | undefined>(handlers.activeId ?? initial[0]?.id)
  const [sessions, setSessions] = React.useState(() =>
    initial.map((s) => (s.id === activeId && s.status === "unread" ? { ...s, status: undefined } : s)),
  )

  const props: DemoSessionListProps = {
    sessions,
    activeId,
    onSelect(id) {
      setActiveId(id)
      setSessions((list) => list.map((s) => (s.id === id && s.status === "unread" ? { ...s, status: undefined } : s)))
      handlers.onSelect?.(id)
    },
    onRename(id, title) {
      setSessions((list) => list.map((s) => (s.id === id ? { ...s, title } : s)))
      handlers.onRename?.(id, title)
    },
    onPin(id, pinned) {
      setSessions((list) => list.map((s) => (s.id === id ? { ...s, pinned } : s)))
      handlers.onPin?.(id, pinned)
    },
    onFork(id) {
      const source = sessions.find((s) => s.id === id)
      if (source) {
        const copy = { id: `${id}-fork-${Date.now()}`, title: `${source.title} (fork)`, updatedAt: now.getTime() }
        setSessions((list) => [copy, ...list])
        setActiveId(copy.id)
      }
      handlers.onFork?.(id)
    },
    onDelete(id) {
      setSessions((list) => list.filter((s) => s.id !== id))
      if (id === activeId) setActiveId(undefined)
      handlers.onDelete?.(id)
    },
  }

  return { sessions, setSessions, activeId, setActiveId, props }
}
