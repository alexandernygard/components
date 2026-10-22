---
"@alexandernygard/components": minor
---

ResizableSidebar opens as a sheet over the page on a phone (under 768px), shut until its trigger or shortcut opens it, with new `side` and `title` props for the edge it slides from and its screen-reader name. On touch screens (`pointer: coarse`) buttons, toggles, select triggers, tabs and menu items grow to at least 40px and inputs to 16px text so iOS doesn't zoom in; a mouse keeps the dense sizes. A `coarse:` variant does the same for an app's own controls.

useIsMobile knows the answer on the first render instead of reporting `false` until an effect runs, so a phone no longer flashes the desktop layout.
