import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test"
import {
  FileSearchIcon,
  PlusIcon,
  FileTextIcon,
  PiggyBankIcon,
  ReceiptIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageActions,
  MessageContent,
  MessageCopyAction,
  MessageEditAction,
  MessageEditor,
  MessageFooter,
  MessageForkAction,
  MessageRetryAction,
  MessageVersions,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { ToolCallLine, type ToolCallStatus } from "@/components/ui/tool-call"
import { Trace, TraceIcon, TraceTitle } from "@/components/ui/trace"

import { DemoComposer, longReply, markdownReply } from "./fixtures"
import { now, sampleSessions, DemoSessionList, useDemoSessions } from "./sessions"
import { typeText } from "./test-utils"

const meta = {
  title: "Chat/Conversation",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Turn = {
  id: string
  // The turn this one answers or follows. Left out, it follows the one before it in the list.
  parentId?: string | null
  role: "user" | "assistant"
  text: string
  files?: { name: string; size: number }[]
  tool?: { title: string; status: ToolCallStatus }
  state?: "streaming" | "stopped" | "error"
}

const seed: Turn[] = [
  { id: "1", role: "user", text: "How much did I spend on eating out in September?" },
  {
    id: "2",
    role: "assistant",
    tool: { title: "Searched September transactions", status: "output-available" },
    text: "**kr 1 600** across 11 purchases, which is kr 400 less than in August. The biggest was kr 480 at Mathallen on the 19th.",
  },
  { id: "3", role: "user", text: "Compare it with August for every category" },
  { id: "4", role: "assistant", text: markdownReply },
]

// Turns form a tree: edits and retries are siblings, and the head picks the branch shown.
function chain(turns: Turn[]): Turn[] {
  return turns.map((t, i) => (t.parentId !== undefined ? t : { ...t, parentId: turns[i - 1]?.id ?? null }))
}

function pathTo(turns: Turn[], headId: string | null) {
  const byId = new Map(turns.map((t) => [t.id, t]))
  const path: Turn[] = []
  for (let t = headId ? byId.get(headId) : undefined; t; t = t.parentId ? byId.get(t.parentId) : undefined) {
    path.unshift(t)
  }
  return path
}

function siblingsOf(turns: Turn[], turn: Turn) {
  return turns.filter((t) => t.parentId === turn.parentId && t.role === turn.role)
}

function leafOf(turns: Turn[], id: string) {
  let leaf = id
  for (let child = turns.findLast((t) => t.parentId === leaf); child; child = turns.findLast((t) => t.parentId === leaf)) {
    leaf = child.id
  }
  return leaf
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

type TurnHandlers = {
  busy: boolean
  versions: { index: number; total: number; ids: string[] }
  onSwitch: (id: string) => void
  onEdit: (text: string) => void
  onRetry: () => void
  onFork?: () => void
}

function TurnView({ turn, busy, versions, onSwitch, onEdit, onRetry, onFork }: { turn: Turn } & TurnHandlers) {
  const [editing, setEditing] = React.useState(false)
  const switcher = (
    <MessageVersions
      index={versions.index}
      total={versions.total}
      onIndexChange={(i) => onSwitch(versions.ids[i])}
    />
  )

  if (turn.role === "user") {
    return (
      <Message align="end">
        <MessageContent>
          {turn.files?.length ? (
            <AttachmentGroup className="justify-end self-end">
              {turn.files.map((f) => (
                <Attachment key={f.name} size="sm">
                  <AttachmentMedia>
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{f.name}</AttachmentTitle>
                    <AttachmentDescription>{formatSize(f.size)}</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              ))}
            </AttachmentGroup>
          ) : null}
          {editing ? (
            <MessageEditor
              defaultValue={turn.text}
              onCancel={() => setEditing(false)}
              onSave={(text) => {
                setEditing(false)
                onEdit(text)
              }}
            />
          ) : (
            <>
              {turn.text && (
                <Bubble variant="muted">
                  <BubbleContent className="rounded-2xl px-4 py-2.5 text-[0.9375rem] whitespace-pre-wrap">
                    {turn.text}
                  </BubbleContent>
                </Bubble>
              )}
              <MessageActions visibility={versions.total > 1 ? "always" : "hover"}>
                {switcher}
                <MessageCopyAction text={turn.text} />
                <MessageEditAction disabled={busy} onClick={() => setEditing(true)} />
              </MessageActions>
            </>
          )}
        </MessageContent>
      </Message>
    )
  }

  return (
    <Message>
      <MessageContent className="gap-3">
        {turn.tool && (
          <Trace>
            <ToolCallLine status={turn.tool.status}>
              <TraceIcon>
                <FileSearchIcon />
              </TraceIcon>
              <TraceTitle>{turn.tool.title}</TraceTitle>
            </ToolCallLine>
          </Trace>
        )}
        {turn.text && (
          <Markdown streaming={turn.state === "streaming"} className="text-[0.9375rem]">
            {turn.text}
          </Markdown>
        )}
        {turn.state === "stopped" && (
          <MessageFooter className="px-0 font-normal">You stopped this reply</MessageFooter>
        )}
        {turn.state !== "streaming" && (
          <MessageActions visibility={versions.total > 1 ? "always" : "hover"}>
            {switcher}
            <MessageCopyAction text={turn.text} />
            <MessageRetryAction disabled={busy} onClick={onRetry} />
            {onFork && <MessageForkAction disabled={busy} onClick={onFork} />}
          </MessageActions>
        )}
      </MessageContent>
    </Message>
  )
}

const reply =
  "This is a demo, so the numbers are made up. Here's the shape of a typical answer:\n\n- A short **summary** first\n- Then the details, with `code` where it helps\n\nAnything else you'd like to check?"

// A whole chat screen with a fake assistant: it "searches", then streams.
// Editing a message or retrying a reply adds a branch; the arrows switch.
function ChatScreen({
  initial = seed,
  empty,
  className = "h-svh",
  onFork,
  onTurnsChange,
}: {
  initial?: Turn[]
  empty?: React.ReactNode
  className?: string
  // Gets the turns from the top down to the reply.
  onFork?: (path: Turn[]) => void
  onTurnsChange?: (turns: Turn[]) => void
}) {
  const [turns, setTurns] = React.useState(() => chain(initial))
  const [headId, setHeadId] = React.useState<string | null>(() => initial[initial.length - 1]?.id ?? null)
  const [status, setStatus] = React.useState<"idle" | "submitted" | "streaming">("idle")
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const path = pathTo(turns, headId)

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])
  React.useEffect(() => onTurnsChange?.(path), [turns, headId])

  function later(ms: number, run: () => void) {
    timers.current.push(setTimeout(run, ms))
  }

  function update(id: string, patch: (t: Turn) => Turn) {
    setTurns((list) => list.map((t) => (t.id === id ? patch(t) : t)))
  }

  function respond(parentId: string) {
    const id = crypto.randomUUID()
    setStatus("submitted")
    setHeadId(parentId)
    later(500, () => {
      setTurns((list) => [
        ...list,
        { id, parentId, role: "assistant", text: "", state: "streaming", tool: { title: "Searching transactions", status: "running" } },
      ])
      setHeadId(id)
    })
    later(1600, () => {
      setStatus("streaming")
      update(id, (t) => ({ ...t, tool: { title: "Searched transactions", status: "output-available" } }))
      let length = 0
      const tick = () => {
        length += 3
        update(id, (t) => ({ ...t, text: reply.slice(0, length) }))
        if (length < reply.length) later(18, tick)
        else {
          update(id, (t) => ({ ...t, state: undefined }))
          setStatus("idle")
        }
      }
      tick()
    })
  }

  function addUserTurn(parentId: string | null, text: string, files: Turn["files"] = []) {
    const id = crypto.randomUUID()
    setTurns((list) => [...list, { id, parentId, role: "user", text, files }])
    respond(id)
  }

  return (
    <div className={`flex flex-col bg-background ${className}`}>
      <MessageScrollerProvider>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-3xl gap-8 px-4 pt-10 pb-6">
              {path.length === 0 && empty}
              {path.map((turn) => {
                const siblings = siblingsOf(turns, turn)
                return (
                  <MessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === "user"}>
                    <TurnView
                      turn={turn}
                      busy={status !== "idle"}
                      versions={{ index: siblings.indexOf(turn), total: siblings.length, ids: siblings.map((t) => t.id) }}
                      onSwitch={(id) => setHeadId(leafOf(turns, id))}
                      onEdit={(text) => addUserTurn(turn.parentId ?? null, text, turn.files)}
                      onRetry={() => turn.parentId && respond(turn.parentId)}
                      onFork={onFork && (() => onFork(pathTo(turns, turn.id)))}
                    />
                  </MessageScrollerItem>
                )
              })}
              {status === "submitted" && path[path.length - 1]?.role === "user" && (
                <MessageScrollerItem>
                  <Marker role="status">
                    <MarkerIcon>
                      <Spinner />
                    </MarkerIcon>
                    <MarkerContent className="shimmer">Thinking</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        <DemoComposer
          status={status}
          onSubmit={({ text, files }) =>
            addUserTurn(headId, text, files.map((f) => ({ name: f.name, size: f.size })))
          }
          onStop={() => {
            timers.current.forEach(clearTimeout)
            timers.current = []
            setTurns((list) =>
              list.map((t) =>
                t.state === "streaming"
                  ? { ...t, state: "stopped", tool: t.tool && { ...t.tool, status: "output-available" } }
                  : t,
              ),
            )
            setStatus("idle")
          }}
        />
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ChatScreen />,
}

const suggestions = [
  { icon: ReceiptIcon, text: "Where did my money go in September?" },
  { icon: PiggyBankIcon, text: "Am I on track for the deposit?" },
  { icon: TrendingUpIcon, text: "Find subscriptions I forgot about" },
]

export const EmptyState: Story = {
  name: "Empty (new chat)",
  render: () => (
    <ChatScreen
      initial={[]}
      empty={
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <SparklesIcon className="size-8 text-highlight" />
          <h1 className="font-heading text-3xl text-balance">Good evening, Alex</h1>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <span
                key={s.text}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground"
              >
                <s.icon className="size-4" />
                {s.text}
              </span>
            ))}
          </div>
        </div>
      }
    />
  ),
}

