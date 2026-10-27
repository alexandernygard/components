import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fireEvent, fn, screen, userEvent, waitFor, within } from "storybook/test"
import { GlobeIcon, ImageIcon } from "lucide-react"

import {
  PromptInput,
  PromptInputAttachButton,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSpacer,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"

import { DemoComposer, docFile, imageFile, manyFiles, sampleFiles } from "./fixtures"
import { dragFilesOver, dropFiles, pasteFiles, typeText } from "./test-utils"

const meta = {
  title: "Chat/Composer",
  component: DemoComposer,
  parameters: { layout: "padded" },
  args: {
    onSubmit: fn(),
    onStop: fn(),
    onFilesRejected: fn(),
    status: "idle",
    disabled: false,
    showBar: true,
    showModelPicker: true,
  },
  argTypes: {
    status: { control: "inline-radio", options: ["idle", "submitted", "streaming"] },
    defaultFiles: { control: false },
    fileStatus: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto flex min-h-[26rem] max-w-2xl flex-col justify-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DemoComposer>

export default meta
type Story = StoryObj<typeof meta>

const textbox = (canvas: HTMLElement) =>
  within(canvas).getByRole<HTMLTextAreaElement>("textbox", { name: "Message" })
const box = (canvas: HTMLElement) => canvas.querySelector("[data-slot=prompt-input-box]")!

// ---------------------------------------------------------------------------
// Looks

/** The whole thing: "+" menu, model and effort, dictation, send, and the bar with project, mode and context usage. */
export const Default: Story = {}

export const Empty: Story = {
  name: "Empty (send disabled)",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
    typeText(textbox(canvasElement), "   ")
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
  },
}

export const WithDraft: Story = {
  name: "With a draft",
  args: { defaultValue: "Can you look at why the composer's footer jumps when I attach a file?" },
}

export const LongDraft: Story = {
  name: "Long draft (grows, then scrolls)",
  args: {
    defaultValue: Array.from({ length: 24 }, (_, i) => `Line ${i + 1}: some pasted log output or a long prompt`).join("\n"),
  },
}

export const UnbrokenDraft: Story = {
  name: "Unbroken text",
  args: {
    defaultValue:
      "https://example.com/a/really/long/url/that/has/no/spaces/and/must/wrap/inside/the/text/box/without/pushing/the/buttons/away?q=abcdefghijklmnopqrstuvwxyz0123456789",
  },
}

export const WithAttachments: Story = {
  args: { defaultFiles: sampleFiles(), defaultValue: "What stands out in these?" },
}

export const ManyAttachments: Story = {
  name: "Many attachments (scrolls sideways)",
  args: { defaultFiles: manyFiles() },
}

export const UploadStates: Story = {
  name: "Uploading and failed files",
  args: {
    defaultFiles: [
      imageFile("photo.svg", 30),
      docFile("statement.pdf", 2_400_000),
      docFile("receipt.heic", 3_100_000, "image/heic"),
    ],
    fileStatus: (file) =>
      file.name === "statement.pdf"
        ? { state: "uploading", description: "Uploading, 64%" }
        : file.name === "receipt.heic"
          ? { state: "error", description: "This file type isn't supported" }
          : undefined,
  },
}

export const Submitted: Story = {
  name: "Waiting for a reply",
  args: { status: "submitted" },
}

export const Streaming: Story = {
  name: "Streaming (stop button)",
  args: { status: "streaming", defaultValue: "Next question, typed while the reply streams" },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: "You've reached the message limit until 14:00" },
}

export const NearContextLimit: Story = {
  name: "Near the context limit",
  args: { usage: { used: 171_000, limit: 200_000 } },
}

export const ContextFull: Story = {
  name: "Context full",
  args: { usage: { used: 198_400, limit: 200_000 } },
}

export const NoBar: Story = {
  name: "Without the bar",
  args: { showBar: false },
}

export const Narrow: Story = {
  name: "Narrow (phone)",
  decorators: [
    (Story) => (
      <div className="w-[22rem]">
        <Story />
      </div>
    ),
  ],
}

/** The bare parts, for a simple assistant: attach, text, send. */
export const Minimal: Story = {
  render: (args) => (
    <PromptInput onSubmit={args.onSubmit} accept="image/*,.csv,.pdf">
      <PromptInputAttachments />
      <PromptInputTextarea placeholder="Ask anything about your budget" aria-label="Message" />
      <PromptInputFooter>
        <PromptInputAttachButton tooltip="Attach files" />
        <PromptInputButton tooltip="Search the web" aria-label="Search the web">
          <GlobeIcon />
        </PromptInputButton>
        <PromptInputButton tooltip="Generate an image" aria-label="Generate an image">
          <ImageIcon />
        </PromptInputButton>
        <PromptInputSpacer />
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  ),
}

// ---------------------------------------------------------------------------
// Interactions

export const SendWithEnter: Story = {
  name: "Test: Enter sends and clears",
  tags: ["test"],
  play: async ({ canvasElement, args }) => {
    const input = textbox(canvasElement)
    typeText(input, "Hello there")
    await userEvent.keyboard("{Enter}")
    await expect(args.onSubmit).toHaveBeenCalledWith({ text: "Hello there", files: [] })
    await expect(input).toHaveValue("")
  },
}

export const SendWithButton: Story = {
  name: "Test: send button",
  tags: ["test"],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    typeText(textbox(canvasElement), "Via the button")
    const send = canvas.getByRole("button", { name: "Send" })
    await expect(send).toBeEnabled()
    await userEvent.click(send)
    await expect(args.onSubmit).toHaveBeenCalledWith({ text: "Via the button", files: [] })
  },
}

