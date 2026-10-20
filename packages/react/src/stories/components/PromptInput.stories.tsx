import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Markdown } from "@/components/ui/markdown"
import { Message, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  PromptInput,
  PromptInputAttachButton,
  PromptInputAttachments,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"

const meta = {
  title: "Components/Prompt input",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const answer =
  "You spent **kr 1 600** on eating out in September:\n\n- kr 900 on weekday lunches\n- kr 700 on two dinners\n\nThat's `kr 400` less than August."

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <PromptInput accept="image/*,.csv,.pdf" onSubmit={(message) => console.log(message)}>
        <PromptInputAttachments />
        <PromptInputTextarea placeholder="Ask anything about your budget" />
        <PromptInputFooter>
          <PromptInputAttachButton />
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
      <p className="mt-2 text-xs text-muted-foreground">
        Enter sends, Shift+Enter adds a line. Paste or drop images, CSV or PDF files.
      </p>
    </div>
  ),
}

export const WithStreamingReply: Story = {
  name: "With a streaming reply",
  render: function Render() {
    const [messages, setMessages] = React.useState<{ role: "user" | "assistant"; text: string }[]>([])
    const [status, setStatus] = React.useState<"idle" | "submitted" | "streaming">("idle")
    const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

    function stream(length: number) {
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", text: answer.slice(0, length) }])
      if (length >= answer.length) {
        setStatus("idle")
        return
      }
      timer.current = setTimeout(() => stream(length + 2), 25)
    }

    return (
      <div className="grid max-w-xl gap-4">
        {messages.map((m, i) => (
          <Message key={i} align={m.role === "user" ? "end" : "start"}>
            <MessageContent>
              <Bubble variant={m.role === "user" ? "default" : "ghost"}>
                <BubbleContent>
                  <Markdown streaming={status === "streaming" && i === messages.length - 1}>
                    {m.text}
                  </Markdown>
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        ))}
        <PromptInput
          status={status}
          onSubmit={({ text }) => {
            setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: "" }])
            setStatus("submitted")
            timer.current = setTimeout(() => {
              setStatus("streaming")
              stream(0)
            }, 600)
          }}
          onStop={() => {
            clearTimeout(timer.current)
            setStatus("idle")
          }}
        >
          <PromptInputAttachments />
          <PromptInputTextarea placeholder="Ask about eating out" />
          <PromptInputFooter>
            <PromptInputAttachButton />
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </div>
    )
  },
}
