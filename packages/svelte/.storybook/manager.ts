import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "@alexandernygard/components-svelte",
    colorPrimary: "#18212b",
    colorSecondary: "#18212b",
    appBg: "#f5f7f8",
    appContentBg: "#ffffff",
    appBorderColor: "#dde3e8",
    textColor: "#18212b",
    textMutedColor: "#5b6672",
    fontBase: '"Schibsted Grotesk Variable", ui-sans-serif, system-ui, sans-serif',
  }),
})
