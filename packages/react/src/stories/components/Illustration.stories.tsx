import type { Meta, StoryObj } from "@storybook/react-vite"
import { accents, groups, motifs, type MotifName } from "@alexandernygard/illustrations"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Illustration } from "@/components/ui/illustration"

const meta = {
  title: "Components/Illustration",
  component: Illustration,
  parameters: { layout: "padded" },
  argTypes: {
    motif: { control: "select", options: Object.keys(motifs) },
    accent: { control: "select", options: Object.keys(accents) },
    theme: { control: "select", options: [undefined, "paper", "ink", "mist"] },
  },
} satisfies Meta<typeof Illustration>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { motif: "sieve", accent: "clay", className: "w-96" },
}

export const Motifs: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <h3 className="font-heading text-lg capitalize">{group}</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
            {(Object.keys(motifs) as MotifName[])
              .filter((name) => motifs[name].group === group)
              .map((name) => (
                <figure key={name} className="flex flex-col gap-1">
                  <Illustration motif={name} accent="clay" seed="stories" className="rounded-lg border" />
                  <figcaption className="text-sm text-muted-foreground">{name}</figcaption>
                </figure>
              ))}
          </div>
        </section>
      ))}
    </div>
  ),
}

export const InEmptyState: Story = {
  name: "In an empty state",
  render: () => (
    <Empty className="w-[28rem] border">
      <EmptyHeader>
        <EmptyMedia>
          <Illustration motif="sieve" accent="teal" size="400x260" className="w-64" />
        </EmptyMedia>
        <EmptyTitle>No listings match yet</EmptyTitle>
        <EmptyDescription>We'll let you know as soon as one shows up.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Edit search</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const Hero: Story = {
  render: () => (
    <section className="relative overflow-hidden rounded-xl border bg-background">
      <Illustration motif="flow" accent="clay" size="1600x600" position="right" className="absolute inset-0" />
      <div className="relative flex min-h-80 max-w-md flex-col justify-center gap-3 p-10">
        <h1 className="font-heading text-4xl">Crate Sync</h1>
        <p className="text-muted-foreground">Your record library, kept in step with your decks.</p>
        <div>
          <Button>Get started</Button>
        </div>
      </div>
    </section>
  ),
}

export const Cover: Story = {
  name: "Cover (og image)",
  args: {
    title: "Timeblock",
    tagline: "Plan the day in blocks, then let it run itself.",
    byline: "alexandernygard.com",
    motif: "orbit",
    accent: "clay",
    size: "og",
    theme: "paper",
    background: "theme",
    texture: true,
    className: "max-w-3xl rounded-xl border overflow-hidden",
  },
}