const longThread: Turn[] = Array.from({ length: 30 }, (_, i) =>
  i % 2 === 0
    ? { id: String(i), role: "user", text: `Question ${i / 2 + 1}: what about month ${i / 2 + 1}?` }
    : { id: String(i), role: "assistant", text: i === 29 ? longReply : `Month ${(i + 1) / 2} looked fine: spending was within the budget, with a small bump in groceries.` },
)

export const LongThread: Story = {
  name: "Long thread (scroll button)",
  render: () => <ChatScreen initial={longThread} />,
}

export const Stopped: Story = {
  name: "Reply stopped",
  render: () => (
    <ChatScreen
      initial={[
        ...seed.slice(0, 2),
        { id: "s1", role: "user", text: "Write a long essay about Norwegian mortgages" },
        { id: "s2", role: "assistant", text: "Norwegian mortgages are mostly floating-rate, which means", state: "stopped" },
      ]}
    />
  ),
}

export const Phone: Story = {
  name: "Phone",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <div className="mx-auto w-[375px] border-x">
      <ChatScreen className="h-[700px]" />
    </div>
  ),
}

export const RoundTrip: Story = {
  name: "Test: send and get a reply",
  tags: ["test"],
  render: () => <ChatScreen initial={[]} className="h-[640px]" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    typeText(canvas.getByRole("textbox", { name: "Message" }), "Hello")
    await userEvent.keyboard("{Enter}")
    await expect(await canvas.findByText("Hello")).toBeVisible()
    await expect(await canvas.findByRole("button", { name: "Stop" })).toBeVisible()
    await waitFor(() => expect(canvas.getByText("Searched transactions")).toBeVisible(), { timeout: 4000 })
    await waitFor(() => expect(canvas.getByRole("button", { name: "Send" })).toBeInTheDocument(), { timeout: 6000 })
    await expect(canvas.getByText(/Anything else you'd like to check/)).toBeVisible()
  },
}

export const StopMidReply: Story = {
  name: "Test: stop mid-reply",
  tags: ["test"],
  render: () => <ChatScreen initial={[]} className="h-[640px]" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    typeText(canvas.getByRole("textbox", { name: "Message" }), "Tell me everything")
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(canvas.getByText("Searched transactions")).toBeVisible(), { timeout: 4000 })
    await userEvent.click(canvas.getByRole("button", { name: "Stop" }))
    await expect(await canvas.findByText("You stopped this reply")).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Send" })).toBeInTheDocument()
  },
}

