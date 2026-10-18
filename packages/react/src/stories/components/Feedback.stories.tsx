import type { Meta, StoryObj } from "@storybook/react-vite"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

const meta = {
  title: "Components/Small pieces",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SkeletonStory: Story = {
  name: "Skeleton",
  render: () => (
    <div className="flex w-80 items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
}

export const SpinnerStory: Story = {
  name: "Spinner",
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner /> Syncing transactions
      </span>
    </div>
  ),
}

export const KbdStory: Story = {
  name: "Kbd",
  render: () => (
    <div className="grid gap-3 text-sm">
      <p className="flex items-center gap-2">
        Open the command palette with
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </p>
      <p className="flex items-center gap-2">
        Start and stop the timer with <Kbd>Space</Kbd>
      </p>
    </div>
  ),
}

export const SeparatorStory: Story = {
  name: "Separator",
  render: () => (
    <div className="w-80">
      <p className="text-sm font-medium">ur</p>
      <p className="text-sm text-muted-foreground">Keyboard-first time tracking for macOS.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Today</span>
        <Separator orientation="vertical" />
        <span>Week</span>
        <Separator orientation="vertical" />
        <span>Reports</span>
      </div>
    </div>
  ),
}
