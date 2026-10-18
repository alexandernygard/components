import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Savings goal</CardTitle>
        <CardDescription>A deposit for a flat in Oslo by summer 2028.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More">
            <MoreHorizontalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-1">
        <p className="text-3xl font-medium tabular-nums">kr 412 000</p>
        <p className="text-sm text-muted-foreground">of kr 600 000, on track for May 2028</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Badge variant="secondary">+ kr 9 500 / month</Badge>
        <Button size="sm" variant="outline">
          Adjust plan
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const WithForm: Story = {
  name: "With form",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use the email you signed up with.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="card-email">Email</Label>
          <Input id="card-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="card-password">Password</Label>
          <Input id="card-password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Sign in</Button>
        <Button className="w-full" variant="ghost">
          Email me a sign-in link
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Small: Story = {
  render: () => (
    <div className="grid w-[36rem] grid-cols-3 gap-3">
      {[
        ["Today", "6 h 40 m"],
        ["This week", "31 h 15 m"],
        ["Billable", "82%"],
      ].map(([label, value]) => (
        <Card key={label} size="sm">
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="font-sans text-xl font-medium tabular-nums">{value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
}
