# @alexandernygard/components-svelte

## 0.2.0

### Minor Changes

- 39b5a6b: Add Markdown (GFM, safe for model output, closes half-written syntax while streaming, code blocks use CodeBlock), PromptInput (Enter sends, grows with its text, stop button while a reply streams, attach, paste or drop files), ResizableSidebar with a trigger, a keyboard shortcut and saved sizes, a useHotkeys hook with KbdShortcut to display shortcuts, and PortalProvider to render overlays inside a scaled container or iframe. InputGroup no longer dims when only a button inside it is disabled.

## 0.1.2

### Patch Changes

- 62c3991: Dark mode is now charcoal instead of blue-black. The background is `#1c1d1f` with warm off-white ink (`#e7e4de`), cards, popovers, muted and secondary surfaces step up from it in the same family, borders and inputs are tinted with the ink colour, and shadows lose their blue tint. Cloudberry stays the only accent, and muted text keeps at least 5.4:1 contrast on every surface.
- Updated dependencies [62c3991]
  - @alexandernygard/tokens@0.1.2

## 0.1.1

### Patch Changes

- c6bec47: Set everything in Libron. `font-sans`, `font-serif` and `font-heading` now all use Libron from `@alexandernygard/libron`, and Schibsted Grotesk is no longer loaded. An app that wants a different face can override any of the three in its own `@theme`.
- Updated dependencies [c6bec47]
  - @alexandernygard/tokens@0.1.1
