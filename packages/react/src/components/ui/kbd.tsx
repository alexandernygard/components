import * as React from "react"
import { cn } from "@/lib/utils"
import { formatHotkey, isApple } from "@/lib/hotkeys"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

const subscribe = () => () => {}

// A shortcut such as "mod+k", printed as ⌘ K on Apple devices and Ctrl K
// elsewhere. Takes the same format as useHotkeys.
function KbdShortcut({
  keys,
  className,
  ...props
}: Omit<React.ComponentProps<typeof KbdGroup>, "children"> & { keys: string }) {
  const apple = React.useSyncExternalStore(subscribe, isApple, () => false)

  return (
    <KbdGroup data-slot="kbd-shortcut" className={className} {...props}>
      {formatHotkey(keys, apple).map((key, index) => (
        <Kbd key={index}>{key}</Kbd>
      ))}
    </KbdGroup>
  )
}

export { Kbd, KbdGroup, KbdShortcut }
