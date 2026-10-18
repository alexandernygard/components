// Builds the CSS entry points in dist/:
//   theme.css   for apps that run Tailwind 4 themselves (tokens + @source pointing at dist)
//   styles.css  precompiled, for apps without Tailwind
//   fonts.css   font imports, pulled in by both
import { execFileSync } from "node:child_process"
import { copyFileSync, readFileSync, rmSync, writeFileSync } from "node:fs"

const src = (f) => new URL(`../src/styles/${f}`, import.meta.url).pathname
const dist = (f) => new URL(`../dist/${f}`, import.meta.url).pathname

for (const f of ["tokens.css", "shadcn.css", "fonts.css"]) copyFileSync(src(f), dist(f))

writeFileSync(
  dist("theme.css"),
  `/* @alexandernygard/components for Tailwind 4 apps.
 *   @import "tailwindcss";
 *   @import "@alexandernygard/components/theme.css";
 */
@import "tw-animate-css";
@import "./shadcn.css";
@import "./fonts.css";
@import "./tokens.css";

@source "./";
`,
)

const entry = dist("_styles.entry.css")
writeFileSync(
  entry,
  `@import "tailwindcss";
@import "tw-animate-css";
@import "./shadcn.css";
@import "./tokens.css";
@source "./";
`,
)
execFileSync("npx", ["@tailwindcss/cli", "-i", entry, "-o", dist("styles.css"), "--minify"], { stdio: "inherit" })
rmSync(entry)
writeFileSync(dist("styles.css"), `@import "./fonts.css";\n` + readFileSync(dist("styles.css"), "utf8"))
