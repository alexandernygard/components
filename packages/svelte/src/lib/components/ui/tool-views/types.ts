import { getContext, setContext, type Component, type Snippet } from "svelte";
import type { ToolCallStatus } from "$lib/components/ui/tool-call/index.js";
import type { ToolValueFormat } from "$lib/components/ui/tool-value/index.js";

/** A tool call to show. A ToolNode from @alexandernygard/ai-kit fits as is. */
export interface ToolCallData {
	toolCallId: string;
	toolName: string;
	state?: ToolCallStatus;
	input?: unknown;
	/** Raw input JSON while it streams. */
	inputText?: string;
	output?: unknown;
	error?: string;
	/** Short label from the tool definition. Used when the view has no title. */
	title?: string;
	approval?: { reason?: string; approved?: boolean; message?: string };
	/** Calls made from inside this one, such as code-mode or subagent calls. */
	children?: ToolCallData[];
	durationMs?: number;
}

export type ToolValueRender<T> =
	| false
	| ToolValueFormat
	| {
			format?: ToolValueFormat;
			/**
			 * For `code`: the language to highlight, or a function that picks it for
			 * each call. Defaults to the extension of the call's `path`, `file_path`
			 * or `filename` input.
			 */
			language?: string | ((value: T, call: ToolCallData) => string | undefined);
			/** Replaces the "Input" or "Output" label. Pass `false` to hide it. */
			label?: string | false;
			/** Picks the part of the value to show. */
			select?: (value: T) => unknown;
			/** Renders the value with your own component, which gets `value` and `call`. */
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			component?: Component<{ value: any; call: ToolCallData }>;
	  }
	/** A snippet that gets the value and the call. */
	| Snippet<[T, ToolCallData]>;

type ToolTitle<I> = string | ((input: I | undefined, call: ToolCallData) => string | undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ToolView<I = any, O = any> {
	icon?: Component;
	/** The line shown for the call. Receives the input once it has arrived. */
	title?: ToolTitle<I>;
	/** Used instead of `title` until the call has finished, such as "Searching for …". */
	runningTitle?: ToolTitle<I>;
	/** Shown after the title once the call has finished, such as "11 results". */
	summary?: (output: O, call: ToolCallData) => string | undefined;
	/** How to show the input. Defaults to `"auto"`. */
	input?: ToolValueRender<I>;
	/** How to show the output. Defaults to `"auto"`. */
	output?: ToolValueRender<O>;
	defaultOpen?: boolean;
}

export type ToolViews = Record<string, ToolView>;

export type ApprovalHandler = (call: ToolCallData, approved: boolean) => void;

/** Typed helper for one view, so `input` and `output` are checked. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineToolView<I = any, O = any>(view: ToolView<I, O>) {
	return view;
}

export function defineToolViews<T extends ToolViews>(views: T) {
	return views;
}

type ToolViewsState = { views: ToolViews; fallback?: ToolView; onApproval?: ApprovalHandler };

const key = Symbol("tool-views");

export function setToolViews(state: () => ToolViewsState) {
	setContext(key, state);
}

export function getToolViews(): () => ToolViewsState {
	return getContext<() => ToolViewsState>(key) ?? (() => ({ views: {} }));
}
