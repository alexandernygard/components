// Shared data and demo pieces for the Chat stories.
import * as React from "react"
import {
  BugIcon,
  CheckIcon,
  FileSearchIcon,
  FolderIcon,
  FolderPlusIcon,
  GitBranchIcon,
  CircleDotIcon,
  LaptopIcon,
  MicIcon,
  PlugIcon,
  PuzzleIcon,
  ShieldCheckIcon,
  SlashSquareIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react"

import {
  ContextUsage,
  ContextUsageBreakdown,
  ContextUsageContent,
  ContextUsageRow,
  ContextUsageRows,
  ContextUsageSummary,
  ContextUsageTrigger,
} from "@/components/ui/context-usage"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ModelPicker,
  ModelPickerContent,
  ModelPickerGroup,
  ModelPickerItem,
  ModelPickerLabel,
  ModelPickerSegments,
  ModelPickerSeparator,
  ModelPickerTrigger,
  ModelPickerValue,
} from "@/components/ui/model-picker"
import {
  PromptInput,
  PromptInputActionAddFiles,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputAttachments,
  PromptInputBar,
  PromptInputBarButton,
  PromptInputButton,
  PromptInputCommands,
  PromptInputFooter,
  PromptInputSpacer,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInput,
  type PromptInputCommand,
  type PromptInputFileStatus,
  type PromptInputStatus,
} from "@/components/ui/prompt-input"

// ---------------------------------------------------------------------------
// Files

const svg = (hue: number, label: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 60% 70%)"/><stop offset="1" stop-color="hsl(${hue + 40} 55% 45%)"/></linearGradient></defs><rect width="240" height="180" fill="url(#g)"/><circle cx="180" cy="50" r="22" fill="hsl(${hue} 90% 92%)" opacity=".8"/><path d="M0 150 L70 90 L120 130 L170 80 L240 140 L240 180 L0 180Z" fill="hsl(${hue + 60} 40% 25%)" opacity=".55"/><text x="12" y="24" font-family="sans-serif" font-size="13" fill="white">${label}</text></svg>`

export function imageFile(name = "screenshot.svg", hue = 210) {
  return new File([svg(hue, name)], name, { type: "image/svg+xml", lastModified: hue })
}

export function docFile(name: string, size: number, type = "application/pdf") {
  return new File([new Uint8Array(size)], name, { type, lastModified: size })
}

export const sampleFiles = () => [
  imageFile("living-room.svg", 200),
  docFile("september-statement.pdf", 2_400_000),
  docFile("transactions-2026.csv", 84_000, "text/csv"),
]

export const manyFiles = () => [
  imageFile("IMG_0412.svg", 20),
  imageFile("IMG_0413.svg", 120),
  imageFile("IMG_0414.svg", 260),
  docFile("q3-board-deck-final-final-v7-with-appendix-and-notes.pdf", 14_800_000),
  docFile("notes.md", 2_300, "text/markdown"),
  docFile("schema.sql", 18_000, "application/sql"),
  docFile("data.json", 412_000, "application/json"),
  docFile("archive.zip", 48_000_000, "application/zip"),
]

// ---------------------------------------------------------------------------
// Models

export const models = [
  {
    id: "opus",
    name: "Opus 5.5",
    description: "Most capable for ambitious work",
  },
  {
    id: "sonnet",
    name: "Sonnet 5.5",
    description: "Smart, efficient model for everyday use",
  },
  {
    id: "haiku",
    name: "Haiku 5.5",
    description: "Fastest for quick answers",
  },
  {
    id: "fable",
    name: "Fable 5.1",
    description: "Experimental. May be slower and change without notice",
    badge: "Preview",
  },
]

export const efforts = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "max", label: "Max" },
]

export function DemoModelPicker({
  defaultModel = "opus",
  defaultEffort = "medium",
  showEffort = true,
  disabled,
}: {
  defaultModel?: string
  defaultEffort?: string
  showEffort?: boolean
  disabled?: boolean
}) {
  const [model, setModel] = React.useState(defaultModel)
  const [effort, setEffort] = React.useState(defaultEffort)
  const current = models.find((m) => m.id === model)

  return (
    <ModelPicker>
      <ModelPickerTrigger disabled={disabled} aria-label={`Model: ${current?.name}`}>
        <ModelPickerValue
          detail={showEffort ? efforts.find((e) => e.value === effort)?.label : undefined}
        >
          {current?.name}
        </ModelPickerValue>
      </ModelPickerTrigger>
      <ModelPickerContent>
        <ModelPickerLabel>Model</ModelPickerLabel>
        <ModelPickerGroup value={model} onValueChange={setModel}>
          {models.map((m) => (
            <ModelPickerItem
              key={m.id}
              value={m.id}
              title={m.name}
              description={m.description}
              badge={m.badge}
            />
          ))}
        </ModelPickerGroup>
        {showEffort && (
          <>
            <ModelPickerSeparator />
            <ModelPickerLabel>Effort</ModelPickerLabel>
            <ModelPickerSegments
              className="mx-1 mb-1"
              label="Effort"
              value={effort}
              onValueChange={setEffort}
              options={efforts}
            />
          </>
        )}
      </ModelPickerContent>
    </ModelPicker>
  )
}

