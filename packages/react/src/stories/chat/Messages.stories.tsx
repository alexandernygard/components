import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import {
  FileSpreadsheetIcon,
  FileTextIcon,
  RefreshCwIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TriangleAlertIcon,
} from "lucide-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageCopyAction,
  MessageEditAction,
  MessageEditor,
  MessageFooter,
  MessageForkAction,
  MessageHeader,
  MessageRetryAction,
  MessageVersions,
} from "@/components/ui/message"
import { Spinner } from "@/components/ui/spinner"
import { ToolCallLine } from "@/components/ui/tool-call"
import { Trace, TraceDescription, TraceIcon, TraceTitle } from "@/components/ui/trace"

import { longReply, longWord, markdownReply, unbrokenText, useStreamedText } from "./fixtures"
import { typeText } from "./test-utils"

const meta = {
  title: "Chat/Messages",
  parameters: { layout: "padded" },
  args: { onRetry: fn(), onEdit: fn(), onFork: fn() },
  decorators: [
    (Story) => (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<{ onRetry: () => void; onEdit: (text: string) => void; onFork: (messageId: string) => void }>

export default meta
type Story = StoryObj<typeof meta>

// The two shapes used throughout: the user in a soft bubble on the right, the
// assistant as plain text on the left with actions under it.
function UserMessage({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <Message align="end">
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent className="rounded-2xl px-4 py-2.5 text-[0.9375rem] whitespace-pre-wrap">
            {children}
          </BubbleContent>
        </Bubble>
        {footer}
      </MessageContent>
    </Message>
  )
}

function AssistantMessage({
  text,
  streaming,
  actions = "hover",
  children,
}: {
  text: string
  streaming?: boolean
  actions?: "hover" | "always" | false
  children?: React.ReactNode
}) {
  return (
    <Message>
      <MessageContent>
        {children}
        <Markdown streaming={streaming} className="text-[0.9375rem]">
          {text}
        </Markdown>
        {actions && !streaming && <ReplyActions text={text} visibility={actions} />}
      </MessageContent>
    </Message>
  )
}

function ReplyActions({
  text,
  visibility = "always",
  onRetry,
}: {
  text: string
  visibility?: "hover" | "always"
  onRetry?: () => void
}) {
  const [vote, setVote] = React.useState<"up" | "down" | null>(null)

  return (
    <MessageActions visibility={visibility}>
      <MessageCopyAction text={text} />
      <MessageAction
        tooltip="Good response"
        aria-label="Good response"
        aria-pressed={vote === "up"}
        onClick={() => setVote((v) => (v === "up" ? null : "up"))}
      >
        <ThumbsUpIcon className={vote === "up" ? "fill-current" : undefined} />
      </MessageAction>
      <MessageAction
        tooltip="Bad response"
        aria-label="Bad response"
        aria-pressed={vote === "down"}
        onClick={() => setVote((v) => (v === "down" ? null : "down"))}
      >
        <ThumbsDownIcon className={vote === "down" ? "fill-current" : undefined} />
      </MessageAction>
      <MessageRetryAction onClick={onRetry} />
    </MessageActions>
  )
}

// ---------------------------------------------------------------------------
// Basics

export const UserAndAssistant: Story = {
  name: "User and assistant",
  render: () => (
    <>
      <UserMessage>How much did I spend on eating out in September?</UserMessage>
      <AssistantMessage text="**kr 1 600** across 11 purchases. That's kr 400 less than in August, and the biggest was kr 480 at Mathallen on the 19th." />
    </>
  ),
}

export const RichMarkdown: Story = {
  name: "Rich markdown reply",
  render: () => (
    <>
      <UserMessage>Compare September with August</UserMessage>
      <AssistantMessage text={markdownReply} actions="always" />
    </>
  ),
}

export const Actions: Story = {
  render: () => (
    <>
      <p className="text-xs text-muted-foreground">
        Hover a reply to see its actions. They are always visible on touch screens.
      </p>
      <AssistantMessage text="First reply. Hover me." />
      <AssistantMessage text="Second reply, with actions always on." actions="always" />
      <UserMessage
        footer={
          <MessageActions visibility="hover">
            <MessageCopyAction text="A user message can have actions too" />
            <MessageEditAction />
          </MessageActions>
        }
      >
        A user message can have actions too
      </UserMessage>
    </>
  ),
}

export const Branches: Story = {
  name: "Regenerated replies (1 of 3)",
  render: function Render() {
    const replies = [
      "The first take: you're on track.",
      "A second take: you're slightly behind, by about kr 2 000.",
      "A third take, with more detail about the deposit and the mortgage.",
    ]
    const [index, setIndex] = React.useState(0)

    return (
      <Message>
        <MessageContent>
          <Markdown className="text-[0.9375rem]">{replies[index]}</Markdown>
          <MessageActions>
            <MessageVersions index={index} total={replies.length} onIndexChange={setIndex} />
            <MessageCopyAction text={replies[index]} />
            <MessageRetryAction />
          </MessageActions>
        </MessageContent>
      </Message>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button", { name: "Previous version" })).toBeDisabled()
    await userEvent.click(canvas.getByRole("button", { name: "Next version" }))
    await expect(canvas.getByText(/2 \/ 3/)).toBeVisible()
    await expect(canvas.getByText(/second take/)).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Next version" }))
    await expect(canvas.getByRole("button", { name: "Next version" })).toBeDisabled()
  },
}

// ---------------------------------------------------------------------------
// Editing and forking

export const EditingMessage: Story = {
  name: "Editing a message",
  render: () => (
    <>
      <Message align="end">
        <MessageContent>
          <MessageEditor
            defaultValue="How much did I spend on eating out in September?"
            onSave={() => {}}
            onCancel={() => {}}
          />
        </MessageContent>
      </Message>
      <AssistantMessage text="**kr 1 600** across 11 purchases." />
    </>
  ),
}

export const EditingLongMessage: Story = {
  name: "Editing a long message",
  render: () => (
    <Message align="end">
      <MessageContent>
        <MessageEditor defaultValue={longReply} onSave={() => {}} onCancel={() => {}} />
      </MessageContent>
    </Message>
  ),
}

type Version = { text: string; reply: string }

// A user message you can edit. Each edit is a new version with its own reply.
function EditableTurn({
  initial = [{ text: "How much did I spend on eating out in September?", reply: "**kr 1 600** across 11 purchases." }],
  onEdit,
  onFork,
}: {
  initial?: Version[]
  onEdit?: (text: string) => void
  onFork?: (messageId: string) => void
}) {
  const [versions, setVersions] = React.useState(initial)
  const [index, setIndex] = React.useState(initial.length - 1)
  const [editing, setEditing] = React.useState(false)
  const current = versions[index]

  return (
    <>
      <Message align="end">
        <MessageContent>
          {editing ? (
            <MessageEditor
              defaultValue={current.text}
              onCancel={() => setEditing(false)}
              onSave={(text) => {
                setVersions((list) => [...list, { text, reply: `A new answer for “${text}”.` }])
                setIndex(versions.length)
                setEditing(false)
                onEdit?.(text)
              }}
            />
          ) : (
            <>
              <Bubble variant="muted">
                <BubbleContent className="rounded-2xl px-4 py-2.5 text-[0.9375rem] whitespace-pre-wrap">
                  {current.text}
                </BubbleContent>
              </Bubble>
              <MessageActions visibility={versions.length > 1 ? "always" : "hover"}>
                <MessageVersions index={index} total={versions.length} onIndexChange={setIndex} />
                <MessageCopyAction text={current.text} />
                <MessageEditAction onClick={() => setEditing(true)} />
              </MessageActions>
            </>
          )}
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <Markdown className="text-[0.9375rem]">{current.reply}</Markdown>
          <MessageActions>
            <MessageCopyAction text={current.reply} />
            <MessageRetryAction />
            <MessageForkAction onClick={() => onFork?.(`reply-${index}`)} />
          </MessageActions>
        </MessageContent>
      </Message>
    </>
  )
}

/** Edit makes a new version of the message and its reply. The arrows move between them. */
export const EditedVersions: Story = {
  name: "Edited message with versions",
  render: (args) => (
    <EditableTurn
      onFork={args.onFork}
      initial={[
        { text: "How much did I spend on eating out?", reply: "Which month do you mean?" },
        { text: "How much did I spend on eating out in September?", reply: "**kr 1 600** across 11 purchases." },
      ]}
    />
  ),
}

export const EditMessage: Story = {
  name: "Test: edit a message",
  tags: ["test"],
  render: (args) => <EditableTurn onEdit={args.onEdit} onFork={args.onFork} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole("group", { name: "Versions" })).toBeNull()
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }))

    const editor = canvas.getByRole("textbox", { name: "Edit message" }) as HTMLTextAreaElement
    await expect(editor).toHaveFocus()
    await expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled()

    typeText(editor, " And August?")
    await expect(canvas.getByRole("button", { name: "Save" })).toBeEnabled()
    await userEvent.keyboard("{Enter}")

    await expect(args.onEdit).toHaveBeenCalledWith("How much did I spend on eating out in September? And August?")
    await expect(canvas.getByText(/2 \/ 2/)).toBeVisible()
    await expect(canvas.getByText(/A new answer for/)).toBeVisible()

    await userEvent.click(canvas.getByRole("button", { name: "Previous version" }))
    await expect(canvas.getByText("How much did I spend on eating out in September?")).toBeVisible()
    await expect(canvas.getByText("kr 1 600")).toBeVisible()
  },
}

