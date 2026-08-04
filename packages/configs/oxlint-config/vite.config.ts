import {defineConfig} from "vite"

import {dependenciesToExternal} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        angular: "./src/angular.ts",
        core: "./src/core.ts",
        node: "./src/node.ts",
        react: "./src/react.ts",
        typescript: "./src/typescript.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [...(await dependenciesToExternal()), /^@qualcomm-ui\//],
      output: {
        entryFileNames: "[name].js",
      },
    },
    sourcemap: true,
    ssr: true,
  },
})
