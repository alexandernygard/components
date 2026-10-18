import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, CircleAlertIcon, GitPullRequestIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Draft" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "positive", "warning", "info", "destructive", "ghost", "link"],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="positive">Paid</Badge>
      <Badge variant="warning">Due Friday</Badge>
      <Badge variant="info">Synced</Badge>
      <Badge variant="destructive">Overdue</Badge>
    </div>
  ),
}

export const WithIcons: Story = {
  name: "With icons",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="positive">
        <CheckIcon data-icon="inline-start" />
        Checks passed
      </Badge>
      <Badge variant="destructive">
        <CircleAlertIcon data-icon="inline-start" />
        Build failed
      </Badge>
      <Badge variant="secondary">
        <GitPullRequestIcon data-icon="inline-start" />3 open
      </Badge>
      <Badge variant="outline" className="tabular-nums">
        12
      </Badge>
    </div>
  ),
}
