import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { ChevronsUpDownIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const meta = {
  title: "Components/Accordion and collapsible",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AccordionStory: Story = {
  name: "Accordion",
  render: () => (
    <Accordion type="single" collapsible defaultValue="sync" className="w-96">
      <AccordionItem value="sync">
        <AccordionTrigger>How often do transactions sync?</AccordionTrigger>
        <AccordionContent>
          Every morning at 06:00. You can also sync by hand from the transactions page.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="share">
        <AccordionTrigger>Can I share a budget?</AccordionTrigger>
        <AccordionContent>
          Yes. Invite someone by email from the budget's settings. They can view or edit, your choice.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="export">
        <AccordionTrigger>Can I export my data?</AccordionTrigger>
        <AccordionContent>Download everything as CSV from settings at any time.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const CollapsibleStory: Story = {
  name: "Collapsible",
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="grid w-80 gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">3 repositories with failing checks</p>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Toggle">
              <ChevronsUpDownIcon />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-lg border px-3 py-2 text-sm">alexandernygard/lommebok</div>
        <CollapsibleContent className="grid gap-2">
          <div className="rounded-lg border px-3 py-2 text-sm">alexandernygard/ur</div>
          <div className="rounded-lg border px-3 py-2 text-sm">alexandernygard/portfolio</div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
}
