---
"@alexandernygard/components": minor
"@alexandernygard/components-svelte": minor
---

Add Tool call, Tool value and Tool views for assistant tool calls. ToolCall covers every ai-kit tool state, including streaming input, approvals, errors and denied calls. The value viewers (JsonTree, KeyValue, ValueTable, DiffView, TerminalOutput) and ToolValue, which picks one from the shape of the value, show inputs and outputs. ToolViewsProvider sets the icon, title, summary and input and output rendering for each tool, and ToolTrace renders ai-kit tool calls with those views. A code view highlights by the file extension of the call's `path`, `file_path` or `filename` input, and `language` can be a function that picks it for each call.
