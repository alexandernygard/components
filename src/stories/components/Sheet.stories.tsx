import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Sheet and drawer",
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

function EntryForm() {
  return (
    <FieldGroup className="px-4">
      <Field>
        <FieldLabel htmlFor="sheet-project">Project</FieldLabel>
        <Input id="sheet-project" defaultValue="Client onboarding" />
      </Field>
      <Field>
        <FieldLabel htmlFor="sheet-duration">Duration</FieldLabel>
        <Input id="sheet-duration" defaultValue="1 h 45 m" />
      </Field>
      <Field>
        <FieldLabel htmlFor="sheet-note">Note</FieldLabel>
        <Textarea id="sheet-note" placeholder="What did you work on?" />
      </Field>
    </FieldGroup>
  )
}

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit entry</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit entry</SheetTitle>
          <SheetDescription>Tuesday 13 October, 09:15 to 11:00</SheetDescription>
        </SheetHeader>
        <EntryForm />
        <SheetFooter>
          <Button>Save entry</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Opened from the {side}.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}

export const DrawerStory: Story = {
  name: "Drawer",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Log time</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Log time</DrawerTitle>
            <DrawerDescription>Drag down or tap outside to close.</DrawerDescription>
          </DrawerHeader>
          <EntryForm />
          <DrawerFooter>
            <Button>Save entry</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
}
