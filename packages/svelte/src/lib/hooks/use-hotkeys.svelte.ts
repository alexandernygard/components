import { isTypingEvent, matchesHotkey } from "$lib/hotkeys.js";

export { formatHotkey } from "$lib/hotkeys.js";

export type UseHotkeysOptions = {
	/** Turns the shortcut off without removing it. */
	enabled?: boolean;
	/** Also fire while typing in inputs, textareas and editors. */
	enableInInputs?: boolean;
	/** Also fire while focus is inside a dialog. */
	enableInDialogs?: boolean;
	/** Calls preventDefault on a match. On by default. */
	preventDefault?: boolean;
};

/**
 * Runs `callback` when one of the shortcuts is pressed anywhere on the page,
 * such as "mod+k" or ["mod+z", "mod+shift+z"]. `mod` is Cmd on Apple devices
 * and Ctrl elsewhere. Key presses while typing or inside a dialog are skipped
 * unless the options say otherwise. Call it while a component initializes;
 * pass getters for values that change.
 *
 * ```svelte
 * <script lang="ts">
 * 	useHotkeys("mod+k", () => (open = true));
 * 	useHotkeys("escape", close, () => ({ enabled: open, enableInDialogs: true }));
 * </script>
 * ```
 */
export function useHotkeys(
	hotkeys: string | string[] | (() => string | string[]),
	callback: (event: KeyboardEvent, hotkey: string) => void,
	options: UseHotkeysOptions | (() => UseHotkeysOptions) = {}
) {
	$effect(() => {
		const keys = typeof hotkeys === "function" ? hotkeys() : hotkeys;
		const list = Array.isArray(keys) ? keys : [keys];
		const {
			enabled = true,
			enableInInputs = false,
			enableInDialogs = false,
			preventDefault = true,
		} = typeof options === "function" ? options() : options;

		if (!enabled) {
			return;
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.defaultPrevented) {
				return;
			}

			const hotkey = list.find((key) => matchesHotkey(event, key.trim()));

			if (
				!hotkey ||
				isTypingEvent(event, { inInputs: enableInInputs, inDialogs: enableInDialogs })
			) {
				return;
			}

			if (preventDefault) {
				event.preventDefault();
			}

			callback(event, hotkey.trim());
		}

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	});
}
