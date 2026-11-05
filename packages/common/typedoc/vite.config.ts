import {defineConfig} from "vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        cli: "./src/cli.ts",
        index: "./src/index.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        "@commander-js/extra-typings",
        "cosmiconfig",
        "oxfmt",
        "typedoc",
        "typescript",
        /^node/,
      ],
      output: {
        minify: true,
      },
      platform: "node",
    },
    sourcemap: true,
  },
})
