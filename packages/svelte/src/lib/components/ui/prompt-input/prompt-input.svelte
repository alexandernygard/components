<script lang="ts">
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLFormAttributes } from "svelte/elements";
	import { setPromptInput, type PromptInputStatus } from "./context.svelte.js";

	// A chat composer: Enter sends, Shift+Enter adds a line, the text box grows
	// with its content and files can be attached, pasted or dropped. While a
	// reply is on its way (`status` "submitted" or "streaming") the submit
	// button becomes a stop button that calls `onStop`.
	let {
		ref = $bindable(null),
		value = $bindable(""),
		files = $bindable([]),
		onSubmit,
		onStop,
		status = "idle",
		disabled = false,
		accept,
		multiple = true,
		class: className,
		children,
		...restProps
	}: WithElementRef<Omit<HTMLFormAttributes, "onsubmit">, HTMLFormElement> & {
		value?: string;
		files?: File[];
		/** Called with the text and files. The composer clears itself afterwards. */
		onSubmit?: (message: { text: string; files: File[] }) => void;
		onStop?: () => void;
		status?: PromptInputStatus;
		disabled?: boolean;
		/** File types to allow, as for `<input type="file">`. */
		accept?: string;
		multiple?: boolean;
	} = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let dragging = $state(false);

	const prompt = setPromptInput({
		value: () => value,
		setValue: (next) => (value = next),
		files: () => files,
		setFiles: (next) => (files = next),
		status: () => status,
		disabled: () => disabled,
		accept: () => accept,
		multiple: () => multiple,
		onSubmit: () => onSubmit,
		onStop: () => onStop,
		openFilePicker: () => fileInput?.click(),
	});
</script>

<form
	bind:this={ref}
	data-slot="prompt-input"
	data-status={status}
	class={cn("w-full", className)}
	onsubmit={(e) => {
		e.preventDefault();
		prompt.submit();
	}}
	{...restProps}
>
	<InputGroup.Root
		data-dragging={dragging || undefined}
		class="data-dragging:border-ring data-dragging:ring-3 data-dragging:ring-ring/50"
		ondragover={(e) => {
			if (!disabled && e.dataTransfer?.types.includes("Files")) {
				e.preventDefault();
				dragging = true;
			}
		}}
		ondragleave={(e) => {
			if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
				dragging = false;
			}
		}}
		ondrop={(e) => {
			dragging = false;

			if (!disabled && e.dataTransfer?.files.length) {
				e.preventDefault();
				prompt.addFiles(e.dataTransfer.files);
			}
		}}
	>
		{@render children?.()}
	</InputGroup.Root>
	<input
		bind:this={fileInput}
		type="file"
		hidden
		{accept}
		{multiple}
		onchange={(e) => {
			if (e.currentTarget.files) {
				prompt.addFiles(e.currentTarget.files);
			}
			e.currentTarget.value = "";
		}}
	/>
</form>
