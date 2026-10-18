import react from "@vitejs/plugin-react"
import { readFileSync } from "node:fs"
import path from "node:path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

const pkg = JSON.parse(readFileSync("./package.json", "utf8"))
const external = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]

// Library build: one ES module per source file so consumers only bundle what they import.
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src",
      exclude: ["**/*.stories.tsx", ".storybook/**"],
    }),
  ],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: { entry: "src/index.ts", formats: ["es"] },
    rollupOptions: {
      external: (id) =>
        id.startsWith("react/") || external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
})
