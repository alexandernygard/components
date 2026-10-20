// Regenerates src/index.ts from the files in src/components/ui.
import { readdirSync, writeFileSync } from "node:fs"

const ui = readdirSync(new URL("../src/components/ui", import.meta.url))
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort()

const lines = [
  "// Generated list of public exports. Run `node scripts/gen-index.mjs` after adding a component.",
  'export * from "./lib/utils"',
  'export * from "./hooks/use-mobile"',
  'export * from "./hooks/use-highlighted-code"',
  'export * from "./hooks/use-hotkeys"',
  ...ui.map((name) => `export * from "./components/ui/${name}"`),
]
writeFileSync(new URL("../src/index.ts", import.meta.url), lines.join("\n") + "\n")
console.log(`index.ts: ${ui.length} components`)
