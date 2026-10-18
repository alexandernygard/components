import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpRightIcon, DownloadIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Save changes" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Save changes</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="outline">Export</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete budget</Button>
      <Button variant="link">View history</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  name: "With icons",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon data-icon="inline-start" />
        New entry
      </Button>
      <Button variant="outline">
        <DownloadIcon data-icon="inline-start" />
        Download CSV
      </Button>
      <Button variant="secondary">
        Open repository
        <ArrowUpRightIcon data-icon="inline-end" />
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button size="icon" variant="destructive" aria-label="Delete">
        <Trash2Icon />
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Saving
      </Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Importing transactions
      </Button>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
