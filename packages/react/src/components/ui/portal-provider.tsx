"use client"

import * as React from "react"

const PortalContainerContext = React.createContext<HTMLElement | null>(null)

// Sets where dialogs, menus, popovers, tooltips and other overlays render.
// They render into document.body by default, which breaks inside a scaled or
// transformed container, a zoomable canvas or an iframe.
function PortalProvider({
  container,
  children,
}: {
  container: HTMLElement | null
  children?: React.ReactNode
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  )
}

// The element overlays render into, or undefined for document.body.
function usePortalContainer() {
  return React.useContext(PortalContainerContext) ?? undefined
}

export { PortalProvider, usePortalContainer }