/** Edit a message or retry a reply to make a new version; the arrows switch between them. */
export const Branched: Story = {
  name: "Edited and retried (versions)",
  render: () => (
    <ChatScreen
      initial={[
        { id: "b1", parentId: null, role: "user", text: "How much did I spend on eating out?" },
        { id: "b2", parentId: "b1", role: "assistant", text: "Which month do you mean?" },
        { id: "b3", parentId: null, role: "user", text: "How much did I spend on eating out in September?" },
        { id: "b4", parentId: "b3", role: "assistant", text: "About kr 1 500, give or take." },
        { id: "b5", parentId: "b3", role: "assistant", text: seed[1].text, tool: seed[1].tool },
      ]}
    />
  ),
}

// A sidebar of conversations next to the chat. Forking a reply opens a copy
// of the conversation up to that reply.
function ChatWithSessions({ className = "h-svh" }: { className?: string }) {
  const { sessions, setSessions, activeId, setActiveId, props } = useDemoSessions(
    sampleSessions.filter((s) => s.status !== "running"),
  )
  const threads = React.useRef<Record<string, Turn[]>>({})
  const open = sessions.find((s) => s.id === activeId)

  function create(title: string, turns: Turn[]) {
    const id = `chat-${crypto.randomUUID()}`
    threads.current[id] = turns
    setSessions((list) => [{ id, title, updatedAt: now.getTime() }, ...list])
    setActiveId(id)
  }

  return (
    <SidebarProvider className={`min-h-0 ${className}`}>
      <Sidebar collapsible="offcanvas" className="absolute h-full">
        <SidebarHeader>
          <Button variant="outline" className="justify-start" onClick={() => create("New chat", [])}>
            <PlusIcon />
            New chat
          </Button>
        </SidebarHeader>
        <SidebarContent className="px-2 pb-2">
          <DemoSessionList
            {...props}
            onFork={(id) => {
              const source = sessions.find((s) => s.id === id)
              create(`${source?.title} (fork)`, threads.current[id] ?? seed)
            }}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0 min-w-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <h2 className="truncate text-sm font-medium">{open?.title ?? "New chat"}</h2>
        </header>
        <ChatScreen
          key={activeId}
          className="min-h-0 flex-1"
          initial={(activeId ? threads.current[activeId] : undefined) ?? seed}
          onTurnsChange={(turns) => {
            if (activeId) threads.current[activeId] = turns
          }}
          onFork={(path) => create(`${open?.title ?? "Chat"} (fork)`, path.map((t) => ({ ...t, parentId: undefined })))}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}

export const WithSessions: Story = {
  name: "With sessions sidebar",
  render: () => <ChatWithSessions />,
}

export const EditAndSwitch: Story = {
  name: "Test: edit a message, switch versions",
  tags: ["test"],
  render: () => <ChatScreen className="h-[640px]" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getAllByRole("button", { name: "Edit" })[0])
    const editor = canvas.getByRole("textbox", { name: "Edit message" }) as HTMLTextAreaElement
    fireEvent.input(editor, { target: { value: "What about October?" } })
    await userEvent.keyboard("{Enter}")

    await expect(await canvas.findByText("What about October?")).toBeVisible()
    await expect(canvas.queryByText("Compare it with August for every category")).toBeNull()
    await waitFor(() => expect(canvas.getByText(/Anything else you'd like to check/)).toBeVisible(), { timeout: 6000 })

    await userEvent.click(canvas.getByRole("button", { name: "Previous version" }))
    await expect(canvas.getByText("How much did I spend on eating out in September?")).toBeVisible()
    await expect(canvas.getByText("Compare it with August for every category")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Next version" }))
    await expect(canvas.getByText("What about October?")).toBeVisible()
  },
}

export const RetryReply: Story = {
  name: "Test: retry a reply",
  tags: ["test"],
  render: () => <ChatScreen className="h-[640px]" initial={seed.slice(0, 2)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }))
    await waitFor(() => expect(canvas.getByText(/Anything else you'd like to check/)).toBeVisible(), { timeout: 6000 })
    await expect(canvas.getByText(/2 \/ 2/)).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Previous version" }))
    await expect(canvas.getByText(/kr 400 less than in August/)).toBeVisible()
  },
}

export const ForkIntoSession: Story = {
  name: "Test: fork a reply into a new session",
  tags: ["test"],
  render: () => <ChatWithSessions className="h-[640px]" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getAllByRole("button", { name: "Fork from here" })[0])
    const row = await canvas.findByRole("button", { name: /\(fork\)/ })
    await expect(row).toHaveAttribute("aria-current", "page")
    await expect(canvas.getByText(/kr 400 less than in August/)).toBeVisible()
    await expect(canvas.queryByText("Compare it with August for every category")).toBeNull()
  },
}
