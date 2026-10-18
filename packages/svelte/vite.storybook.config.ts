// Vite config for Storybook. It skips the SvelteKit plugin: the components don't use
// SvelteKit, and @storybook/sveltekit doesn't support Kit 3 yet.
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), svelte()],
	resolve: {
		alias: { $lib: new URL("./src/lib", import.meta.url).pathname },
	},
});