export const EditCancel: Story = {
  name: "Test: cancel an edit",
  tags: ["test"],
  render: (args) => <EditableTurn onEdit={args.onEdit} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }))
    typeText(canvas.getByRole("textbox", { name: "Edit message" }) as HTMLTextAreaElement, " Never mind")
    await userEvent.keyboard("{Escape}")
    await expect(canvas.queryByRole("textbox", { name: "Edit message" })).toBeNull()

    await userEvent.click(canvas.getByRole("button", { name: "Edit" }))
    const editor = canvas.getByRole("textbox", { name: "Edit message" }) as HTMLTextAreaElement
    await expect(editor.value).toBe("How much did I spend on eating out in September?")
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }))
    await expect(args.onEdit).not.toHaveBeenCalled()
  },
}

export const ForkFromMessage: Story = {
  name: "Test: fork from a reply",
  tags: ["test"],
  render: (args) => <EditableTurn onFork={args.onFork} />,
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Fork from here" }))
    await expect(args.onFork).toHaveBeenCalledWith("reply-0")
  },
}


// ---------------------------------------------------------------------------
// States

export const Thinking: Story = {
  render: () => (
    <>
      <UserMessage>Am I on track for the deposit?</UserMessage>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">Thinking</MarkerContent>
      </Marker>
    </>
  ),
}

