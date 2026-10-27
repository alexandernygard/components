import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"
import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  SessionList,
  SessionListButton,
  SessionListEmpty,
  SessionListGroup,
  SessionListItem,
  SessionListSkeleton,
  SessionListStatus,
  SessionListTitle,
} from "@/components/ui/session-list"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { DemoSessionList, type DemoSession, now, sampleSessions, useDemoSessions } from "./sessions"
import { typeText } from "./test-utils"

type Args = {
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onPin: (id: string, pinned: boolean) => void
  onFork: (id: string) => void
  onDelete: (id: string) => void
}

const meta = {
  title: "Chat/Sessions",
  parameters: { layout: "padded" },
  args: { onSelect: fn(), onRename: fn(), onPin: fn(), onFork: fn(), onDelete: fn() },
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Meta<Args>>

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="w-64 rounded-xl border bg-sidebar p-2 text-sidebar-foreground">{children}</div>
}

function StatefulList({ initial = sampleSessions, args }: { initial?: DemoSession[]; args: Args }) {
  const { props } = useDemoSessions(initial, args)
  return <DemoSessionList {...props} />
}

/** Pinned first, then by date. A spinner while running, an amber dot for an unread reply, red when it failed. */
export const Default: Story = {
  render: (args) => (
    <Panel>
      <StatefulList args={args} />
    </Panel>
  ),
}

export const Loading: Story = {
  render: () => (
    <Panel>
      <SessionListSkeleton />
    </Panel>
  ),
}

export const Empty: Story = {
  render: () => (
    <Panel>
      <DemoSessionList sessions={[]} />
    </Panel>
  ),
}

export const LongTitles: Story = {
  name: "Long titles",
  render: (args) => (
    <Panel>
      <StatefulList
        args={args}
        initial={[
          { id: "l1", title: "A very long title that goes on and on about mortgages and interest rates", updatedAt: now.getTime() },
          { id: "l2", title: "Supercalifragilisticexpialidocious".repeat(3), updatedAt: now.getTime(), status: "running" },
          { id: "l3", title: "Short", updatedAt: now.getTime() },
        ]}
      />
    </Panel>
  ),
}

export const Statuses: Story = {
  render: () => (
    <Panel>
      <SessionList>
        <SessionListGroup label="Statuses">
          {(["running", "unread", "error"] as const).map((status) => (
            <SessionListItem key={status}>
              <SessionListButton>
                <SessionListTitle className="capitalize">{status}</SessionListTitle>
                <SessionListStatus status={status} />
              </SessionListButton>
            </SessionListItem>
          ))}
          <SessionListItem>
            <SessionListButton active>
              <SessionListTitle>Active</SessionListTitle>
            </SessionListButton>
          </SessionListItem>
          <SessionListItem>
            <SessionListButton asChild>
              <a href="#session">As a link</a>
            </SessionListButton>
          </SessionListItem>
        </SessionListGroup>
      </SessionList>
    </Panel>
  ),
}

function SidebarDemo({ args }: { args: Args }) {
  const { sessions, setSessions, activeId, setActiveId, props } = useDemoSessions(sampleSessions, args)
  const [query, setQuery] = React.useState("")
  const visible = sessions.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
  const active = sessions.find((s) => s.id === activeId)

  return (
    <SidebarProvider className="min-h-[600px]">
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="gap-2">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              const session = { id: `new-${Date.now()}`, title: "New chat", updatedAt: now.getTime() }
              setSessions((list) => [session, ...list])
              setActiveId(session.id)
            }}
          >
            <PlusIcon />
            New chat
          </Button>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search conversations"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </SidebarHeader>
        <SidebarContent className="px-2 pb-2">
          {visible.length || !query ? (
            <DemoSessionList {...props} sessions={visible} />
          ) : (
            <SessionListEmpty>Nothing matches “{query}”</SessionListEmpty>
          )}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="truncate text-sm font-medium" data-testid="open-title">
            {active?.title ?? "No conversation open"}
          </span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const InSidebar: Story = {
  name: "In a sidebar",
  parameters: { layout: "fullscreen" },
  render: (args) => <SidebarDemo args={args} />,
}

