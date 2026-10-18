---
"@alexandernygard/tokens": patch
"@alexandernygard/components": patch
"@alexandernygard/components-svelte": patch
---

Set everything in Libron. `font-sans`, `font-serif` and `font-heading` now all use Libron from `@alexandernygard/libron`, and Schibsted Grotesk is no longer loaded. An app that wants a different face can override any of the three in its own `@theme`.
