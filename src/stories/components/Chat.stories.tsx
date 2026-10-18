import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileSpreadsheetIcon, FileTextIcon, ImageIcon, SparklesIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import { Spinner } from "@/components/ui/spinner"

const meta = {
  title: "Components/Chat",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Conversation: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-6">
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>How much did I spend on eating out in September?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>
              <SparklesIcon className="size-3.5" />
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>kr 1 600 across 11 purchases. That's kr 400 less than in August.</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>The biggest was kr 480 at Mathallen on the 19th.</BubbleContent>
            </Bubble>
          </BubbleGroup>
          <MessageFooter>2 sources</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Nice. Set October's limit to kr 1 500.</BubbleContent>
            <BubbleReactions>👍</BubbleReactions>
          </Bubble>
        </MessageContent>
      </Message>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">Updating the budget</MarkerContent>
      </Marker>
    </div>
  ),
}

export const BubbleVariants: Story = {
  name: "Bubble variants",
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      {(["default", "secondary", "muted", "tinted", "outline", "destructive", "ghost"] as const).map((v) => (
        <Bubble key={v} variant={v} align={v === "tinted" ? "end" : "start"}>
          <BubbleContent>
            <span className="font-medium">{v}</span>: the quick brown fox jumps over the lazy dog.
          </BubbleContent>
        </Bubble>
      ))}
    </div>
  ),
}

export const Markers: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Marker>
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Read september-statement.pdf</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerContent className="shimmer">Thinking</MarkerContent>
      </Marker>
    </div>
  ),
}

const files = [
  { icon: FileTextIcon, name: "september-statement.pdf", meta: "PDF, 2.4 MB", state: "done" as const },
  { icon: FileSpreadsheetIcon, name: "transactions-2026.csv", meta: "Uploading, 64%", state: "uploading" as const },
  { icon: ImageIcon, name: "receipt.heic", meta: "This file type isn't supported", state: "error" as const },
]

export const Attachments: Story = {
  render: () => (
    <div className="grid max-w-md gap-6">
      <AttachmentGroup className="flex-col">
        {files.map((f) => (
          <Attachment key={f.name} state={f.state} className="w-full">
            <AttachmentMedia>
              <f.icon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{f.name}</AttachmentTitle>
              <AttachmentDescription>{f.meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${f.name}`}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </AttachmentGroup>
      <AttachmentGroup>
        {["Living room", "Kitchen"].map((room) => (
          <Attachment key={room} orientation="vertical" size="sm">
            <AttachmentMedia variant="image">
              <img
                src={`https://images.unsplash.com/photo-${room === "Kitchen" ? "1556911220-bff31c812dba" : "1586023492125-27b2c045efd7"}?w=200&q=70`}
                alt=""
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{room}.jpg</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  ),
}
