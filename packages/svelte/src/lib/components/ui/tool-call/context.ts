import { getContext, setContext } from "svelte";

// The same states as a tool part in @alexandernygard/ai-kit.
export type ToolCallStatus =
	| "input-streaming"
	| "input-available"
	| "awaiting-approval"
	| "awaiting-output"
	| "running"
	| "output-available"
	| "output-error"
	| "denied";

export function traceStatus(status?: ToolCallStatus) {
	switch (status) {
		case "input-streaming":
		case "input-available":
		case "awaiting-output":
		case "running":
			return "running";
		case "output-error":
		case "denied":
			return "error";
		default:
			return undefined;
	}
}

const key = Symbol("tool-call");

export function setToolCallStatus(status: () => ToolCallStatus | undefined) {
	setContext(key, status);
}

export function getToolCallStatus(): () => ToolCallStatus | undefined {
	return getContext<() => ToolCallStatus | undefined>(key) ?? (() => undefined);
}
