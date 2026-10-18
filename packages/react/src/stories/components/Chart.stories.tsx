import type { Meta, StoryObj } from "@storybook/react-vite"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const meta = {
  title: "Components/Chart",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const spending = [
  { month: "May", groceries: 5200, transport: 1100, eatingOut: 1800 },
  { month: "Jun", groceries: 5600, transport: 900, eatingOut: 2400 },
  { month: "Jul", groceries: 4800, transport: 600, eatingOut: 3100 },
  { month: "Aug", groceries: 5900, transport: 1200, eatingOut: 2000 },
  { month: "Sep", groceries: 6100, transport: 1300, eatingOut: 1600 },
  { month: "Oct", groceries: 4300, transport: 900, eatingOut: 1200 },
]

const spendingConfig = {
  groceries: { label: "Groceries", color: "var(--chart-1)" },
  transport: { label: "Transport", color: "var(--chart-3)" },
  eatingOut: { label: "Eating out", color: "var(--chart-2)" },
} satisfies ChartConfig

export const StackedBars: Story = {
  name: "Stacked bars",
  render: () => (
    <Card className="w-[36rem]">
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
        <CardDescription>May to October 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={spendingConfig} className="h-64 w-full">
          <BarChart data={spending} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${v / 1000}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="groceries" stackId="a" fill="var(--color-groceries)" />
            <Bar dataKey="transport" stackId="a" fill="var(--color-transport)" />
            <Bar dataKey="eatingOut" stackId="a" fill="var(--color-eatingOut)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
}

const savings = [
  { month: "Jan", saved: 288000 },
  { month: "Feb", saved: 301000 },
  { month: "Mar", saved: 309500 },
  { month: "Apr", saved: 322000 },
  { month: "May", saved: 331500 },
  { month: "Jun", saved: 345000 },
  { month: "Jul", saved: 352000 },
  { month: "Aug", saved: 371500 },
  { month: "Sep", saved: 389000 },
  { month: "Oct", saved: 412000 },
]

const savingsConfig = { saved: { label: "Saved", color: "var(--chart-1)" } } satisfies ChartConfig

export const Area_: Story = {
  name: "Area",
  render: () => (
    <Card className="w-[36rem]">
      <CardHeader>
        <CardTitle>Deposit savings</CardTitle>
        <CardDescription>kr 412 000 saved this year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={savingsConfig} className="h-56 w-full">
          <AreaChart data={savings} accessibilityLayer>
            <defs>
              <linearGradient id="fillSaved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-saved)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-saved)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="saved"
              type="monotone"
              stroke="var(--color-saved)"
              strokeWidth={2}
              fill="url(#fillSaved)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
}
