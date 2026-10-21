import * as React from "react"
import { compose, type Spec, type ThemeName } from "@alexandernygard/illustrations"

import { cn } from "@/lib/utils"

const specKeys = [
  "title", "tagline", "byline", "motif", "accent", "accent2", "seed", "size",
  "layout", "position", "fade", "background", "texture", "subject",
] as const satisfies readonly (keyof Spec)[]

type IllustrationSpec = Pick<Spec, (typeof specKeys)[number]>

type IllustrationProps = IllustrationSpec &
  Omit<React.ComponentProps<"div">, keyof IllustrationSpec | "children"> & {
    /** A fixed theme. By default it follows dark mode: mist when light, ink when dark. */
    theme?: ThemeName
    /** Describes the image for screen readers. Without it the illustration is decorative. */
    alt?: string
  }

function render(spec: Spec) {
  return compose({ size: "480x360", background: "none", texture: false, ...spec }).svg
}

// Generative art from @alexandernygard/illustrations, sized to its container. The SVG is built
// from the props alone, so it renders the same on the server and in the browser.
function Illustration({ className, theme, alt, ...props }: IllustrationProps) {
  const spec: Spec = {}
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if ((specKeys as readonly string[]).includes(key)) (spec as Record<string, unknown>)[key] = value
    else rest[key] = value
  }
  const key = JSON.stringify(spec)
  const light = React.useMemo(() => render({ ...spec, theme: theme ?? "mist" }), [key, theme])
  const dark = React.useMemo(() => (theme ? "" : render({ ...spec, theme: "ink" })), [key, theme])
  const svg = "[&_svg]:block [&_svg]:h-auto [&_svg]:w-full"

  return (
    <div
      data-slot="illustration"
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      className={cn("w-full", className)}
      {...rest}
    >
      <div className={cn(svg, !theme && "dark:hidden")} dangerouslySetInnerHTML={{ __html: light }} />
      {dark && <div className={cn(svg, "hidden dark:block")} dangerouslySetInnerHTML={{ __html: dark }} />}
    </div>
  )
}

export { Illustration, type IllustrationProps }