// ---------------------------------------------------------------------------
// Usage

export function DemoUsage({
  used = 84_200,
  limit = 200_000,
  showLabel = false,
}: {
  used?: number
  limit?: number
  showLabel?: boolean
}) {
  return (
    <ContextUsage
      used={used}
      limit={limit}
      compactAt={0.8}
      segments={[
        { label: "Messages", tokens: Math.round(used * 0.62) },
        { label: "Tools", tokens: Math.round(used * 0.24) },
        { label: "System prompt", tokens: Math.round(used * 0.07) },
        { label: "Files", tokens: used - Math.round(used * 0.62) - Math.round(used * 0.24) - Math.round(used * 0.07) },
      ]}
    >
      <ContextUsageTrigger showLabel={showLabel} />
      <ContextUsageContent>
        <ContextUsageSummary title="Context" />
        <ContextUsageBreakdown />
        <ContextUsageRows>
          <ContextUsageRow label="Session cost">$1.84</ContextUsageRow>
          <ContextUsageRow label="Weekly limit">38% used</ContextUsageRow>
          <ContextUsageRow label="Resets">Thu 09:00</ContextUsageRow>
        </ContextUsageRows>
      </ContextUsageContent>
    </ContextUsage>
  )
}

// ---------------------------------------------------------------------------
// Commands

export const commands: PromptInputCommand[] = [
  { name: "review", description: "Review the current branch", icon: <FileSearchIcon /> },
  { name: "init", description: "Write a CLAUDE.md for this project", icon: <WandSparklesIcon /> },
  { name: "compact", description: "Summarise the conversation to free up context", icon: <SparklesIcon /> },
  { name: "security-review", description: "Look for vulnerabilities in pending changes", icon: <ShieldCheckIcon />, keywords: ["audit"] },
  { name: "debug", description: "Investigate a failing test or error", icon: <BugIcon /> },
  { name: "clear", description: "Start over with an empty context", icon: <SlashSquareIcon /> },
]

// ---------------------------------------------------------------------------
// The full composer

const connectors = ["Google Drive", "Linear", "Slack", "GitHub"]

