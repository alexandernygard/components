import type { StorybookConfig } from "@storybook/svelte-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|svelte)"],
	addons: [
		"@storybook/addon-svelte-csf",
		"@storybook/addon-docs",
		"@storybook/addon-a11y",
		"@storybook/addon-themes",
	],
	framework: "@storybook/svelte-vite",
	core: {
		builder: {
			name: "@storybook/builder-vite",
			options: { viteConfigPath: "vite.storybook.config.ts" },
		},
	},
};
export default config;
