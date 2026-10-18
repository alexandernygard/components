import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const meta = {
  title: "Components/Calendar",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const today = new Date(2026, 9, 18)

export const Single: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(today)
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={today}
        weekStartsOn={1}
        className="rounded-xl border"
      />
    )
  },
}

export const Range: Story = {
  render: function Render() {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: today,
      to: addDays(today, 6),
    })
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        defaultMonth={today}
        numberOfMonths={2}
        weekStartsOn={1}
        className="rounded-xl border"
      />
    )
  },
}

export const DatePicker: Story = {
  name: "Date picker",
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>()
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-60 justify-start font-normal">
            <CalendarIcon data-icon="inline-start" />
            {date ? format(date, "d MMMM yyyy") : <span className="text-muted-foreground">Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={today} weekStartsOn={1} />
        </PopoverContent>
      </Popover>
    )
  },
}