function PlusMenu() {
  const { setValue, focus } = usePromptInput()
  const [enabled, setEnabled] = React.useState<string[]>(["Linear"])

  return (
    <PromptInputActionMenu>
      <PromptInputActionMenuTrigger tooltip="Add files and more" />
      <PromptInputActionMenuContent>
        <PromptInputActionAddFiles />
        <PromptInputActionMenuItem>
          <FolderPlusIcon />
          Add folder
        </PromptInputActionMenuItem>
        <PromptInputActionMenuItem>
          <CircleDotIcon />
          Import GitHub issue
        </PromptInputActionMenuItem>
        <PromptInputActionMenuItem
          onSelect={() => {
            setValue("/")
            focus()
          }}
        >
          <SlashSquareIcon />
          Slash commands
        </PromptInputActionMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PlugIcon />
            Connectors
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-52 rounded-xl p-1.5">
            {connectors.map((c) => (
              <DropdownMenuCheckboxItem
                key={c}
                checked={enabled.includes(c)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(on) =>
                  setEnabled((list) => (on ? [...list, c] : list.filter((x) => x !== c)))
                }
              >
                {c}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PuzzleIcon />
            Plugins
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-52 rounded-xl p-1.5">
            <DropdownMenuLabel>No plugins installed</DropdownMenuLabel>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </PromptInputActionMenuContent>
    </PromptInputActionMenu>
  )
}

const modes = [
  { value: "ask", label: "Ask before edits" },
  { value: "auto", label: "Auto" },
  { value: "plan", label: "Plan" },
]

function DemoBar({ used, limit }: { used?: number; limit?: number }) {
  const [mode, setMode] = React.useState("auto")

  return (
    <PromptInputBar>
      <PromptInputBarButton>
        <LaptopIcon />
        This computer
      </PromptInputBarButton>
      <PromptInputBarButton>
        <FolderIcon />
        component-library
      </PromptInputBarButton>
      <PromptInputBarButton>
        <GitBranchIcon />
        Worktree
      </PromptInputBarButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <PromptInputBarButton aria-label={`Permission mode: ${modes.find((m) => m.value === mode)?.label}`}>
            {mode === "auto" && <CheckIcon />}
            {modes.find((m) => m.value === mode)?.label}
          </PromptInputBarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="w-48">
          <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
            {modes.map((m) => (
              <DropdownMenuRadioItem key={m.value} value={m.value}>
                {m.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <PromptInputSpacer />
      <DemoUsage used={used} limit={limit} />
    </PromptInputBar>
  )
}

export type DemoComposerProps = {
  status?: PromptInputStatus
  disabled?: boolean
  placeholder?: string
  defaultValue?: string
  defaultFiles?: File[]
  accept?: string
  maxFiles?: number
  fileStatus?: (file: File) => PromptInputFileStatus | undefined
  /** Show the row under the composer with project, mode and usage. */
  showBar?: boolean
  showModelPicker?: boolean
  usage?: { used: number; limit?: number }
  onSubmit?: (message: { text: string; files: File[] }) => void
  onStop?: () => void
  onFilesRejected?: (files: File[]) => void
  className?: string
}

// Everything at once, the way a Claude-style app puts it together.
export function DemoComposer({
  status = "idle",
  disabled,
  placeholder = "Reply to Claude…",
  defaultValue,
  defaultFiles,
  accept,
  maxFiles,
  fileStatus,
  showBar = true,
  showModelPicker = true,
  usage,
  onSubmit,
  onStop,
  onFilesRejected,
  className,
}: DemoComposerProps) {
  return (
    <div className={className}>
      <PromptInput
        status={status}
        disabled={disabled}
        defaultValue={defaultValue}
        defaultFiles={defaultFiles}
        accept={accept}
        maxFiles={maxFiles}
        onSubmit={onSubmit}
        onStop={onStop}
        onFilesRejected={onFilesRejected}
      >
        <PromptInputCommands commands={commands} />
        <PromptInputAttachments status={fileStatus} />
        <PromptInputTextarea placeholder={placeholder} aria-label="Message" />
        <PromptInputFooter>
          <PlusMenu />
          <PromptInputSpacer />
          {showModelPicker && <DemoModelPicker disabled={disabled} />}
          <PromptInputButton tooltip="Dictate" aria-label="Dictate" disabled={disabled}>
            <MicIcon />
          </PromptInputButton>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
      {showBar && <DemoBar used={usage?.used} limit={usage?.limit} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Text

export const markdownReply = `Here's what changed in **September** compared with August:

1. Eating out dropped to **kr 1 600** (–kr 400)
2. Groceries rose slightly, mostly from two big Rema trips
3. Transport was flat

| Category | August | September |
| --- | ---: | ---: |
| Eating out | kr 2 000 | kr 1 600 |
| Groceries | kr 4 100 | kr 4 380 |
| Transport | kr 890 | kr 890 |

To export the numbers yourself:

\`\`\`ts
const total = transactions
  .filter((t) => t.category === "eating-out")
  .reduce((sum, t) => sum + t.amount, 0)
\`\`\`

> Tip: set a monthly limit and I'll warn you at 80%.`

export const longReply = Array.from(
  { length: 8 },
  (_, i) =>
    `### Step ${i + 1}\n\nThis paragraph is long on purpose, so the message is taller than the viewport and you can see how the scroller and the composer behave when there is a lot to read. It keeps going for a while with ordinary prose that wraps across several lines at most widths.`
).join("\n\n")

export const unbrokenText =
  "https://example.com/a/really/long/url/that/has/no/spaces/at/all/and/keeps/going/until/it/must/wrap/somewhere/or/overflow/the/bubble?with=query&params=too&and=more&tracking=abcdefghijklmnopqrstuvwxyz0123456789"

export const longWord = "Supercalifragilisticexpialidocious".repeat(6)

export function useStreamedText(full: string, { speed = 3, delay = 20, start = true } = {}) {
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    if (!start) return
    setLength(0)
    const id = setInterval(() => {
      setLength((l) => {
        if (l >= full.length) {
          clearInterval(id)
          return l
        }
        return l + speed
      })
    }, delay)
    return () => clearInterval(id)
  }, [full, speed, delay, start])

  return { text: full.slice(0, length), done: length >= full.length }
}

