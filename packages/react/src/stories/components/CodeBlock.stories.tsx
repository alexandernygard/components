import type { Meta, StoryObj } from "@storybook/react-vite"
import { TerminalIcon } from "lucide-react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"

const meta = {
  title: "Components/Code block",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const install = "pnpm add @alexandernygard/components"

const source = `import { Button, Card, CardHeader, CardTitle } from "@alexandernygard/components"

export function SavingsCard({ saved }: { saved: number }) {
  const kr = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK" })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings goal</CardTitle>
      </CardHeader>
      <p className="text-3xl tabular-nums">{kr.format(saved)}</p>
      <Button variant="outline">Adjust plan</Button>
    </Card>
  )
}`

export const Terminal: Story = {
  render: () => (
    <CodeBlock className="max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <TerminalIcon />
          Terminal
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={install} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>{install}</CodeBlockContent>
    </CodeBlock>
  ),
}

export const Highlighted: Story = {
  render: function Render() {
    const lines = useHighlightedCode(source, "tsx")
    return (
      <CodeBlock className="max-w-2xl">
        <CodeBlockHeader>
          <CodeBlockTitle>savings-card.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={source} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, i) => (
            <CodeBlockLine key={i} variant={i >= 7 && i <= 9 ? "highlighted" : "default"}>
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    )
  },
}

export const Failure: Story = {
  render: () => (
    <CodeBlock variant="destructive" className="max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>Build failed</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent wrap>
        {`src/worker/queries.ts(42,7): error TS2322: Type 'string' is not assignable to type 'number'.`}
      </CodeBlockContent>
    </CodeBlock>
  ),
}
