import * as React from "react"
import { cn } from "@/lib/utils"

import { ChevronRightIcon } from "lucide-react"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Markdown } from "@/components/ui/markdown"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"

type ToolValueFormat =
  | "auto"
  | "json"
  | "keyvalue"
  | "table"
  | "code"
  | "terminal"
  | "markdown"
  | "diff"
  | "text"
  | "image"

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

function isPrimitive(value: unknown) {
  return value === null || (typeof value !== "object" && typeof value !== "function")
}

function stringify(value: unknown) {
  if (typeof value === "string") {
    return value
  }

  try {
    return JSON.stringify(value, null, 2) ?? String(value)
  } catch {
    return String(value)
  }
}

function formatPrimitive(value: unknown) {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "string") return value
  return String(value)
}

// MCP tools answer with `{ content: [{ type: "text", text }] }`. The text is
// usually the real result, so it is unwrapped and shown on its own.
function unwrapContent(value: unknown): unknown {
  const content = isPlainObject(value) && Array.isArray(value.content) ? value.content : value

  if (
    Array.isArray(content) &&
    content.length > 0 &&
    content.every((item) => isPlainObject(item) && typeof item.type === "string")
  ) {
    const items = content as PlainObject[]

    if (items.every((item) => item.type === "text" && typeof item.text === "string")) {
      return items.map((item) => item.text).join("\n\n")
    }
  }

  return value
}

function parseJsonString(value: string): unknown {
  const trimmed = value.trim()

  if (!/^[[{]/.test(trimmed)) {
    return undefined
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    return undefined
  }
}

function isTable(value: unknown): value is PlainObject[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (row) => isPlainObject(row) && Object.values(row).every(isPrimitive)
    )
  )
}

function isImage(value: unknown) {
  return (
    isPlainObject(value) &&
    value.type === "image" &&
    typeof value.data === "string"
  )
}

const extensionLanguages: Record<string, string> = {
  ts: "typescript",
  mts: "typescript",
  cts: "typescript",
  tsx: "tsx",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "jsx",
  json: "json",
  jsonc: "json",
  css: "css",
  html: "html",
  htm: "html",
  md: "markdown",
  mdx: "markdown",
  py: "python",
  sql: "sql",
  yml: "yaml",
  yaml: "yaml",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  diff: "diff",
  patch: "diff",
}

// Guesses the language to highlight from a file name, such as "src/model.ts".
// Returns undefined for files the highlighter has no language for.
function languageFromPath(path: string | undefined) {
  const extension = path?.split(/[\\/]/).pop()?.split(".").slice(1).pop()?.toLowerCase()
  return extension ? extensionLanguages[extension] : undefined
}

// The file a tool works on, from the names file tools give it.
function pathOf(value: unknown) {
  if (!isPlainObject(value)) return undefined
  const path = value.path ?? value.file_path ?? value.filePath ?? value.filename
  return typeof path === "string" ? path : undefined
}

// Picks a viewer from the shape of the value.
function detectFormat(value: unknown): Exclude<ToolValueFormat, "auto"> {
  if (typeof value === "string") {
    if (/^(diff --git|--- |@@ )/.test(value)) return "diff"
    return "text"
  }
  if (isImage(value)) return "image"
  if (isTable(value)) return "table"
  if (
    isPlainObject(value) &&
    Object.keys(value).length > 0 &&
    Object.keys(value).length <= 12 &&
    Object.values(value).every(
      (v) => isPrimitive(v) && (typeof v !== "string" || !v.includes("\n"))
    )
  ) {
    return "keyvalue"
  }
  if (isPrimitive(value)) return "text"
  return "json"
}

function ToolValue({
  value,
  format = "auto",
  language,
  title,
  className,
}: {
  value: unknown
  format?: ToolValueFormat
  /** For `code`: the language to highlight. */
  language?: string
  /** For `code` and `diff`: shown in the header, such as a file name. */
  title?: string
  className?: string
}) {
  if (format === "auto") {
    let next = unwrapContent(value)

    if (typeof next === "string") {
      next = parseJsonString(next) ?? next
    }

    return (
      <ToolValue value={next} format={detectFormat(next)} className={className} />
    )
  }

  switch (format) {
    case "json":
      return <JsonTree value={value} className={className} />
    case "keyvalue":
      return isPlainObject(value) ? (
        <KeyValue value={value} className={className} />
      ) : (
        <JsonTree value={value} className={className} />
      )
    case "table":
      return isTable(value) ? (
        <ValueTable rows={value} className={className} />
      ) : (
        <JsonTree value={value} className={className} />
      )
    case "code":
      return (
        <ValueCode
          code={stringify(value)}
          language={language ?? (typeof value === "string" ? "" : "json")}
          title={title}
          className={className}
        />
      )
    case "terminal":
      return <TerminalOutput value={value} className={className} />
    case "markdown":
      return (
        <Markdown className={cn("text-foreground", className)}>
          {stringify(unwrapContent(value))}
        </Markdown>
      )
    case "diff":
      return <DiffView value={value} title={title} className={className} />
    case "image":
      return <ValueImage value={value} className={className} />
    case "text":
      return <ValueText value={value} className={className} />
  }
}

