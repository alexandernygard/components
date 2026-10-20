---
"@alexandernygard/components": minor
---

recharts is now a peer dependency (^3.8.0) instead of a pinned dependency, so an app's own recharts is used and chart types no longer clash. pnpm installs it automatically; with npm or yarn, add recharts to the app.
