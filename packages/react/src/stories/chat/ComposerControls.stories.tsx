import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, within } from "storybook/test"

import { ContextUsage, ContextUsageContent, ContextUsageTrigger } from "@/components/ui/context-usage"

import { DemoModelPicker, DemoUsage } from "./fixtures"

const meta = {
  title: "Chat/Composer controls",
  parameters: { layout: "centered" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ModelPicker: Story = {
  name: "Model picker",
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <DemoModelPicker />
      <DemoModelPicker defaultModel="fable" defaultEffort="max" />
      <DemoModelPicker defaultModel="haiku" showEffort={false} />
      <DemoModelPicker disabled />
    </div>
  ),
}

export const ModelPickerOpen: Story = {
  name: "Model picker (open)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex min-h-[28rem] items-end justify-end">
      <DemoModelPicker />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /^Model:/ }))
    await expect(await screen.findByRole("menuitemradio", { name: /Opus 5.5/ })).toHaveAttribute("aria-checked", "true")
  },
}

/** From empty to over the limit. Amber from 80%, red from 95%. */
export const ContextUsageLevels: Story = {
  name: "Context usage levels",
  render: () => (
    <div className="grid grid-cols-[auto_auto] items-center gap-x-6 gap-y-2 text-sm">
      {[0, 12_000, 84_200, 120_000, 168_000, 192_000, 200_000, 231_000].map((used) => (
        <div key={used} className="contents">
          <span className="text-muted-foreground tabular-nums">{used.toLocaleString("en")} / 200k</span>
          <DemoUsage used={used} limit={200_000} showLabel />
        </div>
      ))}
      <span className="text-muted-foreground">No limit known</span>
      <ContextUsage used={1_250_000}>
        <ContextUsageTrigger showLabel />
        <ContextUsageContent />
      </ContextUsage>
    </div>
  ),
}

export const ContextUsageOpen: Story = {
  name: "Context usage (open)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex min-h-[22rem] items-end justify-end">
      <DemoUsage />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Context: 42% used" }))
    await expect(await screen.findByText("84.2k / 200k")).toBeInTheDocument()
  },
}
