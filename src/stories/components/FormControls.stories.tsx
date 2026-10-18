import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

const meta = {
  title: "Components/Form controls",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const InputField: Story = {
  name: "Input",
  render: () => (
    <div className="grid w-80 gap-6">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Monthly rent</Label>
        <Input id="amount" defaultValue="16 500" inputMode="numeric" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="invalid">Account number</Label>
        <Input id="invalid" defaultValue="1234 56 789" aria-invalid />
        <p className="text-sm text-destructive">Account numbers have 11 digits.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="disabled">Workspace</Label>
        <Input id="disabled" defaultValue="nyggis" disabled />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="file">Statement</Label>
        <Input id="file" type="file" />
      </div>
    </div>
  ),
}

export const TextareaField: Story = {
  name: "Textarea",
  render: () => (
    <div className="grid w-96 gap-2">
      <Label htmlFor="note">Note</Label>
      <Textarea id="note" placeholder="What did you work on?" />
      <p className="text-sm text-muted-foreground">Shown on the weekly report.</p>
    </div>
  ),
}

export const CheckboxField: Story = {
  name: "Checkbox",
  render: () => (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="c1" defaultChecked />
        <Label htmlFor="c1">Round entries to 15 minutes</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c2" />
        <Label htmlFor="c2">Include weekends</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c3" disabled />
        <Label htmlFor="c3">Sync with calendar (coming later)</Label>
      </div>
    </div>
  ),
}

export const SwitchField: Story = {
  name: "Switch",
  render: () => (
    <div className="grid w-80 gap-5">
      {[
        ["Notify on review requests", true],
        ["Notify when CI fails", true],
        ["Notify on every push", false],
      ].map(([label, on]) => (
        <div key={label as string} className="flex items-center justify-between gap-4">
          <Label htmlFor={label as string}>{label}</Label>
          <Switch id={label as string} defaultChecked={on as boolean} />
        </div>
      ))}
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="small">Compact rows</Label>
        <Switch id="small" size="sm" defaultChecked />
      </div>
    </div>
  ),
}

export const RadioField: Story = {
  name: "Radio group",
  render: () => (
    <RadioGroup defaultValue="monthly" className="w-72">
      {[
        ["weekly", "Weekly", "Every Monday morning"],
        ["monthly", "Monthly", "On the first of the month"],
        ["never", "Never", "Only when you ask"],
      ].map(([value, label, hint]) => (
        <div key={value} className="flex items-start gap-3">
          <RadioGroupItem value={value} id={value} className="mt-0.5" />
          <div className="grid gap-0.5">
            <Label htmlFor={value}>{label}</Label>
            <p className="text-sm text-muted-foreground">{hint}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
}

export const SliderField: Story = {
  name: "Slider",
  render: function Render() {
    const [value, setValue] = React.useState([35])
    return (
      <div className="grid w-80 gap-3">
        <div className="flex items-center justify-between">
          <Label>Savings rate</Label>
          <span className="text-sm tabular-nums text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <Label className="mt-4">Price range</Label>
        <Slider defaultValue={[20, 70]} max={100} />
      </div>
    )
  },
}

export const ProgressBar: Story = {
  name: "Progress",
  render: () => (
    <div className="grid w-80 gap-5">
      {[
        ["Groceries", 72],
        ["Transport", 38],
        ["Eating out", 100],
      ].map(([label, value]) => (
        <div key={label} className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span>{label}</span>
            <span className="tabular-nums text-muted-foreground">{value}%</span>
          </div>
          <Progress value={value as number} />
        </div>
      ))}
    </div>
  ),
}
