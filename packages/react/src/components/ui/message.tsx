"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  GitBranchIcon,
  PencilIcon,
  RefreshCwIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
        className
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
        className
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0",
        className
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className
      )}
      {...props}
    />
  )
}

// Buttons under a message, such as copy, retry and feedback. With
// `visibility` "hover" they show while the message is hovered or focused,
// and always on touch screens.
function MessageActions({
  visibility = "always",
  className,
  ...props
}: React.ComponentProps<"div"> & { visibility?: "always" | "hover" }) {
  return (
    <div
      data-slot="message-actions"
      data-visibility={visibility}
      role="toolbar"
      className={cn(
        "-mx-1 flex min-w-0 items-center gap-0.5 text-muted-foreground transition-opacity duration-150 group-data-[align=end]/message:self-end data-[visibility=hover]:opacity-0 data-[visibility=hover]:group-hover/message:opacity-100 data-[visibility=hover]:focus-within:opacity-100 data-[visibility=hover]:has-aria-expanded:opacity-100 pointer-coarse:data-[visibility=hover]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function MessageAction({
  tooltip,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button> & { tooltip?: React.ReactNode }) {
  const button = (
    <Button
      data-slot="message-action"
      variant={variant}
      size={size}
      className={cn(
        "text-muted-foreground hover:text-foreground aria-pressed:text-foreground [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

// Copies `text` and shows a check for a moment.
function MessageCopyAction({
  text,
  onCopy,
  ...props
}: Omit<React.ComponentProps<typeof MessageAction>, "onCopy"> & {
  text: string | (() => string)
  onCopy?: (text: string) => void
}) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <MessageAction
      data-slot="message-copy-action"
      data-copied={copied || undefined}
      aria-label={copied ? "Copied" : "Copy"}
      tooltip={copied ? "Copied" : "Copy"}
      onClick={async () => {
        const value = typeof text === "function" ? text() : text

        try {
          await navigator.clipboard.writeText(value)
        } catch {
          return
        }

        onCopy?.(value)
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 1500)
      }}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </MessageAction>
  )
}

// The usual actions, each with its icon, label and tooltip.
function MessageEditAction({ children, ...props }: React.ComponentProps<typeof MessageAction>) {
  return (
    <MessageAction data-slot="message-edit-action" aria-label="Edit" tooltip="Edit" {...props}>
      {children ?? <PencilIcon />}
    </MessageAction>
  )
}

function MessageRetryAction({ children, ...props }: React.ComponentProps<typeof MessageAction>) {
  return (
    <MessageAction data-slot="message-retry-action" aria-label="Retry" tooltip="Retry" {...props}>
      {children ?? <RefreshCwIcon />}
    </MessageAction>
  )
}

// Starts a new conversation that ends at this message.
function MessageForkAction({ children, ...props }: React.ComponentProps<typeof MessageAction>) {
  return (
    <MessageAction
      data-slot="message-fork-action"
      aria-label="Fork from here"
      tooltip="Fork from here"
      {...props}
    >
      {children ?? <GitBranchIcon />}
    </MessageAction>
  )
}

// "2 / 3" with arrows, for a message that was edited or regenerated. `index`
// counts from 0. Renders nothing while there is only one version.
function MessageVersions({
  index,
  total,
  onIndexChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  index: number
  total: number
  onIndexChange: (index: number) => void
}) {
  if (total < 2) {
    return null
  }

  return (
    <div
      data-slot="message-versions"
      role="group"
      aria-label="Versions"
      className={cn("flex items-center", className)}
      {...props}
    >
      <MessageAction
        aria-label="Previous version"
        disabled={index <= 0}
        onClick={() => onIndexChange(index - 1)}
      >
        <ChevronLeftIcon />
      </MessageAction>
      <span className="min-w-8 text-center text-xs text-muted-foreground tabular-nums" aria-live="polite">
        <span className="sr-only">Version </span>
        {index + 1} / {total}
      </span>
      <MessageAction
        aria-label="Next version"
        disabled={index >= total - 1}
        onClick={() => onIndexChange(index + 1)}
      >
        <ChevronRightIcon />
      </MessageAction>
    </div>
  )
}

// Edits a message in place. Enter saves, Shift+Enter adds a line and Escape
// cancels. Saving is off while the text is empty or unchanged.
function MessageEditor({
  defaultValue = "",
  onSave,
  onCancel,
  saveLabel = "Save",
  placeholder,
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit" | "defaultValue"> & {
  defaultValue?: string
  onSave: (text: string) => void
  onCancel: () => void
  saveLabel?: React.ReactNode
  placeholder?: string
}) {
  const [value, setValue] = React.useState(defaultValue)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const canSave = value.trim() !== "" && value !== defaultValue

  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [])

  return (
    <form
      data-slot="message-editor"
      className={cn(
        "flex w-full flex-col gap-2 rounded-2xl border bg-card p-3 shadow-sm transition-[border-color,box-shadow] focus-within:border-foreground/25 focus-within:shadow-md",
        className
      )}
      onSubmit={(event) => {
        event.preventDefault()
        if (canSave) onSave(value)
      }}
      {...props}
    >
      <textarea
        ref={textareaRef}
        aria-label="Edit message"
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault()
            onCancel()
          } else if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }
        }}
        className="field-sizing-content max-h-80 min-h-12 w-full resize-none bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground md:text-[0.9375rem]"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!canSave}>
          {saveLabel}
        </Button>
      </div>
    </form>
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
  MessageActions,
  MessageAction,
  MessageCopyAction,
  MessageEditAction,
  MessageRetryAction,
  MessageForkAction,
  MessageVersions,
  MessageEditor,
}
