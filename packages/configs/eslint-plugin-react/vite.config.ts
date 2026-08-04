import {defineConfig} from "vite"

import {dependenciesToExternal} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "./src/index.ts",
      fileName: "index",
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        /^@qualcomm-ui\//,
        /^node/,
      ],
      output: {
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
