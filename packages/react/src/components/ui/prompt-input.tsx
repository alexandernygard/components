"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowUpIcon, FileIcon, PaperclipIcon, SquareIcon, XIcon } from "lucide-react"

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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type PromptInputStatus = "idle" | "submitted" | "streaming"

type PromptInputContextProps = {
  value: string
  setValue: (value: string) => void
  files: File[]
  addFiles: (files: Iterable<File>) => void
  removeFile: (file: File) => void
  openFilePicker: () => void
  submit: () => void
  stop?: () => void
  status: PromptInputStatus
  disabled: boolean
  canSubmit: boolean
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
// becomes a stop button that calls `onStop`.
function PromptInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  files: filesProp,
  defaultFiles = [],
  onFilesChange,
  onSubmit,
  onStop,
  status = "idle",
  disabled = false,
  accept,
  multiple = true,
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
  status?: PromptInputStatus
  disabled?: boolean
  /** File types to allow, as for `<input type="file">`. */
  accept?: string
  multiple?: boolean
}) {
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange)
  const [files, setFiles] = useControllable(filesProp, defaultFiles, onFilesChange)
  const [dragging, setDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const busy = status !== "idle"
  const canSubmit = !disabled && !busy && (!!value.trim() || files.length > 0)

  const context = React.useMemo<PromptInputContextProps>(() => {
    const addFiles = (added: Iterable<File>) => {
      const allowed = [...added].filter((file) => matchesAccept(file, accept))

      if (allowed.length) {
        setFiles(multiple ? [...files, ...allowed] : allowed.slice(0, 1))
      }
    }

    return {
      value,
      setValue,
      files,
      addFiles,
      removeFile: (file) => setFiles(files.filter((f) => f !== file)),
      openFilePicker: () => fileInputRef.current?.click(),
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
    }
  }, [value, setValue, files, setFiles, accept, multiple, canSubmit, onSubmit, onStop, status, disabled])

  return (
    <PromptInputContext.Provider value={context}>
      <form
        data-slot="prompt-input"
        data-status={status}
        className={cn("w-full", className)}
        onSubmit={(event) => {
          event.preventDefault()
          context.submit()
        }}
        {...props}
      >
        <InputGroup
          data-dragging={dragging || undefined}
          className="data-dragging:border-ring data-dragging:ring-3 data-dragging:ring-ring/50"
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
        </InputGroup>
        <input
          ref={fileInputRef}
          type="file"
          hidden
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
  const { value, setValue, submit, addFiles, disabled } = usePromptInput()
  const ref = React.useRef<HTMLTextAreaElement>(null)

  // Browsers without `field-sizing: content` grow the text box here instead.
  React.useLayoutEffect(() => {
    const textarea = ref.current

    if (!textarea || CSS.supports("field-sizing", "content")) {
      return
    }

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  return (
    <InputGroupTextarea
      ref={ref}
      data-slot="prompt-input-textarea"
      value={value}
      disabled={disabled}
      rows={1}
      className={cn("max-h-48 min-h-12", className)}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
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

function PromptInputAttachment({ file }: { file: File }) {
  const { removeFile } = usePromptInput()
  const [preview, setPreview] = React.useState<string>()

  React.useEffect(() => {
    if (!file.type.startsWith("image/")) {
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <Attachment size="sm" data-slot="prompt-input-attachment">
      <AttachmentMedia variant={preview ? "image" : "icon"}>
        {preview ? <img src={preview} alt="" /> : <FileIcon />}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>{formatSize(file.size)}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label={`Remove ${file.name}`} onClick={() => removeFile(file)}>
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}

// The attached files, as chips with a remove button. Renders nothing when
// there are none.
function PromptInputAttachments({
  className,
  ...props
}: React.ComponentProps<typeof AttachmentGroup>) {
  const { files } = usePromptInput()

  if (!files.length) {
    return null
  }

  return (
    <InputGroupAddon align="block-start" className="cursor-default">
      <AttachmentGroup
        data-slot="prompt-input-attachments"
        className={cn("w-full", className)}
        {...props}
      >
        {files.map((file, index) => (
          <PromptInputAttachment key={`${file.name}-${file.lastModified}-${index}`} file={file} />
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
      className={cn(className)}
      {...props}
    />
  )
}

function PromptInputAttachButton({
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof InputGroupButton>) {
  const { openFilePicker, disabled } = usePromptInput()

  return (
    <InputGroupButton
      data-slot="prompt-input-attach-button"
      size="icon-xs"
      aria-label="Attach files"
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)
        openFilePicker()
      }}
      {...props}
    >
      {children ?? <PaperclipIcon />}
    </InputGroupButton>
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
      type={stoppable ? "button" : "submit"}
      variant="default"
      size="icon-xs"
      aria-label={stoppable ? "Stop" : "Send"}
      disabled={!stoppable && !canSubmit}
      className={cn("ml-auto rounded-full", className)}
      onClick={(event) => {
        onClick?.(event)

        if (stoppable) {
          stop()
        }
      }}
      {...props}
    >
      {children ?? (stoppable ? <SquareIcon className="fill-current" /> : <ArrowUpIcon />)}
    </InputGroupButton>
  )
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputAttachments,
  PromptInputFooter,
  PromptInputAttachButton,
  PromptInputSubmit,
  usePromptInput,
}
