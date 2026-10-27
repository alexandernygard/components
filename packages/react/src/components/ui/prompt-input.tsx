"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { matchesHotkey } from "@/lib/hotkeys"
import {
  ArrowUpIcon,
  FileIcon,
  FileUpIcon,
  PaperclipIcon,
  PlusIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { KbdShortcut } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type PromptInputStatus = "idle" | "submitted" | "streaming"

type PromptInputKeyHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => void

type PromptInputContextProps = {
  value: string
  setValue: (value: string) => void
  files: File[]
  addFiles: (files: Iterable<File>) => void
  removeFile: (file: File) => void
  openFilePicker: () => void
  focus: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  submit: () => void
  stop?: () => void
  status: PromptInputStatus
  disabled: boolean
  canSubmit: boolean
  dragging: boolean
  /** Lets a part such as PromptInputCommands see key presses before the text box does. */
  setKeyHandler: (handler: PromptInputKeyHandler | null) => void
  keyHandlerRef: React.RefObject<PromptInputKeyHandler | null>
}

const PromptInputContext = React.createContext<PromptInputContextProps | null>(null)

function usePromptInput() {
  const context = React.useContext(PromptInputContext)

  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput.")
  }

  return context
}

function useControllable<T>(
  prop: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [state, setState] = React.useState(defaultValue)
  const value = prop ?? state
  const onChangeRef = React.useRef(onChange)

  React.useLayoutEffect(() => {
    onChangeRef.current = onChange
  })

  const setValue = React.useCallback((next: T) => {
    setState(next)
    onChangeRef.current?.(next)
  }, [])

  return [value, setValue] as const
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) {
    return true
  }

  return accept.split(",").some((rule) => {
    const type = rule.trim().toLowerCase()

    if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type)
    }

    if (type.endsWith("/*")) {
      return file.type.startsWith(type.slice(0, -1))
    }

    return file.type === type
  })
}

