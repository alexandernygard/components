<script lang="ts">
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { usePromptInput } from "./context.svelte.js";

	let {
		ref = $bindable(null),
		class: className,
		onkeydown,
		onpaste,
		...restProps
	}: Omit<ComponentProps<typeof InputGroup.Textarea>, "value"> = $props();

	const prompt = usePromptInput();

	// Browsers without `field-sizing: content` grow the text box here instead.
	$effect.pre(() => {
		void prompt.value;

		if (!ref || CSS.supports("field-sizing", "content")) {
			return;
		}

		ref.style.height = "auto";
		ref.style.height = `${ref.scrollHeight}px`;
	});
</script>

<InputGroup.Textarea
	bind:ref
	data-slot="prompt-input-textarea"
	bind:value={() => prompt.value, (next) => prompt.setValue(next ?? "")}
	disabled={prompt.disabled}
	rows={1}
	class={cn("max-h-48 min-h-12", className)}
	onkeydown={(e) => {
		onkeydown?.(e);

		if (!e.defaultPrevented && e.key === "Enter" && !e.shiftKey && !e.isComposing) {
			e.preventDefault();
			prompt.submit();
		}
	}}
	onpaste={(e) => {
		onpaste?.(e);

		const files = e.clipboardData?.files;

		if (!e.defaultPrevented && files?.length) {
			e.preventDefault();
			prompt.addFiles(files);
		}
	}}
	{...restProps}
/>
