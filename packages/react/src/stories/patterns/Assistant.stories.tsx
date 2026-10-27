import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { ArrowUpIcon, PaperclipIcon, SearchIcon, SparklesIcon } from "lucide-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Spinner } from "@/components/ui/spinner"
import {
  ToolTrace,
  ToolViewsProvider,
  defineToolView,
  defineToolViews,
  type ToolCallData,
} from "@/components/ui/tool-views"

const meta = {
  title: "Patterns/Assistant",
  parameters: { layout: "centered" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Msg = { id: string; role: "user" | "assistant"; text: string; tools?: ToolCallData[] }

const views = defineToolViews({
  project_savings: defineToolView<
    { saved: number; monthly: number; target: number },
    { month: string; balance: number }[]
  >({
    icon: SearchIcon,
    title: "Ran the savings projection",
    summary: (output) => `reached ${output[output.length - 1].month}`,
    input: "keyvalue",
    output: "table",
  }),
})

const seed: Msg[] = [
  { id: "1", role: "user", text: "Can I afford a kr 4.2M flat if I keep saving like this?" },
  {
    id: "2",
    role: "assistant",
    tools: [
      {
        toolCallId: "t1",
        toolName: "project_savings",
        state: "output-available",
        input: { saved: 412000, monthly: 9500, target: 630000 },
        output: [
          { month: "2026-12", balance: 431000 },
          { month: "2027-06", balance: 488000 },
          { month: "2027-12", balance: 545000 },
          { month: "2028-05", balance: 630000 },
        ],
      },
    ],
    text: "With kr 412 000 saved and kr 9 500 a month, you reach a 15% deposit (kr 630 000) in May 2028.\n\nA kr 3.57M mortgage at 5.1% over 30 years costs about kr 19 400 a month, which is kr 2 900 more than your rent today.",
  },
  { id: "3", role: "user", text: "What if I put away kr 12 000 instead?" },
  {
    id: "4",
    role: "assistant",
    text: "Then you'd hit the deposit in November 2027, six months sooner. You'd still have kr 3 100 left for eating out each month based on September.",
  },
]

export const Chat: Story = {
  render: function Render() {
    const [messages, setMessages] = React.useState(seed)
    const [draft, setDraft] = React.useState("")
    const [thinking, setThinking] = React.useState(false)

    function send(e: React.FormEvent) {
      e.preventDefault()
      if (!draft.trim()) return
      const id = String(messages.length + 1)
      setMessages((m) => [...m, { id, role: "user", text: draft }])
      setDraft("")
      setThinking(true)
      setTimeout(() => {
        setThinking(false)
        setMessages((m) => [
          ...m,
          { id: id + "a", role: "assistant", text: "This is a demo, so there's no real answer. The layout is what's on show." },
        ])
      }, 1400)
    }

    return (
      <Card className="h-[38rem] w-[30rem]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-muted-foreground" />
            Ask about your money
          </CardTitle>
          <CardDescription>Answers use your transactions and savings plan.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
          <ToolViewsProvider views={views}>
            <MessageScrollerProvider>
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="gap-5 p-(--card-spacing)">
                    {messages.map((m) => (
                      <MessageScrollerItem key={m.id} messageId={m.id} scrollAnchor={m.role === "user"}>
                        <Message align={m.role === "user" ? "end" : "start"}>
                          <MessageContent>
                            {m.tools && <ToolTrace tools={m.tools} />}
                            <Bubble variant={m.role === "user" ? "default" : "ghost"}>
                              <BubbleContent className="whitespace-pre-wrap">{m.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))}
                    {thinking && (
                      <MessageScrollerItem scrollAnchor={false}>
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
          </ToolViewsProvider>
        </CardContent>
        <CardFooter className="border-t">
          <form onSubmit={send} className="w-full">
            <InputGroup>
              <InputGroupTextarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) send(e)
                }}
                placeholder="Ask anything about your budget"
                className="min-h-12"
              />
              <InputGroupAddon align="block-end">
                <InputGroupButton size="icon-xs" variant="ghost" aria-label="Attach a file">
                  <PaperclipIcon />
                </InputGroupButton>
                <InputGroupButton
                  type="submit"
                  size="icon-xs"
                  variant="default"
                  className="ml-auto rounded-full"
                  aria-label="Send"
                  disabled={!draft.trim()}
                >
                  <ArrowUpIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </CardFooter>
      </Card>
    )
  },
}

export const Suggestions: Story = {
  render: () => (
    <div className="grid w-[30rem] gap-3">
      <p className="font-heading text-2xl">What would you like to know?</p>
      <div className="flex flex-wrap gap-2">
        {["Where did my money go in September?", "Am I on track for the deposit?", "Find subscriptions I forgot about"].map(
          (s) => (
            <Button key={s} variant="outline" size="sm" className="rounded-full">
              {s}
            </Button>
          ),
        )}
      </div>
    </div>
  ),
}
