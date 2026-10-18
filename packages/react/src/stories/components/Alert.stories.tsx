import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3">
      <Alert>
        <InfoIcon />
        <AlertTitle>Bank sync runs every morning</AlertTitle>
        <AlertDescription>New transactions show up by 06:30.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>A new version is available</AlertTitle>
        <AlertDescription>Restart ur to update to 1.4.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="outline">
            Restart
          </Button>
        </AlertAction>
      </Alert>
      <Alert variant="positive">
        <CircleCheckIcon />
        <AlertTitle>You're under budget this month</AlertTitle>
        <AlertDescription>kr 2 140 left with 9 days to go.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Eating out is at 92%</AlertTitle>
        <AlertDescription>kr 320 left until the 1st.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Import failed</AlertTitle>
        <AlertDescription>Row 18 has no date. Fix it in the file and import again.</AlertDescription>
      </Alert>
    </div>
  ),
}
