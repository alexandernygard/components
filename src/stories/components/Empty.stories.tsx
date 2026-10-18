import type { Meta, StoryObj } from "@storybook/react-vite"
import { FolderGit2Icon, ReceiptIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

const meta = {
  title: "Components/Empty",
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty className="w-[28rem] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ReceiptIcon />
        </EmptyMedia>
        <EmptyTitle>No transactions yet</EmptyTitle>
        <EmptyDescription>
          Connect a bank to import them automatically, or upload a CSV from your online bank.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Connect bank</Button>
          <Button variant="outline">Upload CSV</Button>
        </div>
      </EmptyContent>
    </Empty>
  ),
}

export const NoResults: Story = {
  name: "No results",
  render: () => (
    <Empty className="w-[28rem]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>Nothing matches "coffe"</EmptyTitle>
        <EmptyDescription>Check the spelling, or search by payee or category instead.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const Watching: Story = {
  render: () => (
    <Empty className="w-[28rem] border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderGit2Icon />
        </EmptyMedia>
        <EmptyTitle>You're not watching any repositories</EmptyTitle>
        <EmptyDescription>Add one to see its pull requests and CI status here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Add repository</Button>
      </EmptyContent>
    </Empty>
  ),
}
