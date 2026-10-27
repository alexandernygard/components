---
"@alexandernygard/components": patch
"@alexandernygard/components-svelte": patch
---

Markdown: the copy button on a code block without a language floats over the code again instead of taking up a row above it. The block keeps CodeBlock's `data-slot="code-block"` and is marked with `data-markdown="code"` instead of `data-slot="markdown-code"`.
