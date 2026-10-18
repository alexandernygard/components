import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const meta = {
  title: "Patterns/Settings",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Preferences: Story = {
  render: () => (
    <div className="mx-auto grid max-w-2xl gap-8 px-4 py-10">
      <div className="grid gap-2">
        <h1 className="font-heading text-4xl">Settings</h1>
        <p className="text-muted-foreground">Choose how ur tracks and reports your day.</p>
      </div>
      <Tabs defaultValue="tracking">
        <TabsList variant="line">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
      </Tabs>
      <form
        className="grid gap-10"
        onSubmit={(e) => {
          e.preventDefault()
          toast.success("Settings saved")
        }}
      >
        <FieldSet>
          <FieldLegend>Work day</FieldLegend>
          <FieldDescription>Used for idle detection and the end-of-day summary.</FieldDescription>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="start">Starts at</FieldLabel>
                <Input id="start" type="time" defaultValue="08:30" />
              </Field>
              <Field>
                <FieldLabel htmlFor="end">Ends at</FieldLabel>
                <Input id="end" type="time" defaultValue="16:30" />
              </Field>
            </div>
            <Field>
              <FieldLabel>Round entries to</FieldLabel>
              <Select defaultValue="15">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">The minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>When you go idle</FieldLegend>
          <RadioGroup defaultValue="ask" className="gap-4">
            {[
              ["ask", "Ask what to do with the time", "A prompt appears when you come back."],
              ["keep", "Keep the time", "Idle time stays on the running entry."],
              ["drop", "Discard the time", "The timer stops when you go idle."],
            ].map(([value, label, hint]) => (
              <Field key={value} orientation="horizontal">
                <RadioGroupItem value={value} id={`idle-${value}`} />
                <FieldContent>
                  <FieldLabel htmlFor={`idle-${value}`}>{label}</FieldLabel>
                  <FieldDescription>{hint}</FieldDescription>
                </FieldContent>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Menu bar</FieldLegend>
          <FieldGroup>
            {[
              ["Show the running timer", "Elapsed time next to the icon.", true],
              ["Show today's total", "Hours tracked so far today.", false],
              ["Launch at login", "Start ur when you log in to your Mac.", true],
            ].map(([title, desc, on]) => (
              <Field key={title as string} orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{title}</FieldTitle>
                  <FieldDescription>{desc}</FieldDescription>
                </FieldContent>
                <Switch defaultChecked={on as boolean} aria-label={title as string} />
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost">
            Reset to defaults
          </Button>
          <Button type="submit">Save settings</Button>
        </div>
      </form>
      <Toaster />
    </div>
  ),
}
