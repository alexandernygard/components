// Custom component: shadcn-svelte has no Direction yet. The React library's Direction wraps
// Radix's DirectionProvider; Bits UI has no provider, so this is a small context instead.
// Replace with the official one when shadcn-svelte ports it.
import { getContext, setContext } from "svelte";

export type Direction = "ltr" | "rtl";

const key = Symbol("direction");

export function setDirection(get: () => Direction) {
	setContext(key, get);
}

/** The direction set by the nearest DirectionProvider, or "ltr". Pass it to Bits UI's `dir` props. */
export function useDirection(): Direction {
	return getContext<(() => Direction) | undefined>(key)?.() ?? "ltr";
}
