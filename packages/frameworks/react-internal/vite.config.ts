import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

import {dependenciesToExternal, libraryEntriesPlugin} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {},
      formats: ["es"],
    },
    rolldownOptions: {
      external: [...(await dependenciesToExternal()), /^@qualcomm-ui\//],
      output: {
        banner: `"use client";`,
        entryFileNames: "[name].js",
        minify: {
          mangle: {
            keepNames: true,
          },
        },
      },
    },
    sourcemap: true,
  },
  plugins: [react(), libraryEntriesPlugin()],
})