// A chat composer: Enter sends, Shift+Enter adds a line, the text box grows
// with its content and files can be attached, pasted or dropped. While a
// reply is on its way (`status` "submitted" or "streaming") the submit button
// becomes a stop button that calls `onStop`, and typing the next message is
// still allowed.
function PromptInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  files: filesProp,
  defaultFiles = [],
  onFilesChange,
  onSubmit,
  onStop,
  onFilesRejected,
  status = "idle",
  disabled = false,
  accept,
  multiple = true,
  maxFiles,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit" | "defaultValue"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  files?: File[]
  defaultFiles?: File[]
  onFilesChange?: (files: File[]) => void
  /** Called with the text and files. The composer clears itself afterwards. */
  onSubmit?: (message: { text: string; files: File[] }) => void
  onStop?: () => void
  /** Called with files left out because of `accept` or `maxFiles`. */
  onFilesRejected?: (files: File[]) => void
  status?: PromptInputStatus
  disabled?: boolean
  /** File types to allow, as for `<input type="file">`. */
  accept?: string
  multiple?: boolean
  maxFiles?: number
}) {
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange)
  const [files, setFiles] = useControllable(filesProp, defaultFiles, onFilesChange)
  const [dragging, setDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const keyHandlerRef = React.useRef<PromptInputKeyHandler | null>(null)

  const busy = status !== "idle"
  const canSubmit = !disabled && !busy && (!!value.trim() || files.length > 0)

  const context = React.useMemo<PromptInputContextProps>(() => {
    const addFiles = (added: Iterable<File>) => {
      const list = [...added]
      const allowed = list.filter((file) => matchesAccept(file, accept))
      const limit = multiple ? (maxFiles ?? Infinity) : 1
      const next = (multiple ? [...files, ...allowed] : allowed).slice(0, limit)
      const rejected = list.filter((file) => !next.includes(file))

      if (next.length !== files.length || next.some((file, i) => file !== files[i])) {
        setFiles(next)
      }

      if (rejected.length) {
        onFilesRejected?.(rejected)
      }
    }

    return {
      value,
      setValue,
      files,
      addFiles,
      removeFile: (file) => setFiles(files.filter((f) => f !== file)),
      openFilePicker: () => fileInputRef.current?.click(),
      focus: () => textareaRef.current?.focus(),
      textareaRef,
      submit: () => {
        if (!canSubmit) {
          return
        }

        onSubmit?.({ text: value, files })
        setValue("")
        setFiles([])
      },
      stop: onStop,
      status,
      disabled,
      canSubmit,
      dragging,
      setKeyHandler: (handler) => {
        keyHandlerRef.current = handler
      },
      keyHandlerRef,
    }
  }, [
    value,
    setValue,
    files,
    setFiles,
    accept,
    multiple,
    maxFiles,
    canSubmit,
    onSubmit,
    onStop,
    onFilesRejected,
    status,
    disabled,
    dragging,
  ])

  return (
    <PromptInputContext.Provider value={context}>
      <form
        data-slot="prompt-input"
        data-status={status}
        data-disabled={disabled || undefined}
        className={cn("group/prompt-input relative w-full", className)}
        onSubmit={(event) => {
          event.preventDefault()
          context.submit()
        }}
        {...props}
        onKeyDown={(event) => {
          props.onKeyDown?.(event)

          if (!event.defaultPrevented && !disabled && matchesHotkey(event.nativeEvent, "mod+u")) {
            event.preventDefault()
            context.openFilePicker()
          }
        }}
      >
        <InputGroup
          data-slot="prompt-input-box"
          data-dragging={dragging || undefined}
          className={cn(
            "relative isolate h-auto flex-col items-stretch rounded-2xl border-border bg-card shadow-sm transition-[border-color,box-shadow] dark:bg-card",
            "has-[[data-slot=input-group-control]:focus-visible]:border-foreground/25 has-[[data-slot=input-group-control]:focus-visible]:shadow-md has-[[data-slot=input-group-control]:focus-visible]:ring-0",
            "has-[[data-slot=input-group-control]:disabled]:bg-muted/50 has-[[data-slot=input-group-control]:disabled]:opacity-100 dark:has-[[data-slot=input-group-control]:disabled]:bg-muted/50",
            "data-dragging:border-ring data-dragging:ring-3 data-dragging:ring-ring/30"
          )}
          onDragOver={(event) => {
            if (!disabled && event.dataTransfer.types.includes("Files")) {
              event.preventDefault()
              setDragging(true)
            }
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setDragging(false)
            }
          }}
          onDrop={(event) => {
            setDragging(false)

            if (!disabled && event.dataTransfer.files.length) {
              event.preventDefault()
              context.addFiles(event.dataTransfer.files)
            }
          }}
        >
          {children}
          {dragging && (
            <div
              data-slot="prompt-input-drop-overlay"
              aria-hidden="true"
              className="pointer-events-none absolute inset-1 z-20 flex items-center justify-center gap-2 rounded-xl border border-dashed border-ring/60 bg-card/90 text-sm font-medium text-foreground backdrop-blur-[2px] animate-in fade-in-0"
            >
              <FileUpIcon className="size-4 text-muted-foreground" />
              Drop files to attach
            </div>
          )}
        </InputGroup>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          data-slot="prompt-input-file-input"
          accept={accept}
          multiple={multiple}
          onChange={(event) => {
            if (event.target.files) {
              context.addFiles(event.target.files)
            }
            event.target.value = ""
          }}
        />
      </form>
    </PromptInputContext.Provider>
  )
}

function PromptInputTextarea({
  className,
  onKeyDown,
  onPaste,
  ...props
}: Omit<React.ComponentProps<typeof InputGroupTextarea>, "value" | "defaultValue">) {
  const { value, setValue, submit, addFiles, disabled, textareaRef, keyHandlerRef } =
    usePromptInput()

  // Browsers without `field-sizing: content` grow the text box here instead.
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current

    if (!textarea || CSS.supports("field-sizing", "content")) {
      return
    }

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value, textareaRef])

  return (
    <InputGroupTextarea
      ref={textareaRef}
      data-slot="prompt-input-textarea"
      value={value}
      disabled={disabled}
      rows={1}
      className={cn(
        "order-1 max-h-60 min-h-14 px-4 pt-3.5 pb-1 text-base leading-relaxed placeholder:text-muted-foreground/70 md:text-[0.9375rem]",
        className
      )}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        keyHandlerRef.current?.(event)
        onKeyDown?.(event)

        if (
          !event.defaultPrevented &&
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.nativeEvent.isComposing
        ) {
          event.preventDefault()
          submit()
        }
      }}
      onPaste={(event) => {
        onPaste?.(event)

        const files = event.clipboardData.files

        if (!event.defaultPrevented && files.length) {
          event.preventDefault()
          addFiles(files)
        }
      }}
      {...props}
    />
  )
}

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