export const WithToolCalls: Story = {
  name: "With tool calls before the answer",
  render: () => (
    <>
      <UserMessage>Am I on track for the deposit?</UserMessage>
      <AssistantMessage text="Yes. At kr 9 500 a month you reach kr 630 000 in **May 2028**.">
        <Trace>
          <ToolCallLine status="output-available">
            <TraceIcon>
              <FileSpreadsheetIcon />
            </TraceIcon>
            <TraceTitle>Read transactions-2026.csv</TraceTitle>
            <TraceDescription>1 204 rows</TraceDescription>
          </ToolCallLine>
          <ToolCallLine status="output-available">
            <TraceIcon>
              <SparklesIcon />
            </TraceIcon>
            <TraceTitle>Ran the savings projection</TraceTitle>
          </ToolCallLine>
        </Trace>
      </AssistantMessage>
    </>
  ),
}

function StreamedReply({ onReplay }: { onReplay: () => void }) {
  const { text, done } = useStreamedText(markdownReply, { speed: 4, delay: 16 })

  return (
    <>
      <AssistantMessage text={text} streaming={!done} actions="always" />
      {done && (
        <Button variant="outline" size="sm" className="self-start" onClick={onReplay}>
          Replay
        </Button>
      )}
    </>
  )
}

/** Half-written markdown (an open table, a code fence) is closed while it streams. */
export const Streaming: Story = {
  render: function Render() {
    const [run, setRun] = React.useState(0)

    return (
      <>
        <UserMessage>Compare September with August</UserMessage>
        <StreamedReply key={run} onReplay={() => setRun((r) => r + 1)} />
      </>
    )
  },
}

