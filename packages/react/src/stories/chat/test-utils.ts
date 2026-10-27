// Helpers for the Chat play functions.
import { fireEvent } from "storybook/test"

// userEvent.type writes through React's value tracker on React 19.3, so
// React never sees the change and onChange doesn't run. Setting the value the
// way fireEvent does goes around the tracker, like a real keystroke.
export function typeText(element: HTMLTextAreaElement | HTMLInputElement, text: string) {
  element.focus()
  fireEvent.input(element, { target: { value: element.value + text } })
}

function transfer(files: File[]) {
  const data = new DataTransfer()
  files.forEach((file) => data.items.add(file))
  return data
}

// fireEvent drops the DataTransfer, so these build the real events.
export function dragFilesOver(element: Element, files: File[]) {
  element.dispatchEvent(
    new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: transfer(files) })
  )
}

export function dropFiles(element: Element, files: File[]) {
  element.dispatchEvent(
    new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer(files) })
  )
}

export function pasteFiles(element: Element, files: File[]) {
  element.dispatchEvent(
    new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: transfer(files) })
  )
}
