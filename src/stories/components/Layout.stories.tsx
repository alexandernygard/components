import type { Meta, StoryObj } from "@storybook/react-vite"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const meta = {
  title: "Components/Layout",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const rooms = ["Living room", "Kitchen", "Bedroom", "Study", "Hallway"]

export const CarouselStory: Story = {
  name: "Carousel",
  render: () => (
    <Carousel className="w-72">
      <CarouselContent>
        {rooms.map((room, i) => (
          <CarouselItem key={room}>
            <Card>
              <CardContent className="flex aspect-square flex-col items-start justify-end gap-1">
                <span className="text-sm text-muted-foreground tabular-nums">
                  {i + 1} of {rooms.length}
                </span>
                <span className="font-heading text-3xl">{room}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const ResizableStory: Story = {
  name: "Resizable",
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-64 max-w-xl rounded-xl border">
      <ResizablePanel defaultSize="30">
        <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="70">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="60">
            <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
              Editor
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="40">
            <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
              Terminal
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

const commits = Array.from({ length: 30 }, (_, i) => `v0.${30 - i}.0`)

export const ScrollAreaStory: Story = {
  name: "Scroll area",
  render: () => (
    <div className="grid gap-6">
      <ScrollArea className="h-64 w-56 rounded-xl border">
        <div className="p-4">
          <p className="mb-3 text-sm font-medium">Releases</p>
          {commits.map((tag) => (
            <div key={tag}>
              <div className="py-1.5 text-sm tabular-nums">{tag}</div>
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className="w-96 rounded-xl border whitespace-nowrap">
        <div className="flex w-max gap-3 p-4">
          {rooms.concat(rooms).map((room, i) => (
            <div key={i} className="flex h-24 w-36 items-end rounded-lg bg-muted p-3 text-sm">
              {room}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
}

export const AspectRatioStory: Story = {
  name: "Aspect ratio",
  render: () => (
    <div className="w-96">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl bg-muted">
        <img
          src="https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&q=80"
          alt="A fjord under a cloudy sky"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
}
