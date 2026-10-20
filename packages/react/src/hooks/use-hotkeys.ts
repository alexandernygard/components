import * as React from "react"

import { isTypingEvent, matchesHotkey } from "@/lib/hotkeys"

export { formatHotkey } from "@/lib/hotkeys"

export type UseHotkeysOptions = {
  /** Turns the shortcut off without removing the hook. */
  enabled?: boolean
  /** Also fire while typing in inputs, textareas and editors. */
  enableInInputs?: boolean
  /** Also fire while focus is inside a dialog. */
  enableInDialogs?: boolean
  /** Calls preventDefault on a match. On by default. */
  preventDefault?: boolean
}

// Runs `callback` when one of the shortcuts is pressed anywhere on the page,
// such as "mod+k" or ["mod+z", "mod+shift+z"]. `mod` is Cmd on Apple devices
// and Ctrl elsewhere. Key presses while typing or inside a dialog are skipped
// unless the options say otherwise.
export function useHotkeys(
  hotkeys: string | string[],
  callback: (event: KeyboardEvent, hotkey: string) => void,
  {
    enabled = true,
    enableInInputs = false,
    enableInDialogs = false,
    preventDefault = true,
  }: UseHotkeysOptions = {}
) {
  const callbackRef = React.useRef(callback)
  const keys = Array.isArray(hotkeys) ? hotkeys.join("\n") : hotkeys

  React.useLayoutEffect(() => {
    callbackRef.current = callback
  })

  React.useEffect(() => {
    if (!enabled) {
      return
    }

    const list = keys.split("\n")

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return
      }

      const hotkey = list.find((key) => matchesHotkey(event, key.trim()))

      if (
        !hotkey ||
        isTypingEvent(event, { inInputs: enableInInputs, inDialogs: enableInDialogs })
      ) {
        return
      }

      if (preventDefault) {
        event.preventDefault()
      }

      callbackRef.current(event, hotkey.trim())
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [keys, enabled, enableInInputs, enableInDialogs, preventDefault])
}
