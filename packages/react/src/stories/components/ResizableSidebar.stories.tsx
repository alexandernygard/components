import type { Meta, StoryObj } from "@storybook/react-vite"

import { KbdShortcut } from "@/components/ui/kbd"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSidebar,
  ResizableSidebarProvider,
  ResizableSidebarTrigger,
  useResizableSidebar,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"

const meta = {
  title: "Components/Resizable sidebar",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ChatStatus() {
  const { open } = useResizableSidebar("chat")
  return <span className="text-xs text-muted-foreground">Chat {open ? "open" : "closed"}</span>
}

export const EditorInspectorChat: Story = {
  name: "Editor, inspector and chat",
  render: () => (
    <ResizableSidebarProvider>
      <div className="flex h-[32rem] flex-col border">
        <header className="flex h-11 shrink-0 items-center gap-1 border-b px-2">
          <ResizableSidebarTrigger sidebar="files" />
          <span className="text-sm font-medium">budget.deck.tsx</span>
          <div className="ml-auto flex items-center gap-2">
            <ChatStatus />
            <Separator orientation="vertical" className="h-4" />
            <ResizableSidebarTrigger sidebar="chat" side="end" />
          </div>
        </header>
        <ResizablePanelGroup orientation="horizontal" autoSaveId="story-editor-layout">
          <ResizableSidebar id="files" defaultSize="18%" minSize="10rem" maxSize="30%" shortcut="mod+b">
            <div className="flex h-full flex-col gap-1 p-3 text-sm">
              <p className="mb-1 font-medium">Files</p>
              <p className="text-muted-foreground">budget.deck.tsx</p>
              <p className="text-muted-foreground">savings.csv</p>
            </div>
          </ResizableSidebar>
          <ResizableHandle />
          <ResizablePanel id="editor" minSize="20rem">
            <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <p>Drag a handle below a sidebar's minimum width to snap it shut.</p>
              <p className="flex items-center gap-2">
                Files <KbdShortcut keys="mod+b" /> Chat <KbdShortcut keys="mod+j" />
              </p>
              <p>Sizes are saved between visits.</p>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizableSidebar id="chat" defaultSize="28%" minSize="16rem" maxSize="45%" shortcut="mod+j">
            <div className="flex h-full flex-col p-3 text-sm">
              <p className="font-medium">Assistant</p>
              <p className="mt-auto text-muted-foreground">Ask about this deck…</p>
            </div>
          </ResizableSidebar>
        </ResizablePanelGroup>
      </div>
    </ResizableSidebarProvider>
  ),
}

export const CollapsesToIcons: Story = {
  name: "Collapses to a strip",
  render: () => (
    <div className="h-80 border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizableSidebar defaultSize="25%" minSize="12rem" collapsedSize="3rem">
          <div className="flex h-full flex-col gap-2 p-2">
            <ResizableSidebarTrigger />
          </div>
        </ResizableSidebar>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            The trigger lives inside the sidebar and stays visible when it is collapsed.
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}
