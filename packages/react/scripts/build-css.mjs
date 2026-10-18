// Builds the CSS entry points in dist/:
//   theme.css   for apps that run Tailwind 4 themselves (tokens + @source pointing at dist)
//   styles.css  precompiled, for apps without Tailwind
//   fonts.css   font imports, pulled in by both
// Tokens and fonts come from @alexandernygard/tokens, shared with the Svelte library.
import { execFileSync } from "node:child_process"
import { copyFileSync, readFileSync, rmSync, writeFileSync } from "node:fs"

const src = (f) => new URL(`../src/styles/${f}`, import.meta.url).pathname
const dist = (f) => new URL(`../dist/${f}`, import.meta.url).pathname

copyFileSync(src("shadcn.css"), dist("shadcn.css"))
writeFileSync(dist("fonts.css"), `@import "@alexandernygard/tokens/fonts.css";\n`)

writeFileSync(
  dist("theme.css"),
  `/* @alexandernygard/components for Tailwind 4 apps.
 *   @import "tailwindcss";
 *   @import "@alexandernygard/components/theme.css";
 */
@import "tw-animate-css";
@import "./shadcn.css";
@import "@alexandernygard/tokens";

@source "./";
`,
)

const entry = dist("_styles.entry.css")
writeFileSync(
  entry,
  `@import "tailwindcss";
@import "tw-animate-css";
@import "./shadcn.css";
@import "@alexandernygard/tokens/tokens.css";
@source "./";
`,
)
execFileSync("npx", ["@tailwindcss/cli", "-i", entry, "-o", dist("styles.css"), "--minify"], { stdio: "inherit" })
rmSync(entry)
writeFileSync(dist("styles.css"), `@import "./fonts.css";\n` + readFileSync(dist("styles.css"), "utf8"))