type PromptInputFileStatus = {
  state?: React.ComponentProps<typeof Attachment>["state"]
  /** Replaces the file size under the name, for progress or an error. */
  description?: React.ReactNode
}

function PromptInputAttachment({
  file,
  status,
}: {
  file: File
  status?: PromptInputFileStatus
}) {
  const { removeFile } = usePromptInput()
  const [preview, setPreview] = React.useState<string>()
  const state = status?.state ?? "done"

  React.useEffect(() => {
    if (!file.type.startsWith("image/")) {
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <Attachment
      size="sm"
      state={state}
      data-slot="prompt-input-attachment"
      className="max-w-56 min-w-0 bg-background pr-1 dark:bg-muted/40"
    >
      <AttachmentMedia variant={preview ? "image" : "icon"}>
        {state === "uploading" || state === "processing" ? (
          <Spinner />
        ) : preview ? (
          <img src={preview} alt="" />
        ) : (
          <FileIcon />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle title={file.name}>{file.name}</AttachmentTitle>
        <AttachmentDescription>
          {status?.description ?? formatSize(file.size)}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          aria-label={`Remove ${file.name}`}
          className="text-muted-foreground"
          onClick={() => removeFile(file)}
        >
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}

// The attached files, as chips with a remove button. Renders nothing when
// there are none. `status` can mark a file as uploading or failed.
function PromptInputAttachments({
  className,
  status,
  ...props
}: React.ComponentProps<typeof AttachmentGroup> & {
  status?: (file: File) => PromptInputFileStatus | undefined
}) {
  const { files } = usePromptInput()

  if (!files.length) {
    return null
  }

  return (
    <InputGroupAddon align="block-start" className="order-0 cursor-default px-3 pt-3">
      <AttachmentGroup
        data-slot="prompt-input-attachments"
        className={cn("w-full gap-2", className)}
        {...props}
      >
        {files.map((file, index) => (
          <PromptInputAttachment
            key={`${file.name}-${file.lastModified}-${index}`}
            file={file}
            status={status?.(file)}
          />
        ))}
      </AttachmentGroup>
    </InputGroupAddon>
  )
}

function PromptInputFooter({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupAddon>) {
  return (
    <InputGroupAddon
      data-slot="prompt-input-footer"
      align="block-end"
      className={cn("order-2 cursor-text gap-1 px-2.5 pt-1 pb-2.5", className)}
      {...props}
    />
  )
}

// Pushes what follows it in the footer to the right.
function PromptInputSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-input-spacer"
      aria-hidden="true"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

// A quiet icon button for the footer. Give it a `tooltip` and it gets a label
// on hover too.
function PromptInputButton({
  tooltip,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof InputGroupButton> & {
  tooltip?: React.ReactNode
}) {
  const button = (
    <InputGroupButton
      data-slot="prompt-input-button"
      variant={variant}
      size={size}
      className={cn(
        "rounded-lg text-muted-foreground hover:text-foreground aria-expanded:text-foreground [&>svg:not([class*='size-'])]:size-4",
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
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function PromptInputAttachButton({
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof PromptInputButton>) {
  const { openFilePicker, disabled } = usePromptInput()

  return (
    <PromptInputButton
      data-slot="prompt-input-attach-button"
      aria-label="Attach files"
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)
        openFilePicker()
      }}
      {...props}
    >
      {children ?? <PaperclipIcon />}
    </PromptInputButton>
  )
}

// The "+" menu: attach files and anything else the app adds, such as
// connectors or slash commands.
function PromptInputActionMenu(props: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="prompt-input-action-menu" {...props} />
}

function PromptInputActionMenuTrigger({
  children,
  ...props
}: React.ComponentProps<typeof PromptInputButton>) {
  const { disabled } = usePromptInput()

  return (
    <DropdownMenuTrigger asChild>
      <PromptInputButton
        data-slot="prompt-input-action-menu-trigger"
        aria-label="Add files and more"
        disabled={disabled}
        {...props}
      >
        {children ?? <PlusIcon className="size-[1.125rem]" />}
      </PromptInputButton>
    </DropdownMenuTrigger>
  )
}

function PromptInputActionMenuContent({
  className,
  side = "top",
  align = "start",
  sideOffset = 8,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  const { focus } = usePromptInput()

  return (
    <DropdownMenuContent
      data-slot="prompt-input-action-menu-content"
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "w-64 rounded-xl p-1.5 *:data-[slot=dropdown-menu-item]:gap-2.5 *:data-[slot=dropdown-menu-item]:rounded-lg *:data-[slot=dropdown-menu-item]:px-2 *:data-[slot=dropdown-menu-item]:py-1.5 *:data-[slot=dropdown-menu-sub-trigger]:gap-2.5 *:data-[slot=dropdown-menu-sub-trigger]:rounded-lg *:data-[slot=dropdown-menu-sub-trigger]:px-2 *:data-[slot=dropdown-menu-sub-trigger]:py-1.5",
        className
      )}
      onCloseAutoFocus={(event) => {
        onCloseAutoFocus?.(event)

        // Back to the text box, so typing carries on after picking something.
        if (!event.defaultPrevented) {
          event.preventDefault()
          focus()
        }
      }}
      {...props}
    />
  )
}

function PromptInputActionMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem className={cn(className)} {...props} />
  )
}

// The "Add files or photos" item, with the same shortcut as the native picker.
function PromptInputActionAddFiles({
  children,
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  const { openFilePicker } = usePromptInput()

  return (
    <PromptInputActionMenuItem
      onSelect={(event) => {
        onSelect?.(event)
        openFilePicker()
      }}
      {...props}
    >
      <PaperclipIcon />
      <span className="flex-1">{children ?? "Add files or photos"}</span>
      <KbdShortcut keys="mod+u" className="ml-auto" />
    </PromptInputActionMenuItem>
  )
}

// Sends the message, or stops the reply while one is on its way.
function PromptInputSubmit({
  className,
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof InputGroupButton>) {
  const { status, stop, canSubmit } = usePromptInput()
  const stoppable = status !== "idle" && !!stop

  return (
    <InputGroupButton
      data-slot="prompt-input-submit"
      data-state={stoppable ? "stop" : canSubmit ? "ready" : "empty"}
      type={stoppable ? "button" : "submit"}
      variant="default"
      size="icon-sm"
      aria-label={stoppable ? "Stop" : "Send"}
      disabled={!stoppable && !canSubmit}
      className={cn(
        "rounded-lg transition-[background-color,opacity,scale] active:scale-95 [&>svg:not([class*='size-'])]:size-4",
        "data-[state=ready]:bg-highlight data-[state=ready]:text-highlight-foreground data-[state=ready]:hover:bg-highlight-edge",
        "data-[state=empty]:bg-muted data-[state=empty]:text-muted-foreground data-[state=empty]:opacity-100",
        "data-[state=stop]:bg-foreground data-[state=stop]:text-background",
        className
      )}
      onClick={(event) => {
        onClick?.(event)

        if (stoppable) {
          stop()
        }
      }}
      {...props}
    >
      {children ??
        (stoppable ? (
          <SquareIcon className="size-3! fill-current" />
        ) : (
          <ArrowUpIcon strokeWidth={2.5} />
        ))}
    </InputGroupButton>
  )
}

type PromptInputCommand = {
  name: string
  description?: React.ReactNode
  icon?: React.ReactNode
  /** Extra words to match on. */
  keywords?: string[]
}

// Shows commands above the composer while the text starts with "/". Arrow
// keys move, Enter or Tab picks one and Escape closes the list. Picking a
// command calls `onSelect` and, unless that returns false, replaces the
// text with "/name ".
function PromptInputCommands({
  commands,
  onSelect,
  trigger = "/",
  emptyText = "No matching commands",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  commands: PromptInputCommand[]
  onSelect?: (command: PromptInputCommand) => boolean | void
  trigger?: string
  emptyText?: React.ReactNode
}) {
  const { value, setValue, setKeyHandler, focus } = usePromptInput()
  const [active, setActive] = React.useState(0)
  const [dismissed, setDismissed] = React.useState<string | null>(null)
  const listId = React.useId()

  const query = value.startsWith(trigger) && !/\s/.test(value) ? value.slice(trigger.length) : null
  const open = query !== null && dismissed !== value

  const matches = React.useMemo(() => {
    if (query === null) {
      return []
    }

    const q = query.toLowerCase()

    return commands
      .filter((command) =>
        [command.name, ...(command.keywords ?? [])].some((word) =>
          word.toLowerCase().includes(q)
        )
      )
      .sort(
        (a, b) =>
          Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q))
      )
  }, [commands, query])

  React.useEffect(() => {
    setActive(0)
  }, [query])

  const pick = React.useCallback(
    (command: PromptInputCommand) => {
      if (onSelect?.(command) !== false) {
        setValue(`${trigger}${command.name} `)
      }
      focus()
    },
    [onSelect, setValue, trigger, focus]
  )

  React.useEffect(() => {
    if (!open) {
      setKeyHandler(null)
      return
    }

    setKeyHandler((event) => {
      if (event.nativeEvent.isComposing) {
        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        setDismissed(value)
      } else if (!matches.length) {
        return
      } else if (event.key === "ArrowDown") {
        event.preventDefault()
        setActive((i) => (i + 1) % matches.length)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setActive((i) => (i - 1 + matches.length) % matches.length)
      } else if ((event.key === "Enter" && !event.shiftKey) || event.key === "Tab") {
        event.preventDefault()
        pick(matches[Math.min(active, matches.length - 1)])
      }
    })

    return () => setKeyHandler(null)
  }, [open, matches, active, pick, setKeyHandler, value])

  if (!open) {
    return null
  }

  return (
    <div
      data-slot="prompt-input-commands"
      className={cn(
        "absolute inset-x-0 bottom-full z-30 mb-2 flex max-h-72 flex-col overflow-y-auto rounded-xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/10 animate-in fade-in-0 slide-in-from-bottom-1",
        className
      )}
      {...props}
    >
      {matches.length ? (
        <div role="listbox" id={listId} aria-label="Commands">
          {matches.map((command, index) => (
            <div
              key={command.name}
              role="option"
              aria-selected={index === active}
              data-active={index === active || undefined}
              className="flex cursor-default items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm data-active:bg-accent data-active:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
              onMouseMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(command)}
            >
              {command.icon}
              <span className="font-medium">
                {trigger}
                {command.name}
              </span>
              {command.description && (
                <span className="min-w-0 truncate text-muted-foreground">
                  {command.description}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-2 py-1.5 text-sm text-muted-foreground">{emptyText}</div>
      )}
    </div>
  )
}

// The quiet row under the composer, for where and how the message runs:
// project, branch, permission mode, model, usage.
function PromptInputBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-input-bar"
      className={cn(
        "flex min-w-0 items-center gap-0.5 overflow-x-auto scrollbar-none px-1 pt-1.5 text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PromptInputBarButton({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="prompt-input-bar-button"
      type={type}
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 whitespace-nowrap transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-expanded:bg-muted aria-expanded:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputAttachments,
  PromptInputFooter,
  PromptInputSpacer,
  PromptInputButton,
  PromptInputAttachButton,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionAddFiles,
  PromptInputSubmit,
  PromptInputCommands,
  PromptInputBar,
  PromptInputBarButton,
  usePromptInput,
  type PromptInputCommand,
  type PromptInputFileStatus,
  type PromptInputStatus,
}