export const ShiftEnterNewLine: Story = {
  name: "Test: Shift+Enter adds a line",
  tags: ["test"],
  play: async ({ canvasElement, args }) => {
    const input = textbox(canvasElement)
    typeText(input, "first")
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}")
    await expect(args.onSubmit).not.toHaveBeenCalled()
    typeText(input, "second")
    await expect(input).toHaveValue("first\nsecond")
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ImeComposition: Story = {
  name: "Test: Enter while composing (IME) doesn't send",
  tags: ["test"],
  play: async ({ canvasElement, args }) => {
    const input = textbox(canvasElement)
    typeText(input, "にほんご")
    fireEvent.keyDown(input, { key: "Enter", isComposing: true })
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const AttachFromMenu: Story = {
  name: "Test: attach from the + menu, then remove",
  tags: ["test"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Add files and more" }))
    const item = await screen.findByRole("menuitem", { name: /Add files or photos/ })
    await waitFor(() => expect(item).toBeVisible())
    await userEvent.keyboard("{Escape}")
    // The page stays aria-hidden until the menu has animated out.
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())

    const picker = canvasElement.querySelector<HTMLInputElement>("[data-slot=prompt-input-file-input]")!
    await userEvent.upload(picker, [docFile("notes.pdf", 12_000)])
    await expect(canvas.getByText("notes.pdf")).toBeVisible()

    await userEvent.click(canvas.getByRole("button", { name: "Remove notes.pdf" }))
    await expect(canvas.queryByText("notes.pdf")).toBeNull()
  },
}

export const PasteImage: Story = {
  name: "Test: paste an image",
  tags: ["test"],
  play: async ({ canvasElement }) => {
    pasteFiles(textbox(canvasElement), [imageFile("pasted.svg", 300)])
    await expect(await within(canvasElement).findByText("pasted.svg")).toBeVisible()
  },
}

export const DropFiles: Story = {
  name: "Test: drag and drop files",
  tags: ["test"],
  play: async ({ canvasElement }) => {
    const files = [docFile("dropped.csv", 4_000, "text/csv")]
    dragFilesOver(box(canvasElement), files)
    await expect(await within(canvasElement).findByText("Drop files to attach")).toBeInTheDocument()
    dropFiles(box(canvasElement), files)
    await expect(await within(canvasElement).findByText("dropped.csv")).toBeVisible()
    await expect(within(canvasElement).queryByText("Drop files to attach")).toBeNull()
  },
}

export const RejectsFileTypes: Story = {
  name: "Test: files outside `accept` are rejected",
  tags: ["test"],
  args: { accept: "image/*" },
  play: async ({ canvasElement, args }) => {
    dropFiles(box(canvasElement), [docFile("contract.pdf", 9_000), imageFile("ok.svg")])
    await expect(await within(canvasElement).findByText("ok.svg")).toBeVisible()
    await expect(within(canvasElement).queryByText("contract.pdf")).toBeNull()
    await expect(args.onFilesRejected).toHaveBeenCalledWith([expect.objectContaining({ name: "contract.pdf" })])
  },
}

export const SendFilesOnly: Story = {
  name: "Test: files without text can be sent",
  tags: ["test"],
  args: { defaultFiles: [docFile("only-a-file.pdf", 1000)] },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Send" }))
    await expect(args.onSubmit).toHaveBeenCalledWith({
      text: "",
      files: [expect.objectContaining({ name: "only-a-file.pdf" })],
    })
  },
}

export const StopStreaming: Story = {
  name: "Test: stop while streaming",
  tags: ["test"],
  args: { status: "streaming" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    typeText(textbox(canvasElement), "queued")
    await userEvent.keyboard("{Enter}")
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole("button", { name: "Stop" }))
    await expect(args.onStop).toHaveBeenCalledOnce()
  },
}

