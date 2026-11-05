import {defineConfig} from "vite"

import {dependenciesToExternal} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        index: "./src/index.ts",
        "remark-lint-code-format": "./src/remark-lint-code-format.ts",
        "remark-lint-mdx-jsx-format": "./src/remark-lint-mdx-jsx-format.ts",
        "remark-preserve-alert-markers":
          "./src/remark-preserve-alert-markers.ts",
        remarkrc: "./src/remarkrc.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        /^@qualcomm-ui\//,
        /^node/,
      ],
      output: {
        entryFileNames: "[name].js",
        minify: {
          mangle: {
            keepNames: true,
          },
        },
      },
      platform: "node",
    },
    sourcemap: true,
  },
})
