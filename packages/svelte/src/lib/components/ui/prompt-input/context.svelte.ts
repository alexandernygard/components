import { getContext, setContext } from "svelte";

export type PromptInputStatus = "idle" | "submitted" | "streaming";

export type PromptInputStateProps = {
	value: () => string;
	setValue: (value: string) => void;
	files: () => File[];
	setFiles: (files: File[]) => void;
	status: () => PromptInputStatus;
	disabled: () => boolean;
	accept: () => string | undefined;
	multiple: () => boolean;
	onSubmit: () => ((message: { text: string; files: File[] }) => void) | undefined;
	onStop: () => (() => void) | undefined;
	openFilePicker: () => void;
};

function matchesAccept(file: File, accept?: string) {
	if (!accept) {
		return true;
	}

	return accept.split(",").some((rule) => {
		const type = rule.trim().toLowerCase();

		if (type.startsWith(".")) {
			return file.name.toLowerCase().endsWith(type);
		}

		if (type.endsWith("/*")) {
			return file.type.startsWith(type.slice(0, -1));
		}

		return file.type === type;
	});
}

class PromptInputState {
	readonly props: PromptInputStateProps;
	value = $derived.by(() => this.props.value());
	files = $derived.by(() => this.props.files());
	status = $derived.by(() => this.props.status());
	disabled = $derived.by(() => this.props.disabled());
	canSubmit = $derived.by(
		() =>
			!this.disabled && this.status === "idle" && (!!this.value.trim() || this.files.length > 0)
	);
	stoppable = $derived.by(() => this.status !== "idle" && !!this.props.onStop());

	constructor(props: PromptInputStateProps) {
		this.props = props;
	}

	setValue = (value: string) => this.props.setValue(value);

	openFilePicker = () => this.props.openFilePicker();

	addFiles = (added: Iterable<File>) => {
		const accept = this.props.accept();
		const allowed = [...added].filter((file) => matchesAccept(file, accept));

		if (allowed.length) {
			this.props.setFiles(this.props.multiple() ? [...this.files, ...allowed] : allowed.slice(0, 1));
		}
	};

	removeFile = (file: File) => {
		this.props.setFiles(this.files.filter((f) => f !== file));
	};

	submit = () => {
		if (!this.canSubmit) {
			return;
		}

		this.props.onSubmit()?.({ text: this.value, files: this.files });
		this.props.setValue("");
		this.props.setFiles([]);
	};

	stop = () => this.props.onStop()?.();
}

const SYMBOL_KEY = Symbol.for("prompt-input");

export function setPromptInput(props: PromptInputStateProps): PromptInputState {
	return setContext(SYMBOL_KEY, new PromptInputState(props));
}

/**
 * The state of the surrounding `PromptInput`. This is a class instance, so
 * you cannot destructure it.
 */
export function usePromptInput(): PromptInputState {
	const state = getContext<PromptInputState | undefined>(SYMBOL_KEY);

	if (!state) {
		throw new Error("usePromptInput must be used within a PromptInput.Root.");
	}

	return state;
}
