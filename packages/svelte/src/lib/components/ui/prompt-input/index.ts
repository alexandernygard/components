import AttachButton from "./prompt-input-attach-button.svelte";
import Attachments from "./prompt-input-attachments.svelte";
import Footer from "./prompt-input-footer.svelte";
import Submit from "./prompt-input-submit.svelte";
import Textarea from "./prompt-input-textarea.svelte";
import Root from "./prompt-input.svelte";
import { usePromptInput, type PromptInputStatus } from "./context.svelte.js";

export {
	Root,
	Textarea,
	Attachments,
	Footer,
	AttachButton,
	Submit,
	usePromptInput,
	type PromptInputStatus,
	//
	Root as PromptInput,
	Textarea as PromptInputTextarea,
	Attachments as PromptInputAttachments,
	Footer as PromptInputFooter,
	AttachButton as PromptInputAttachButton,
	Submit as PromptInputSubmit,
};
