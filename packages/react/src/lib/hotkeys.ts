// Keyboard shortcuts written as "mod+k", "shift+?", "alt+arrowup" or "escape".
// `mod` is Cmd on Apple devices and Ctrl elsewhere.

type Hotkey = {
  key: string
  mod: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
}

const keyAliases: Record<string, string> = {
  esc: "escape",
  return: "enter",
  space: " ",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
  del: "delete",
  plus: "+",
}

export function isApple() {
  return (
    typeof navigator !== "undefined" &&
    /mac|iphone|ipad|ipod/i.test(
      (navigator as Navigator & { userAgentData?: { platform: string } })
        .userAgentData?.platform ?? navigator.platform
    )
  )
}

function parseHotkey(hotkey: string): Hotkey {
  const parts = hotkey.toLowerCase().split(/\+(?!$)/)
  const key = parts.pop() ?? ""

  return {
    key: keyAliases[key] ?? key,
    mod: parts.includes("mod"),
    ctrl: parts.includes("ctrl") || parts.includes("control"),
    meta: parts.some((part) => ["meta", "cmd", "command"].includes(part)),
    alt: parts.includes("alt") || parts.includes("option"),
    shift: parts.includes("shift"),
  }
}

// The key as typed and, for letters and digits, as printed on the key, so
// alt+k still matches on a Mac where it types "˚".
function eventKeys(event: KeyboardEvent) {
  const keys = [event.key.toLowerCase()]
  const code = /^(?:Key|Digit)(.)$/.exec(event.code)

  if (code) {
    keys.push(code[1].toLowerCase())
  }

  return keys
}

export function matchesHotkey(event: KeyboardEvent, hotkey: string) {
  const { key, mod, ctrl, meta, alt, shift } = parseHotkey(hotkey)
  const apple = isApple()
  const wantMeta = meta || (mod && apple)
  const wantCtrl = ctrl || (mod && !apple)

  if (
    event.metaKey !== wantMeta ||
    event.ctrlKey !== wantCtrl ||
    event.altKey !== alt
  ) {
    return false
  }

  // A symbol such as "?" already needs Shift to type, so Shift only has to
  // match for letters, digits and named keys.
  if (event.shiftKey !== shift && !(event.shiftKey && key.length === 1 && !/[a-z\d]/.test(key))) {
    return false
  }

  return eventKeys(event).includes(key)
}

// True when the key press is typing: in a text field, an editor or a dialog.
export function isTypingEvent(
  event: KeyboardEvent,
  { inInputs = false, inDialogs = false } = {}
) {
  if (event.isComposing) {
    return true
  }

  const target = event.composedPath()[0] ?? event.target

  if (!(target instanceof Element)) {
    return false
  }

  if (!inInputs) {
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
      return true
    }

    if (
      target instanceof HTMLInputElement &&
      !["checkbox", "radio", "button", "submit", "reset", "range", "color", "file"].includes(target.type)
    ) {
      return true
    }

    if (target instanceof HTMLElement && target.isContentEditable) {
      return true
    }
  }

  return !inDialogs && !!target.closest("[role=dialog], [role=alertdialog]")
}

const appleSymbols: Record<string, string> = {
  mod: "⌘",
  meta: "⌘",
  cmd: "⌘",
  command: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  option: "⌥",
  shift: "⇧",
}

const names: Record<string, string> = {
  mod: "Ctrl",
  meta: "Win",
  cmd: "Win",
  command: "Win",
  ctrl: "Ctrl",
  control: "Ctrl",
  alt: "Alt",
  option: "Alt",
  shift: "Shift",
  escape: "Esc",
  esc: "Esc",
  enter: "↵",
  return: "↵",
  backspace: "⌫",
  delete: "Del",
  del: "Del",
  space: "Space",
  " ": "Space",
  tab: "Tab",
  arrowup: "↑",
  up: "↑",
  arrowdown: "↓",
  down: "↓",
  arrowleft: "←",
  left: "←",
  arrowright: "→",
  right: "→",
  plus: "+",
}

// The keys of a shortcut as they are printed, such as ["⌘", "K"] on a Mac
// and ["Ctrl", "K"] elsewhere. Pass `apple` to pick one.
export function formatHotkey(hotkey: string, apple = isApple()) {
  return hotkey
    .toLowerCase()
    .split(/\+(?!$)/)
    .map(
      (part) =>
        (apple ? appleSymbols[part] : undefined) ??
        names[part] ??
        (part.length === 1 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1))
    )
}
