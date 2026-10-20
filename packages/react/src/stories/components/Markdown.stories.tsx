import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"

const meta = {
  title: "Components/Markdown",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const reply = `## Your September

You spent **kr 23 480**, which is *kr 1 120 less* than August. The biggest changes:

1. Eating out fell to kr 1 600, mostly fewer weekday lunches.
2. Transport rose by kr 640 after the [Ruter](https://ruter.no) price change.
3. Two subscriptions renewed:
   - Spotify, kr 129
   - iCloud, kr 39

| Category | August | September |
| --- | ---: | ---: |
| Groceries | kr 4 210 | kr 4 080 |
| Eating out | kr 2 000 | kr 1 600 |
| Transport | kr 820 | kr 1 460 |

> At this pace you reach the deposit in **May 2028**.

- [x] Set a limit for eating out
- [ ] Review subscriptions

To export the numbers, run \`lommebok export\`:

\`\`\`bash
lommebok export --month 2026-09 --format csv
\`\`\`

\`\`\`ts
const saved = transactions
  .filter((t) => t.category === "savings")
  .reduce((sum, t) => sum + t.amount, 0)
\`\`\`
`

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <Markdown>{reply}</Markdown>
    </div>
  ),
}

export const Streaming: Story = {
  render: function Render() {
    const [length, setLength] = React.useState(0)
    const streaming = length < reply.length

    React.useEffect(() => {
      if (!streaming) return
      const timeout = setTimeout(() => setLength((l) => Math.min(l + 3, reply.length)), 20)
      return () => clearTimeout(timeout)
    }, [length, streaming])

    return (
      <div className="grid max-w-xl gap-4">
        <Button variant="outline" size="sm" className="w-fit" onClick={() => setLength(0)}>
          Replay
        </Button>
        <Bubble variant="ghost">
          <BubbleContent>
            <Markdown streaming={streaming}>{reply.slice(0, length)}</Markdown>
          </BubbleContent>
        </Bubble>
      </div>
    )
  },
}

export const InABubble: Story = {
  render: () => (
    <div className="grid max-w-md gap-3">
      <Bubble align="end">
        <BubbleContent>
          <Markdown>{"Can you **compare** August and September? Use `kr`."}</Markdown>
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          <Markdown>{"Sure. September was **kr 1 120** lower, and `eating out` fell the most."}</Markdown>
        </BubbleContent>
      </Bubble>
    </div>
  ),
}
