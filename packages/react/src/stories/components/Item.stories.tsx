import type { Meta, StoryObj } from "@storybook/react-vite"
import { BadgeCheckIcon, ChevronRightIcon, GitPullRequestIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

const meta = {
  title: "Components/Item",
  component: Item,
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="grid w-[28rem] gap-3">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <BadgeCheckIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your email is verified</ItemTitle>
          <ItemDescription>alex@nyggis.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Change
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Two-factor authentication</ItemTitle>
          <ItemDescription>Ask for a code when signing in on a new device.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Turn on</Button>
        </ItemActions>
      </Item>
      <Item asChild>
        <a href="#">
          <ItemContent>
            <ItemTitle>Billing history</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  ),
}

const prs = [
  ["Cache images by lockfile hash", "lommebok #42", "IH", "Review requested"],
  ["Keyboard shortcut for pausing", "ur #118", "AN", "Checks passed"],
  ["Add dark mode to the room viewer", "floorplate #9", "MS", "Changes requested"],
]

export const List: Story = {
  render: () => (
    <ItemGroup className="w-[30rem] rounded-xl border">
      {prs.map(([title, ref, who, status], i) => (
        <div key={ref}>
          {i > 0 && <ItemSeparator />}
          <Item size="sm">
            <ItemMedia>
              <Avatar size="sm">
                <AvatarFallback>{who}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription className="flex items-center gap-1">
                <GitPullRequestIcon className="size-3.5" />
                {ref}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge
                variant={
                  status === "Checks passed" ? "positive" : status === "Changes requested" ? "warning" : "secondary"
                }
              >
                {status}
              </Badge>
            </ItemActions>
          </Item>
        </div>
      ))}
    </ItemGroup>
  ),
}
