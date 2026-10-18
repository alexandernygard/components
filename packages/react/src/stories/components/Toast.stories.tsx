import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/sonner"

const meta = {
  title: "Components/Toast",
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster position="bottom-right" />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Entry saved")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Budget published", { description: "Shared with Ingrid." })}
      >
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("Sync runs every morning at 06:00")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Groceries is at 92% of its limit")}>
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Import failed", { description: "Row 18 has no date. Fix it and import again." })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Entry deleted", { action: { label: "Undo", onClick: () => toast("Entry restored") } })
        }
      >
        With undo
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1500)), {
            loading: "Importing 312 transactions",
            success: "Imported 312 transactions",
            error: "Import failed",
          })
        }
      >
        Promise
      </Button>
    </div>
  ),
}
