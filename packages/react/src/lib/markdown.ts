// Closes the markdown syntax still open at the end of a streamed reply, so a
// half-written bold, code span or link renders the way it will once it ends.
export function completeMarkdown(text: string) {
  const lines = text.split("\n")
  let fence: string | null = null
  let blockStart = 0

  for (let i = 0; i < lines.length; i++) {
    const match = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(lines[i])

    if (fence) {
      if (
        match &&
        match[1][0] === fence[0] &&
        match[1].length >= fence.length &&
        !match[2].trim()
      ) {
        fence = null
        blockStart = i + 1
      }
    } else if (match) {
      fence = match[1]
    } else if (!lines[i].trim()) {
      blockStart = i + 1
    }
  }

  // An unclosed fence already runs to the end, so its code is left alone.
  if (fence) {
    return text
  }

  let block = lines.slice(blockStart)

  // A last line of only dashes, stars or a number may become a list item, a
  // rule or a heading underline, so it waits for the rest of the line.
  if (block.length && /^ {0,3}([-=*_+]+|\d+[.)]) *$/.test(block[block.length - 1])) {
    block = block.slice(0, -1)
  }

  return [...lines.slice(0, blockStart), closeInline(block.join("\n"))].join("\n")
}

function closeInline(block: string) {
  // A half-written image would load a broken URL, so it is left out.
  let text = block.replace(/!\[[^\]]*(\]\([^)]*)?$/, "")

  // A link whose URL is still arriving.
  if (/\[[^\]]*\]\([^)\s]*$/.test(text)) {
    text += ")"
  }

  const open: { marker: string; index: number }[] = []
  let code: { run: string; index: number } | null = null

  const toggle = (marker: string, index: number) => {
    const last = open.findLastIndex((entry) => entry.marker === marker)

    if (last === -1) {
      open.push({ marker, index })
    } else {
      open.splice(last, 1)
    }
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (char === "\\") {
      i++
      continue
    }

    if (char !== "`" && char !== "*" && char !== "_" && char !== "~") {
      continue
    }

    let end = i
    while (text[end] === char) end++
    const run = text.slice(i, end)
    const start = i
    i = end - 1

    if (char === "`") {
      if (!code) {
        code = { run, index: start }
      } else if (run === code.run) {
        code = null
      }
      continue
    }

    if (code) {
      continue
    }

    const before = text[start - 1] ?? " "
    const after = text[end] ?? ""

    // A bullet, or a star with spaces on both sides.
    if (/\s/.test(before) && /\s/.test(after)) {
      continue
    }

    // An underscore inside a word, as in snake_case.
    if (char === "_" && /\w/.test(before) && /\w/.test(after)) {
      continue
    }

    if (char === "~") {
      if (run.length === 2) {
        toggle(run, start)
      }
      continue
    }

    if (run.length >= 2) {
      toggle(char + char, start)
    }

    if (run.length % 2 === 1) {
      toggle(char, start + run.length - 1)
    }
  }

  const unclosed = [...open]

  if (code) {
    unclosed.push({ marker: code.run, index: code.index })
  }

  // Close from the innermost out. An opener with nothing after it yet is
  // dropped instead, since an empty "****" would show as text.
  for (const { marker, index } of unclosed.sort((a, b) => b.index - a.index)) {
    if (text.slice(index + marker.length).trim()) {
      text = text.trimEnd() + marker
    } else {
      text = text.slice(0, index)
    }
  }

  return text
}

// The URL as written, or undefined for a scheme that could run script.
export function safeUrl(href: string) {
  const url = href.replace(/[\u0000- ]/g, "")

  if (!/^[a-z][a-z\d+.-]*:/i.test(url) || /^(https?|mailto|tel):/i.test(url)) {
    return href
  }

  return undefined
}
