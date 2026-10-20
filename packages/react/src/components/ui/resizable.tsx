"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import * as ResizablePrimitive from "react-resizable-panels"
import { PanelLeftIcon, PanelRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useHotkeys } from "@/hooks/use-hotkeys"

type ResizableSidebarState = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const ResizableSidebarContext = React.createContext<{
  sidebars: Record<string, ResizableSidebarState>
  register: (id: string, state: ResizableSidebarState | null) => void
} | null>(null)

// Lets a ResizableSidebarTrigger or useResizableSidebar outside the panel
// group reach its sidebars. A ResizablePanelGroup provides one itself when
// there is none above it.
function ResizableSidebarProvider({ children }: { children?: React.ReactNode }) {
  const [sidebars, setSidebars] = React.useState<
    Record<string, ResizableSidebarState>
  >({})

  const register = React.useCallback(
    (id: string, state: ResizableSidebarState | null) => {
      setSidebars((current) => {
        const next = { ...current }

        if (state) {
          next[id] = state
        } else {
          delete next[id]
        }

        return next
      })
    },
    []
  )

  const value = React.useMemo(() => ({ sidebars, register }), [sidebars, register])

  return (
    <ResizableSidebarContext.Provider value={value}>
      {children}
    </ResizableSidebarContext.Provider>
  )
}

// The open state of a ResizableSidebar, by its id.
function useResizableSidebar(id = "sidebar"): ResizableSidebarState {
  const context = React.useContext(ResizableSidebarContext)

  if (!context) {
    throw new Error(
      "useResizableSidebar must be used inside a ResizablePanelGroup or ResizableSidebarProvider."
    )
  }

  return (
    context.sidebars[id] ?? { open: false, setOpen: () => {}, toggle: () => {} }
  )
}

// Lets the sidebars in a group follow its layout as it changes.
const ResizableLayoutContext = React.createContext<
  ((listener: () => void) => () => void) | null
>(null)

const noStorage: ResizablePrimitive.LayoutStorage = {
  getItem: () => null,
  setItem: () => {},
}

function ResizablePanelGroup({
  className,
  autoSaveId,
  defaultLayout,
  onLayoutChange,
  onLayoutChanged,
  ...props
}: ResizablePrimitive.GroupProps & {
  /** Saves the panel sizes in localStorage under this key. */
  autoSaveId?: string
}) {
  const saved = ResizablePrimitive.useDefaultLayout({
    id: autoSaveId ?? "",
    storage:
      autoSaveId && typeof window !== "undefined" ? window.localStorage : noStorage,
  })
  const context = React.useContext(ResizableSidebarContext)
  const listeners = React.useRef(new Set<() => void>())

  const subscribe = React.useCallback((listener: () => void) => {
    listeners.current.add(listener)
    return () => {
      listeners.current.delete(listener)
    }
  }, [])

  const group = (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      defaultLayout={defaultLayout ?? (autoSaveId ? saved.defaultLayout : undefined)}
      onLayoutChange={(layout) => {
        listeners.current.forEach((listener) => listener())
        onLayoutChange?.(layout)
      }}
      onLayoutChanged={(layout, meta) => {
        if (autoSaveId) {
          saved.onLayoutChanged(layout, meta)
        }
        onLayoutChanged?.(layout, meta)
      }}
      {...props}
    />
  )

  return (
    <ResizableLayoutContext.Provider value={subscribe}>
      {context ? group : <ResizableSidebarProvider>{group}</ResizableSidebarProvider>}
    </ResizableLayoutContext.Provider>
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

// A working panel, such as an inspector or a chat, that resizes, snaps shut
// when dragged below its minimum size and opens and closes from a trigger or
// a shortcut. Give each one in a group its own id.
function ResizableSidebar({
  id = "sidebar",
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  shortcut,
  defaultSize = "25%",
  minSize = "12rem",
  collapsedSize = 0,
  className,
  ...props
}: Omit<ResizablePrimitive.PanelProps, "id" | "collapsible" | "panelRef"> & {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** A shortcut that toggles the sidebar, such as "mod+b". */
  shortcut?: string
}) {
  const panelRef = ResizablePrimitive.usePanelRef()
  const context = React.useContext(ResizableSidebarContext)
  const subscribe = React.useContext(ResizableLayoutContext)
  const register = context?.register
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState

  const onOpenChangeRef = React.useRef(onOpenChange)
  React.useLayoutEffect(() => {
    onOpenChangeRef.current = onOpenChange
  })

  const setOpen = React.useCallback((next: boolean) => {
    setOpenState(next)
    onOpenChangeRef.current?.(next)
  }, [])

  const toggle = React.useCallback(() => {
    setOpen(!!panelRef.current?.isCollapsed())
  }, [panelRef, setOpen])

  // Moves the panel when `open` changes. A saved layout decides the first
  // size, and dragging the panel open or shut updates `applied` below.
  const applied = React.useRef(open)
  React.useEffect(() => {
    const panel = panelRef.current

    if (applied.current === open || !panel) {
      return
    }

    applied.current = open

    if (open) {
      panel.expand()
    } else {
      panel.collapse()
    }
  }, [open, panelRef])

  // Follows the panel when a saved layout starts it shut or it is dragged
  // open or shut.
  React.useEffect(() => {
    const sync = () => {
      const collapsed = panelRef.current?.isCollapsed()

      if (collapsed !== undefined && collapsed === applied.current) {
        applied.current = !collapsed
        setOpen(!collapsed)
      }
    }

    sync()
    return subscribe?.(sync)
  }, [panelRef, setOpen, subscribe])

  React.useEffect(() => {
    register?.(id, { open, setOpen, toggle })
  }, [register, id, open, setOpen, toggle])

  React.useEffect(() => () => register?.(id, null), [register, id])

  useHotkeys(shortcut ?? "", toggle, { enabled: !!shortcut })

  return (
    <ResizablePrimitive.Panel
      id={id}
      data-slot="resizable-sidebar"
      data-state={open ? "open" : "collapsed"}
      panelRef={panelRef}
      collapsible
      collapsedSize={collapsedSize}
      minSize={minSize}
      defaultSize={open ? defaultSize : collapsedSize}
      // A sidebar collapsed to nothing is hidden, so its controls can't be tabbed to.
      className={cn(!open && !parseFloat(String(collapsedSize)) && "invisible", className)}
      {...props}
    />
  )
}

function ResizableSidebarTrigger({
  sidebar = "sidebar",
  side = "start",
  className,
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  /** The id of the ResizableSidebar to toggle. */
  sidebar?: string
  /** Which edge the sidebar is on, for the icon. */
  side?: "start" | "end"
}) {
  const { open, toggle } = useResizableSidebar(sidebar)

  return (
    <Button
      data-slot="resizable-sidebar-trigger"
      data-state={open ? "open" : "collapsed"}
      variant="ghost"
      size="icon-sm"
      aria-expanded={open}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggle()
      }}
      {...props}
    >
      {children ?? (
        <>
          {side === "end" ? <PanelRightIcon /> : <PanelLeftIcon />}
          <span className="sr-only">Toggle sidebar</span>
        </>
      )}
    </Button>
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
      )}
    </ResizablePrimitive.Separator>
  )
}

export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSidebar,
  ResizableSidebarProvider,
  ResizableSidebarTrigger,
  useResizableSidebar,
}
