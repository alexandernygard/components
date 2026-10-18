import type { Preview } from "@storybook/svelte-vite";
import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/routes/layout.css";
import "./preview.css";

const preview: Preview = {
	parameters: {
		layout: "centered",
		controls: {
			matchers: { color: /(background|color)$/i, date: /Date$/i },
		},
		backgrounds: { disable: true },
		a11y: { test: "todo" },
		options: {
			storySort: {
				order: ["Introduction", "Foundations", "Components", "Patterns"],
			},
		},
	},
	decorators: [
		withThemeByClassName({
			themes: { light: "", dark: "dark" },
			defaultTheme: "light",
		}),
	],
};

export default preview;