export const SlashCommands: Story = {
  name: "Test: slash commands",
  tags: ["test"],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = textbox(canvasElement)

    typeText(input, "/")
    const list = await canvas.findByRole("listbox", { name: "Commands" })
    await expect(within(list).getAllByRole("option").length).toBeGreaterThan(3)

    typeText(input, "re")
    await waitFor(() => expect(within(list).getAllByRole("option")).toHaveLength(2))
    await expect(within(list).getAllByRole("option")[0]).toHaveTextContent("/review")

    await userEvent.keyboard("{ArrowDown}")
    await expect(within(list).getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true")

    await userEvent.keyboard("{Enter}")
    await expect(input).toHaveValue("/security-review ")
    await expect(canvas.queryByRole("listbox")).toBeNull()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const SlashCommandsEscape: Story = {
  name: "Test: Escape closes slash commands",
  tags: ["test"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    typeText(textbox(canvasElement), "/xyz")
    await expect(await canvas.findByText("No matching commands")).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await expect(canvas.queryByText("No matching commands")).toBeNull()
  },
}

export const SlashFromMenu: Story = {
  name: "Test: Slash commands from the + menu",
  tags: ["test"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Add files and more" }))
    await userEvent.click(await screen.findByRole("menuitem", { name: "Slash commands" }))
    await expect(await canvas.findByRole("listbox", { name: "Commands" })).toBeVisible()
    await waitFor(() => expect(textbox(canvasElement)).toHaveFocus())
  },
}

export const SwitchModel: Story = {
  name: "Test: switch model and effort",
  tags: ["test"],
  play: async ({ canvasElement }) => {
    // Found by slot: the page is aria-hidden while a menu animates out.
    const trigger = canvasElement.querySelector<HTMLElement>("[data-slot=model-picker-trigger]")!
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("menuitemradio", { name: /Sonnet 5.5/ }))
    await waitFor(() => expect(trigger).toHaveAttribute("aria-label", "Model: Sonnet 5.5"))
    await expect(trigger).toHaveTextContent("Medium")

    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("radio", { name: "High" }))
    // Effort keeps the menu open, so more than one thing can be changed.
    await expect(screen.getByRole("menu")).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveTextContent("High"))
  },
}

export const OpenUsage: Story = {
  name: "Test: open context usage",
  tags: ["test"],
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /^Context:/ }))
    await expect(await screen.findByText("Context window")).toBeInTheDocument()
    await expect(screen.getByRole("meter", { name: "Context used" })).toHaveAttribute("aria-valuenow", "84200")
  },
}

/** Type and send to see the round trip: submitted, streaming, then idle again. */
export const Playground: Story = {
  render: function Render(args) {
    const [status, setStatus] = React.useState<"idle" | "submitted" | "streaming">("idle")
    const [sent, setSent] = React.useState<string[]>([])
    const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

    return (
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
          {sent.map((s, i) => (
            <li key={i} className="truncate">
              Sent: {s || "(files only)"}
            </li>
          ))}
          <li>Status: {status}</li>
        </ul>
        <DemoComposer
          {...args}
          status={status}
          onSubmit={(message) => {
            args.onSubmit?.(message)
            setSent((s) => [...s, message.text])
            setStatus("submitted")
            timers.current.push(setTimeout(() => setStatus("streaming"), 800))
            timers.current.push(setTimeout(() => setStatus("idle"), 3500))
          }}
          onStop={() => {
            timers.current.forEach(clearTimeout)
            setStatus("idle")
          }}
        />
      </div>
    )
  },
}
