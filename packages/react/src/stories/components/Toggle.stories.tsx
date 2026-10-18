import type { Meta, StoryObj } from "@storybook/react-vite"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, StarIcon, UnderlineIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const meta = {
  title: "Components/Toggle",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Favourite" defaultPressed>
        <StarIcon />
        Favourite
      </Toggle>
      <Toggle variant="outline" aria-label="Bold">
        <BoldIcon />
      </Toggle>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div className="grid gap-4">
      <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" spacing={0} defaultValue="left" aria-label="Alignment">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}
