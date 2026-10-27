import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import { TooltipProvider } from "../src/components/ui/tooltip"
import "../src/styles/globals.css"
import "./preview.css"

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
        order: ["Introduction", "Foundations", "Components", "Chat", ["Conversation", "Composer", "Composer controls", "Messages", "*"], "Patterns"],
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
}

export default preview
