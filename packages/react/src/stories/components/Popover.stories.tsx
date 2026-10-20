import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { CalendarDaysIcon, InfoIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import { PortalProvider } from "@/components/ui/portal-provider"

const meta = {
  title: "Components/Popover and tooltip",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const PopoverStory: Story = {
  name: "Popover",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set budget limit</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Groceries</PopoverTitle>
          <PopoverDescription>You'll get a heads-up at 80%.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="mt-3">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="limit" className="w-24">
              Monthly
            </FieldLabel>
            <Input id="limit" defaultValue="kr 6 000" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  ),
}

export const TooltipStory: Story = {
  name: "Tooltip",
  render: () => (
    <div className="flex gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Pick date">
            <CalendarDaysIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Pick a date <Kbd>D</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="About billable time">
            <InfoIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Billable time excludes breaks</TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const HoverCardStory: Story = {
  name: "Hover card",
  render: () => (
    <HoverCard defaultOpen>
      <HoverCardTrigger asChild>
        <Button variant="link">@alexandernygard</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/alexandernygard.png" alt="" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium">Alexander Nygård</p>
            <p className="text-sm text-muted-foreground">
              Builds keyboard-first tools for macOS and the web.
            </p>
            <p className="text-xs text-muted-foreground">Joined October 2019</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const PortalInsideAScaledStage: Story = {
  name: "Overlays inside a scaled stage",
  render: function Render() {
    const [stage, setStage] = React.useState<HTMLDivElement | null>(null)

    return (
      <div className="h-80 w-[40rem] overflow-hidden rounded-xl border bg-muted">
        <div
          ref={setStage}
          className="relative h-[40rem] w-[80rem] origin-top-left scale-50 bg-background p-16"
        >
          <PortalProvider container={stage}>
            <Popover>
              <PopoverTrigger asChild>
                <Button size="lg">Open a popover on the stage</Button>
              </PopoverTrigger>
              <PopoverContent>Rendered inside the scaled stage, so it scales with it.</PopoverContent>
            </Popover>
          </PortalProvider>
        </div>
      </div>
    )
  },
}
