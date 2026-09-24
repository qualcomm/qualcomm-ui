import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

import {dependenciesToExternal, packagesToExternal} from "@qualcomm-ui/vite"

import pkg from "./package.json"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        ...packagesToExternal(Object.keys(pkg.peerDependencies ?? {})),
        "@tanstack/virtual-core",
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
  plugins: [react()],
})