export const StoppedEarly: Story = {
  name: "Stopped by the user",
  render: () => (
    <>
      <UserMessage>Write me a long essay about Norwegian mortgages</UserMessage>
      <Message>
        <MessageContent>
          <Markdown className="text-[0.9375rem]">
            {"Norwegian mortgages are mostly floating-rate, which means that when Norges Bank raises its policy rate"}
          </Markdown>
          <MessageFooter className="px-0 font-normal">You stopped this reply</MessageFooter>
        </MessageContent>
      </Message>
    </>
  ),
}

export const ErrorReply: Story = {
  name: "Error with retry",
  render: (args) => (
    <>
      <UserMessage>Summarise my September statement</UserMessage>
      <Message>
        <MessageContent>
          <Bubble variant="destructive">
            <BubbleContent className="flex items-start gap-2">
              <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
              <span>
                Something went wrong while reading the statement. The connection dropped before
                the reply finished.
              </span>
            </BubbleContent>
          </Bubble>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={args.onRetry}
            >
              <RefreshCwIcon />
              Try again
            </Button>
          </div>
        </MessageContent>
      </Message>
    </>
  ),
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Try again" }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}

export const Edited: Story = {
  name: "Edited message",
  render: () => (
    <UserMessage footer={<MessageFooter className="px-1 font-normal">Edited</MessageFooter>}>
      Actually, make it kr 12 000 a month
    </UserMessage>
  ),
}

export const EmptyReply: Story = {
  name: "Empty reply",
  render: () => (
    <>
      <UserMessage>…</UserMessage>
      <AssistantMessage text="" actions="always" />
    </>
  ),
}

// ---------------------------------------------------------------------------
// Content edge cases

export const WithAttachments: Story = {
  name: "User message with attachments",
  render: () => (
    <Message align="end">
      <MessageContent>
        <AttachmentGroup className="justify-end self-end">
          {[200, 40].map((hue) => (
            <Attachment key={hue} orientation="vertical" size="sm">
              <AttachmentMedia variant="image">
                <img
                  alt=""
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><rect width='10' height='10' fill='hsl(${hue} 55% 60%)'/></svg>`)}`}
                />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>IMG_{hue}.jpg</AttachmentTitle>
              </AttachmentContent>
            </Attachment>
          ))}
          <Attachment size="sm">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>lease-agreement.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 12 pages</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </AttachmentGroup>
        <Bubble variant="muted">
          <BubbleContent className="rounded-2xl px-4 py-2.5 text-[0.9375rem]">
            Does the lease say anything about painting the walls?
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  ),
}

export const UnbrokenText: Story = {
  name: "Long URLs and words",
  render: () => (
    <>
      <UserMessage>{unbrokenText}</UserMessage>
      <AssistantMessage text={`That link goes to \`${unbrokenText}\`.\n\n${longWord}`} actions="always" />
    </>
  ),
}

