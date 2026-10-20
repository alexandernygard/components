import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { KbdShortcut } from "@/components/ui/kbd"
import { useHotkeys } from "@/hooks/use-hotkeys"

const meta = {
  title: "Components/Hotkeys",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const UseHotkeys: Story = {
  name: "useHotkeys",
  render: function Render() {
    const [log, setLog] = React.useState<string[]>([])
    const add = (entry: string) => setLog((l) => [entry, ...l].slice(0, 5))

    useHotkeys(["mod+z", "mod+shift+z"], (_, hotkey) => add(hotkey === "mod+z" ? "Undo" : "Redo"))
    useHotkeys("shift+?", () => add("Show shortcuts"))

    return (
      <div className="grid max-w-sm gap-4">
        <div className="grid gap-2 text-sm">
          <p className="flex items-center justify-between">Undo <KbdShortcut keys="mod+z" /></p>
          <p className="flex items-center justify-between">Redo <KbdShortcut keys="mod+shift+z" /></p>
          <p className="flex items-center justify-between">Shortcuts <KbdShortcut keys="shift+?" /></p>
        </div>
        <Input placeholder="Typing here doesn't trigger them" />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open a dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shortcuts are paused in dialogs</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <ul className="min-h-24 text-sm text-muted-foreground">
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    )
  },
}

export const InAMenu: Story = {
  name: "In a menu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>
          Undo
          <DropdownMenuShortcut>
            <KbdShortcut keys="mod+z" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Find
          <DropdownMenuShortcut>
            <KbdShortcut keys="mod+f" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
