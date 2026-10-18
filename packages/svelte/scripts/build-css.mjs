// Adds dist/styles.css after svelte-package: the precompiled stylesheet for Svelte apps
// that don't run Tailwind. Apps on Tailwind 4 import dist/styles/theme.css instead.
import { execFileSync } from "node:child_process"
import { readFileSync, rmSync, writeFileSync } from "node:fs"

const dist = (f) => new URL(`../dist/${f}`, import.meta.url).pathname

const entry = dist("_styles.entry.css")
writeFileSync(
  entry,
  `@import "tailwindcss";
@import "tw-animate-css";
@import "./styles/shadcn.css";
@import "@alexandernygard/tokens/tokens.css";
@source "./";
`,
)
execFileSync("npx", ["@tailwindcss/cli", "-i", entry, "-o", dist("styles.css"), "--minify"], { stdio: "inherit" })
rmSync(entry)
writeFileSync(
  dist("styles.css"),
  `@import "@alexandernygard/tokens/fonts.css";\n` + readFileSync(dist("styles.css"), "utf8"),
)
