import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import {
  FileSearchIcon,
  FileTextIcon,
  PiggyBankIcon,
  ReceiptIcon,
  RefreshCwIcon,
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
import { Markdown } from "@/components/ui/markdown"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageCopyAction,
  MessageFooter,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Spinner } from "@/components/ui/spinner"
import { ToolCallLine, type ToolCallStatus } from "@/components/ui/tool-call"
import { Trace, TraceIcon, TraceTitle } from "@/components/ui/trace"

import { DemoComposer, longReply, markdownReply } from "./fixtures"
import { typeText } from "./test-utils"

const meta = {
  title: "Chat/Conversation",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Turn = {
  id: string
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

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function TurnView({ turn, onRetry }: { turn: Turn; onRetry: () => void }) {
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
          {turn.text && (
            <Bubble variant="muted">
              <BubbleContent className="rounded-2xl px-4 py-2.5 text-[0.9375rem] whitespace-pre-wrap">
                {turn.text}
              </BubbleContent>
            </Bubble>
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
          <MessageActions visibility="hover">
            <MessageCopyAction text={turn.text} />
            <MessageAction tooltip="Retry" aria-label="Retry" onClick={onRetry}>
              <RefreshCwIcon />
            </MessageAction>
          </MessageActions>
        )}
      </MessageContent>
    </Message>
  )
}

const reply =
  "This is a demo, so the numbers are made up. Here's the shape of a typical answer:\n\n- A short **summary** first\n- Then the details, with `code` where it helps\n\nAnything else you'd like to check?"

// A whole chat screen with a fake assistant: it "searches", then streams.
function ChatScreen({
  initial = seed,
  empty,
  className = "h-svh",
}: {
  initial?: Turn[]
  empty?: React.ReactNode
  className?: string
}) {
  const [turns, setTurns] = React.useState(initial)
  const [status, setStatus] = React.useState<"idle" | "submitted" | "streaming">("idle")
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function later(ms: number, run: () => void) {
    timers.current.push(setTimeout(run, ms))
  }

  function updateLast(patch: (t: Turn) => Turn) {
    setTurns((list) => [...list.slice(0, -1), patch(list[list.length - 1])])
  }

  function respond() {
    setStatus("submitted")
    later(500, () => {
      setTurns((list) => [
        ...list,
        { id: crypto.randomUUID(), role: "assistant", text: "", state: "streaming", tool: { title: "Searching transactions", status: "running" } },
      ])
    })
    later(1600, () => {
      setStatus("streaming")
      updateLast((t) => ({ ...t, tool: { title: "Searched transactions", status: "output-available" } }))
      let length = 0
      const tick = () => {
        length += 3
        updateLast((t) => ({ ...t, text: reply.slice(0, length) }))
        if (length < reply.length) later(18, tick)
        else {
          updateLast((t) => ({ ...t, state: undefined }))
          setStatus("idle")
        }
      }
      tick()
    })
  }

  return (
    <div className={`flex flex-col bg-background ${className}`}>
      <MessageScrollerProvider>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-3xl gap-8 px-4 pt-10 pb-6">
              {turns.length === 0 && empty}
              {turns.map((turn) => (
                <MessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === "user"}>
                  <TurnView turn={turn} onRetry={respond} />
                </MessageScrollerItem>
              ))}
              {status === "submitted" && turns[turns.length - 1]?.role === "user" && (
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
          onSubmit={({ text, files }) => {
            setTurns((list) => [
              ...list,
              { id: crypto.randomUUID(), role: "user", text, files: files.map((f) => ({ name: f.name, size: f.size })) },
            ])
            respond()
          }}
          onStop={() => {
            timers.current.forEach(clearTimeout)
            timers.current = []
            setTurns((list) => {
              const last = list[list.length - 1]
              return last?.role === "assistant" && last.state === "streaming"
                ? [...list.slice(0, -1), { ...last, state: "stopped", tool: last.tool && { ...last.tool, status: "output-available" } }]
                : list
            })
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