export const VeryLong: Story = {
  name: "Very long messages",
  render: () => (
    <>
      <UserMessage>{longReply.replace(/###\s/g, "")}</UserMessage>
      <AssistantMessage text={longReply} actions="always" />
    </>
  ),
}

export const ShortMessages: Story = {
  name: "One word and emoji only",
  render: () => (
    <>
      <UserMessage>ok</UserMessage>
      <AssistantMessage text="👍" />
      <UserMessage>🎉🎉🎉</UserMessage>
      <AssistantMessage text="Done." />
    </>
  ),
}

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl" lang="ar" className="flex flex-col gap-6">
      <UserMessage>كم أنفقت على المطاعم في سبتمبر؟</UserMessage>
      <AssistantMessage text="أنفقت **١٦٠٠ كرونة** على ١١ عملية شراء. هذا أقل بـ ٤٠٠ كرونة من أغسطس." actions="always" />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Other looks

export const AvatarsAndNames: Story = {
  name: "Avatars, names and timestamps",
  render: () => (
    <>
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>
              <SparklesIcon className="size-3.5" />
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Claude · 09:41</MessageHeader>
          <BubbleGroup>
            <Bubble variant="secondary">
              <BubbleContent>kr 1 600 across 11 purchases.</BubbleContent>
            </Bubble>
            <Bubble variant="secondary">
              <BubbleContent>The biggest was kr 480 at Mathallen on the 19th.</BubbleContent>
            </Bubble>
          </BubbleGroup>
          <MessageFooter>2 sources</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>You · 09:42</MessageHeader>
          <Bubble>
            <BubbleContent>Nice. Set October's limit to kr 1 500.</BubbleContent>
            <BubbleReactions>👍</BubbleReactions>
          </Bubble>
        </MessageContent>
      </Message>
    </>
  ),
}

export const BubbleVariants: Story = {
  name: "Bubble variants",
  render: () => (
    <>
      {(["default", "secondary", "muted", "tinted", "outline", "destructive", "ghost"] as const).map((v, i) => (
        <Bubble key={v} variant={v} align={i % 2 ? "end" : "start"}>
          <BubbleContent>
            <span className="font-medium">{v}</span>: the quick brown fox jumps over the lazy dog.
          </BubbleContent>
        </Bubble>
      ))}
    </>
  ),
}

export const Markers: Story = {
  name: "Markers and separators",
  render: () => (
    <>
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Read september-statement.pdf</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Conversation compacted to free up context</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">Updating the budget</MarkerContent>
      </Marker>
    </>
  ),
}

// ---------------------------------------------------------------------------
// Interactions

export const CopyReply: Story = {
  name: "Test: copy a reply",
  tags: ["test"],
  render: () => <AssistantMessage text="Copy this text" actions="always" />,
  play: async ({ canvasElement }) => {
    const writeText = fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })

    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Copy" }))
    await expect(writeText).toHaveBeenCalledWith("Copy this text")
    await expect(canvas.getByRole("button", { name: "Copied" })).toBeVisible()
    await waitFor(() => expect(canvas.getByRole("button", { name: "Copy" })).toBeVisible(), { timeout: 3000 })
  },
}

export const VoteOnReply: Story = {
  name: "Test: thumbs up and down",
  tags: ["test"],
  render: () => <AssistantMessage text="Rate me" actions="always" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const up = canvas.getByRole("button", { name: "Good response" })
    const down = canvas.getByRole("button", { name: "Bad response" })
    await userEvent.click(up)
    await expect(up).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(down)
    await expect(up).toHaveAttribute("aria-pressed", "false")
    await expect(down).toHaveAttribute("aria-pressed", "true")
  },
}

export const ActionsRevealOnHover: Story = {
  name: "Test: actions show on hover",
  tags: ["test"],
  render: () => <AssistantMessage text="Hover to reveal" />,
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole("toolbar")
    await expect(getComputedStyle(toolbar).opacity).toBe("0")
    // :hover can't be faked from a script, so keyboard focus stands in for it.
    await userEvent.tab()
    await waitFor(() => expect(getComputedStyle(toolbar).opacity).toBe("1"))
  },
}
