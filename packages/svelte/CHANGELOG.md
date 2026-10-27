# @alexandernygard/components-svelte

## 0.4.0

### Minor Changes

- 8e43c3f: Add Tool call, Tool value and Tool views for assistant tool calls. ToolCall covers every ai-kit tool state, including streaming input, approvals, errors and denied calls. The value viewers (JsonTree, KeyValue, ValueTable, DiffView, TerminalOutput) and ToolValue, which picks one from the shape of the value, show inputs and outputs. ToolViewsProvider sets the icon, title, summary and input and output rendering for each tool, and ToolTrace renders ai-kit tool calls with those views. A code view highlights by the file extension of the call's `path`, `file_path` or `filename` input, and `language` can be a function that picks it for each call.

### Patch Changes

- 8e43c3f: Markdown: the copy button on a code block without a language floats over the code again instead of taking up a row above it. The block keeps CodeBlock's `data-slot="code-block"` and is marked with `data-markdown="code"` instead of `data-slot="markdown-code"`.

## 0.3.0

### Minor Changes

- 73ec7ba: Add Illustration: generative art from @alexandernygard/illustrations that follows dark mode, for empty states, heroes and covers.

## 0.2.1

### Patch Changes

- Re-release of 0.2.0, which got stuck on npm and was never published. No code changes.

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