function ValueText({ value, className }: { value: unknown; className?: string }) {
  const text = formatPrimitive(value)

  if (text.includes("\n") || text.length > 120) {
    return (
      <CodeBlock data-tool-value="tool-value-text" size="sm" className={className}>
        <CodeBlockActions>
          <CodeBlockCopyButton value={text} />
        </CodeBlockActions>
        <CodeBlockContent wrap className="max-h-80">
          {text}
        </CodeBlockContent>
      </CodeBlock>
    )
  }

  return (
    <p
      data-slot="tool-value-text"
      className={cn("text-sm wrap-break-word text-foreground", className)}
    >
      {text}
    </p>
  )
}

function ValueCode({
  code,
  language = "",
  title,
  className,
}: {
  code: string
  language?: string
  /** Shown in the header. Defaults to the language. */
  title?: React.ReactNode
  className?: string
}) {
  const lines = useHighlightedCode(code, language)
  const label = title ?? language

  return (
    <CodeBlock data-tool-value="tool-value-code" size="sm" className={className}>
      {label ? (
        <CodeBlockHeader>
          <CodeBlockTitle className="font-mono">{label}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
      ) : (
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      )}
      <CodeBlockContent className="max-h-80">
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function JsonTree({
  value,
  defaultExpandDepth = 1,
  className,
}: {
  value: unknown
  /** Objects and arrays deeper than this start collapsed. */
  defaultExpandDepth?: number
  className?: string
}) {
  return (
    <CodeBlock data-tool-value="json-tree" size="sm" className={className}>
      <CodeBlockActions>
        <CodeBlockCopyButton value={stringify(value)} />
      </CodeBlockActions>
      <div
        className="max-h-80 min-w-0 scrollbar-thin overflow-auto px-2.5 py-2.5 font-mono leading-relaxed"
      >
        <JsonNode value={value} depth={0} expandDepth={defaultExpandDepth} />
      </div>
    </CodeBlock>
  )
}

function JsonNode({
  name,
  value,
  depth,
  expandDepth,
}: {
  name?: string
  value: unknown
  depth: number
  expandDepth: number
}) {
  const [open, setOpen] = React.useState(depth < expandDepth)
  const label = name !== undefined && (
    <span data-slot="json-tree-key" className="text-foreground">
      {name}
      <span className="text-muted-foreground">: </span>
    </span>
  )

  if (!Array.isArray(value) && !isPlainObject(value)) {
    return (
      <div data-slot="json-tree-item" className="ps-5 wrap-break-word">
        {label}
        <JsonPrimitive value={value} />
      </div>
    )
  }

  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value)
  const [start, end] = Array.isArray(value) ? ["[", "]"] : ["{", "}"]

  if (entries.length === 0) {
    return (
      <div data-slot="json-tree-item" className="ps-5">
        {label}
        <span className="text-muted-foreground">
          {start}
          {end}
        </span>
      </div>
    )
  }

  return (
    <div data-slot="json-tree-item">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="group/json-tree flex max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-sm text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded/json-tree:rotate-90"
        />
        <span className="min-w-0 truncate">
          {label}
          <span className="text-muted-foreground">
            {start}
            {!open && (
              <>
                {" "}
                {Array.isArray(value)
                  ? `${entries.length} ${entries.length === 1 ? "item" : "items"}`
                  : entries.map(([key]) => key).join(", ")}{" "}
                {end}
              </>
            )}
          </span>
        </span>
      </button>
      {open && (
        <>
          <div className="ms-2 border-s ps-1">
            {entries.map(([key, v]) => (
              <JsonNode
                key={key}
                name={Array.isArray(value) ? undefined : key}
                value={v}
                depth={depth + 1}
                expandDepth={expandDepth}
              />
            ))}
          </div>
          <div className="ps-5 text-muted-foreground">{end}</div>
        </>
      )}
    </div>
  )
}

function JsonPrimitive({ value }: { value: unknown }) {
  if (typeof value === "string") {
    return <span className="text-positive">"{value}"</span>
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return <span className="text-info">{String(value)}</span>
  }
  return <span className="text-warning">{formatPrimitive(value)}</span>
}

function KeyValue({
  value,
  className,
  ...props
}: Omit<React.ComponentProps<"dl">, "children"> & { value: PlainObject }) {
  return (
    <dl
      data-slot="key-value"
      className={cn(
        "grid min-w-0 grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm",
        className
      )}
      {...props}
    >
      {Object.entries(value).map(([key, v]) => (
        <React.Fragment key={key}>
          <dt className="truncate text-muted-foreground">{key}</dt>
          <dd className="min-w-0 wrap-break-word text-foreground">
            {isPrimitive(v) ? (
              <span className={cn(typeof v !== "string" && "tabular-nums")}>
                {formatPrimitive(v)}
              </span>
            ) : (
              <span className="font-mono text-xs text-muted-foreground">
                {JSON.stringify(v)}
              </span>
            )}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

function ValueTable({
  rows,
  columns,
  maxRows = 50,
  className,
}: {
  rows: PlainObject[]
  /** Defaults to every key that appears in a row. */
  columns?: string[]
  maxRows?: number
  className?: string
}) {
  const keys = React.useMemo(
    () => columns ?? [...new Set(rows.flatMap((row) => Object.keys(row)))],
    [columns, rows]
  )
  const shown = rows.slice(0, maxRows)

  return (
    <div
      data-slot="value-table"
      className={cn(
        "max-h-80 min-w-0 scrollbar-thin overflow-auto rounded-lg border text-foreground dark:bg-input/30",
        className
      )}
    >
      <Table className="text-xs">
        <TableHeader>
          <TableRow>
            {keys.map((key) => (
              <TableHead key={key} className="h-8 px-2.5">
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((row, index) => (
            <TableRow key={index}>
              {keys.map((key) => (
                <TableCell
                  key={key}
                  className={cn(
                    "px-2.5 py-1.5",
                    typeof row[key] === "number" && "text-end tabular-nums"
                  )}
                >
                  {row[key] === undefined ? "" : formatPrimitive(row[key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length > shown.length && (
        <p className="border-t px-2.5 py-1.5 text-xs text-muted-foreground">
          {rows.length - shown.length} more rows
        </p>
      )}
    </div>
  )
}

type DiffLine = { kind: "added" | "removed" | "context" | "hunk"; text: string }

function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n")
  const b = after.split("\n")

  // Longest common subsequence. Very large inputs skip it and show the whole
  // old text removed and the new text added.
  if (a.length * b.length > 4_000_000) {
    return [
      ...a.map((text) => ({ kind: "removed" as const, text })),
      ...b.map((text) => ({ kind: "added" as const, text })),
    ]
  }

  const table = Array.from({ length: a.length + 1 }, () =>
    new Uint32Array(b.length + 1)
  )
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] =
        a[i] === b[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }

  const lines: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      lines.push({ kind: "context", text: a[i] })
      i++
      j++
    } else if (i < a.length && (j === b.length || table[i + 1][j] >= table[i][j + 1])) {
      lines.push({ kind: "removed", text: a[i] })
      i++
    } else {
      lines.push({ kind: "added", text: b[j] })
      j++
    }
  }
  return lines
}

function parsePatch(patch: string): DiffLine[] {
  return patch
    .replace(/\n$/, "")
    .split("\n")
    .filter((line) => !/^(diff --git|index |--- |\+\+\+ )/.test(line))
    .map((line) => {
      if (line.startsWith("@@")) return { kind: "hunk", text: line }
      if (line.startsWith("+")) return { kind: "added", text: line.slice(1) }
      if (line.startsWith("-")) return { kind: "removed", text: line.slice(1) }
      return { kind: "context", text: line.slice(1) }
    })
}

// Reads the before and after text from the shapes edit tools use.
function diffSides(value: unknown): [string, string] | undefined {
  if (!isPlainObject(value)) return undefined

  const pairs = [
    ["before", "after"],
    ["old_string", "new_string"],
    ["oldText", "newText"],
    ["original", "modified"],
  ]
  for (const [from, to] of pairs) {
    if (typeof value[from] === "string" && typeof value[to] === "string") {
      return [value[from] as string, value[to] as string]
    }
  }
  return undefined
}

function DiffView({
  value,
  title,
  className,
}: {
  /** A unified diff, or an object with `before` and `after` (or `old_string` and `new_string`). */
  value: unknown
  title?: React.ReactNode
  className?: string
}) {
  const lines = React.useMemo(() => {
    const sides = diffSides(value)
    if (sides) return diffLines(...sides)
    return parsePatch(stringify(value))
  }, [value])
  const added = lines.filter((line) => line.kind === "added").length
  const removed = lines.filter((line) => line.kind === "removed").length
  const path =
    title ??
    (isPlainObject(value) &&
      (value.path ?? value.file_path ?? value.filename) as React.ReactNode)

  return (
    <CodeBlock data-tool-value="diff-view" size="sm" className={className}>
      <CodeBlockHeader>
        {path ? <CodeBlockTitle className="font-mono">{path}</CodeBlockTitle> : null}
        <span className="font-mono text-xs tabular-nums">
          <span className="text-positive">+{added}</span>{" "}
          <span className="text-destructive">−{removed}</span>
        </span>
      </CodeBlockHeader>
      <CodeBlockContent className="max-h-80">
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={
              line.kind === "added"
                ? "added"
                : line.kind === "removed"
                  ? "removed"
                  : "default"
            }
            className={cn(
              line.kind === "added" && "bg-positive/10 after:text-positive",
              line.kind === "hunk" && "text-muted-foreground"
            )}
          >
            {line.text}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function TerminalOutput({
  value,
  command,
  className,
}: {
  /** A string, or `{ stdout, stderr, exitCode }`. */
  value: unknown
  /** Shown above the output, after a `$`. */
  command?: string
  className?: string
}) {
  const output = isPlainObject(value) ? value : { stdout: stringify(value) }
  const stdout = typeof output.stdout === "string" ? output.stdout.replace(/\n$/, "") : ""
  const stderr = typeof output.stderr === "string" ? output.stderr.replace(/\n$/, "") : ""
  const exitCode = output.exitCode ?? output.exit_code ?? output.code
  const failed = typeof exitCode === "number" && exitCode !== 0
  const text = [stdout, stderr].filter(Boolean).join("\n")

  return (
    <CodeBlock data-tool-value="terminal-output" size="sm" className={className}>
      {command ? (
        <CodeBlockHeader>
          <CodeBlockTitle className="font-mono">
            <span className="text-muted-foreground">$ </span>
            {command}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={text} />
          </CodeBlockActions>
        </CodeBlockHeader>
      ) : (
        <CodeBlockActions>
          <CodeBlockCopyButton value={text} />
        </CodeBlockActions>
      )}
      <CodeBlockContent wrap className="max-h-80">
        {stdout && stdout.split("\n").map((line, index) => (
          <CodeBlockLine key={`out-${index}`}>{line}</CodeBlockLine>
        ))}
        {stderr && stderr.split("\n").map((line, index) => (
          <CodeBlockLine key={`err-${index}`} className="text-destructive">
            {line}
          </CodeBlockLine>
        ))}
        {!text && <CodeBlockLine className="text-muted-foreground">No output</CodeBlockLine>}
      </CodeBlockContent>
      {failed && (
        <CodeBlockFooter className="font-mono text-xs text-destructive">
          Exited with code {String(exitCode)}
        </CodeBlockFooter>
      )}
    </CodeBlock>
  )
}

function ValueImage({ value, className }: { value: unknown; className?: string }) {
  let src: string | undefined
  if (typeof value === "string") {
    src = value
  } else if (isPlainObject(value) && typeof value.data === "string") {
    const type = value.mimeType ?? value.mediaType ?? "image/png"
    src = value.data.startsWith("data:") ? value.data : `data:${type};base64,${value.data}`
  } else if (isPlainObject(value) && typeof value.url === "string") {
    src = value.url
  }

  if (!src || !/^(https?:|data:image\/|blob:|\/)/.test(src)) {
    return <JsonTree value={value} className={className} />
  }

  return (
    <img
      data-slot="tool-value-image"
      src={src}
      alt=""
      className={cn("max-h-80 w-auto max-w-full rounded-lg border object-contain", className)}
    />
  )
}

export {
  ToolValue,
  ValueText,
  ValueCode,
  JsonTree,
  KeyValue,
  ValueTable,
  DiffView,
  TerminalOutput,
  ValueImage,
  detectFormat,
  languageFromPath,
  pathOf,
  type ToolValueFormat,
}
