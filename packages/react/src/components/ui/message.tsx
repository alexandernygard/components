"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, CopyIcon } from "lucide-react"

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
}
