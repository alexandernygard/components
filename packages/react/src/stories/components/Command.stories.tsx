import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { CalendarIcon, CreditCardIcon, FolderIcon, PlusIcon, SettingsIcon, TimerIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const meta = {
  title: "Components/Command",
  component: Command,
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

function Items() {
  return (
    <>
      <CommandEmpty>Nothing matches that. Try a project or a command name.</CommandEmpty>
      <CommandGroup heading="Actions">
        <CommandItem>
          <TimerIcon />
          Start timer
          <CommandShortcut>⌘T</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <PlusIcon />
          New entry
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <CalendarIcon />
          Go to this week
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Projects">
        <CommandItem>
          <FolderIcon />
          Portfolio redesign
        </CommandItem>
        <CommandItem>
          <FolderIcon />
          Lommebok
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <CreditCardIcon />
          Billing
        </CommandItem>
        <CommandItem>
          <SettingsIcon />
          Preferences
          <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

export const Inline: Story = {
  render: () => (
    <Command className="w-96 rounded-xl border shadow-md">
      <CommandInput placeholder="Search projects and commands" />
      <CommandList>
        <Items />
      </CommandList>
    </Command>
  ),
}

export const Palette: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    React.useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((o) => !o)
        }
      }
      document.addEventListener("keydown", onKey)
      return () => document.removeEventListener("keydown", onKey)
    }, [])
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Search
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput placeholder="Search projects and commands" />
            <CommandList>
              <Items />
            </CommandList>
          </Command>
        </CommandDialog>
      </>
    )
  },
}
