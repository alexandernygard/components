---
"@alexandernygard/components": patch
"@alexandernygard/components-svelte": patch
---

`DialogContent` gives its grid one `minmax(0,1fr)` column, so a child that won't wrap (like a truncated title in a flex row) no longer pushes the content past the dialog's max width.
