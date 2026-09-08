import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

import {
  dependenciesToExternal,
  getArg,
  libraryEntriesPlugin,
  packagesToExternal,
} from "@qualcomm-ui/vite"

import pkg from "./package.json"

const mode = getArg(process.argv, "--mode")

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {},
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        ...packagesToExternal(Object.keys(pkg.peerDependencies)),
        ...packagesToExternal(Object.keys(pkg.optionalDependencies)),
        /^@qualcomm-ui\//,
      ],
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
  define: {
    __QUI_DEV___: mode === "development" ? "true" : "false",
  },
  plugins: [react({compiler: true}), libraryEntriesPlugin()],
})