// ---------------------------------------------------------------------------
// Tests

async function openMenu(title: string) {
  await userEvent.click(screen.getByRole("button", { name: `More for ${title}` }))
  return screen.findByRole("menu")
}

async function pick(item: string) {
  await userEvent.click(await screen.findByRole("menuitem", { name: item }))
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
}

export const SelectSession: Story = {
  name: "Test: open a conversation",
  tags: ["test"],
  render: (args) => (
    <Panel>
      <StatefulList args={args} />
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByRole("button", { name: /Deposit plan/ })
    await expect(within(row).getByRole("img", { name: "Unread" })).toBeInTheDocument()
    await userEvent.click(row)
    await expect(row).toHaveAttribute("aria-current", "page")
    await expect(args.onSelect).toHaveBeenCalledWith("s2")
    await expect(within(row).queryByRole("img", { name: "Unread" })).toBeNull()
  },
}

export const RenameSession: Story = {
  name: "Test: rename",
  tags: ["test"],
  render: (args) => (
    <Panel>
      <StatefulList args={args} />
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await openMenu("Forgotten subscriptions")
    await pick("Rename")
    const input = canvas.getByLabelText("Rename") as HTMLInputElement
    await waitFor(() => expect(input).toHaveFocus())
    input.select()
    await userEvent.keyboard("Streaming services")
    await userEvent.keyboard("{Enter}")
    await expect(args.onRename).toHaveBeenCalledWith("s3", "Streaming services")
    await expect(canvas.getByText("Streaming services")).toBeInTheDocument()
  },
}

export const RenameCancel: Story = {
  name: "Test: rename, then Escape",
  tags: ["test"],
  render: (args) => (
    <Panel>
      <StatefulList args={args} />
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await openMenu("Forgotten subscriptions")
    await pick("Rename")
    const input = canvas.getByLabelText("Rename") as HTMLInputElement
    await waitFor(() => expect(input).toHaveFocus())
    typeText(input, " and more")
    await userEvent.keyboard("{Escape}")
    await expect(canvas.queryByLabelText("Rename")).toBeNull()
    await expect(canvas.getByText("Forgotten subscriptions")).toBeInTheDocument()
    await expect(args.onRename).not.toHaveBeenCalled()
  },
}

export const PinAndDelete: Story = {
  name: "Test: pin, fork and delete",
  tags: ["test"],
  render: (args) => (
    <Panel>
      <StatefulList args={args} />
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const pinned = () => within(canvas.getByRole("region", { name: "Pinned" }))

    await openMenu("Tax return questions")
    await pick("Pin")
    await expect(args.onPin).toHaveBeenCalledWith("s5", true)
    await expect(pinned().getByText("Tax return questions")).toBeInTheDocument()

    await openMenu("Tax return questions")
    await pick("Fork")
    await expect(args.onFork).toHaveBeenCalledWith("s5")
    await expect(canvas.getByText("Tax return questions (fork)")).toBeInTheDocument()

    await openMenu("Tax return questions")
    await pick("Delete")
    await expect(args.onDelete).toHaveBeenCalledWith("s5")
    await expect(canvas.queryByText("Tax return questions")).toBeNull()
  },
}

export const SearchAndCreate: Story = {
  name: "Test: search and new chat",
  tags: ["test"],
  parameters: { layout: "fullscreen" },
  render: (args) => <SidebarDemo args={args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    typeText(canvas.getByLabelText("Search conversations") as HTMLInputElement, "mortgage")
    await waitFor(() => expect(canvas.queryByText("Forgotten subscriptions")).toBeNull())
    await expect(canvas.getByText("Mortgage rates explained")).toBeInTheDocument()

    typeText(canvas.getByLabelText("Search conversations") as HTMLInputElement, "zzz")
    await expect(await canvas.findByText(/Nothing matches/)).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: "New chat" }))
    await expect(canvas.getByTestId("open-title")).toHaveTextContent("New chat")
  },
}
