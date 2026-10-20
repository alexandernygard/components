import * as React from "react"
import { Lexer, type Token, type Tokens } from "marked"
import { cn } from "@/lib/utils"
import { completeMarkdown, safeUrl } from "@/lib/markdown"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"

// Renders markdown (GFM) as React elements. Raw HTML is shown as text and
// links with a script URL are dropped, so model output is safe to pass in.
function Markdown({
  children,
  streaming = false,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  children: string
  /** Set while the text is still arriving, to close half-written syntax. */
  streaming?: boolean
}) {
  const tokens = React.useMemo(
    () => Lexer.lex(streaming ? completeMarkdown(children) : children),
    [children, streaming]
  )

  return (
    <div
      data-slot="markdown"
      className={cn(
        "flex min-w-0 flex-col gap-3 text-sm leading-relaxed wrap-break-word",
        className
      )}
      {...props}
    >
      <MarkdownBlocks tokens={tokens} />
    </div>
  )
}

function MarkdownBlocks({ tokens }: { tokens: Token[] }) {
  return tokens.map((token, index) => (
    <MarkdownBlock key={index} token={token} />
  ))
}

function MarkdownBlock({ token }: { token: Token }) {
  switch (token.type) {
    case "heading": {
      const { depth, tokens } = token as Tokens.Heading
      const Heading = `h${depth}` as "h1"

      return (
        <Heading
          data-slot="markdown-heading"
          className={cn(
            "font-heading font-semibold text-balance not-first:mt-2",
            depth === 1 && "text-xl",
            depth === 2 && "text-lg",
            depth === 3 && "text-base"
          )}
        >
          <MarkdownInline tokens={tokens} />
        </Heading>
      )
    }

    case "paragraph":
      return (
        <p>
          <MarkdownInline tokens={(token as Tokens.Paragraph).tokens} />
        </p>
      )

    case "text": {
      const { tokens, text } = token as Tokens.Text

      return tokens ? <MarkdownInline tokens={tokens} /> : text
    }

    case "list": {
      const { ordered, start, items } = token as Tokens.List
      const List = ordered ? "ol" : "ul"

      return (
        <List
          data-slot="markdown-list"
          start={ordered && start !== 1 && start !== "" ? start : undefined}
          className={cn(
            "flex flex-col gap-1 ps-5 marker:text-muted-foreground",
            ordered ? "list-decimal" : "list-disc",
            items.some((item) => item.task) && "ps-0"
          )}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={cn(
                "ps-1 [&>*+*]:mt-1.5",
                item.loose && "[&>*+*]:mt-3",
                item.task && "list-none ps-0"
              )}
            >
              <MarkdownBlocks tokens={item.tokens} />
            </li>
          ))}
        </List>
      )
    }

    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={(token as Tokens.Checkbox).checked}
          disabled
          className="me-2 size-3.5 translate-y-0.5 accent-primary"
        />
      )

    case "blockquote":
      return (
        <blockquote className="flex flex-col gap-3 border-s-2 ps-3 text-muted-foreground">
          <MarkdownBlocks tokens={(token as Tokens.Blockquote).tokens} />
        </blockquote>
      )

    case "code": {
      const { text, lang } = token as Tokens.Code

      return <MarkdownCode code={text} language={lang?.split(/\s/)[0] ?? ""} />
    }

    case "table": {
      const { header, rows } = token as Tokens.Table

      return (
        <Table className="w-auto">
          <TableHeader>
            <TableRow>
              {header.map((cell, index) => (
                <TableHead key={index} style={{ textAlign: cell.align ?? undefined }}>
                  <MarkdownInline tokens={cell.tokens} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, index) => (
                  <TableCell key={index} style={{ textAlign: cell.align ?? undefined }}>
                    <MarkdownInline tokens={cell.tokens} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    case "hr":
      return <Separator className="my-1" />

    case "html":
      return <p>{(token as Tokens.HTML).text}</p>

    default:
      return null
  }
}

function MarkdownCode({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlock data-slot="markdown-code" size="sm">
      {language ? (
        <CodeBlockHeader>
          <CodeBlockTitle className="font-mono">{language}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
      ) : (
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      )}
      <CodeBlockContent>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function MarkdownInline({ tokens }: { tokens: Token[] }) {
  return tokens.map((token, index) => {
    switch (token.type) {
      case "strong":
        return (
          <strong key={index} className="font-semibold">
            <MarkdownInline tokens={(token as Tokens.Strong).tokens} />
          </strong>
        )

      case "em":
        return (
          <em key={index}>
            <MarkdownInline tokens={(token as Tokens.Em).tokens} />
          </em>
        )

      case "del":
        return (
          <del key={index}>
            <MarkdownInline tokens={(token as Tokens.Del).tokens} />
          </del>
        )

      case "codespan":
        return (
          <code
            key={index}
            className="rounded-sm bg-current/10 px-1 py-0.5 font-mono text-[0.9em]"
          >
            {(token as Tokens.Codespan).text}
          </code>
        )

      case "link": {
        const { href, title, tokens } = token as Tokens.Link
        const url = safeUrl(href)

        if (!url) {
          return <MarkdownInline key={index} tokens={tokens} />
        }

        const external = /^https?:/i.test(url)

        return (
          <a
            key={index}
            href={url}
            title={title ?? undefined}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="font-medium underline underline-offset-4"
          >
            <MarkdownInline tokens={tokens} />
          </a>
        )
      }

      case "image": {
        const { href, title, text } = token as Tokens.Image
        const url = safeUrl(href)

        return url ? (
          <img
            key={index}
            src={url}
            alt={text}
            title={title ?? undefined}
            className="inline max-w-full rounded-lg"
          />
        ) : (
          text
        )
      }

      case "br":
        return <br key={index} />

      case "text": {
        const { tokens, text } = token as Tokens.Text

        return tokens ? (
          <MarkdownInline key={index} tokens={tokens} />
        ) : (
          <React.Fragment key={index}>{text}</React.Fragment>
        )
      }

      case "checkbox":
        return <MarkdownBlock key={index} token={token} />

      case "escape":
      case "html":
        return (
          <React.Fragment key={index}>
            {(token as Tokens.Escape | Tokens.Tag).text}
          </React.Fragment>
        )

      default:
        return null
    }
  })
}

export { Markdown }
