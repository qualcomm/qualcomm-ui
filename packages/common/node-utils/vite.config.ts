import {defineConfig} from "vite"

import {dependenciesToExternal, libraryEntriesPlugin} from "@qualcomm-ui/vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {},
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        /^@qualcomm-ui\//,
        /^node/,
      ],
      output: [
        {
          entryFileNames: "[name].cjs",
          format: "cjs",
          minify: true,
        },
        {
          entryFileNames: "[name].js",
          format: "es",
          minify: true,
        },
      ],
    },
    sourcemap: true,
  },
  plugins: [libraryEntriesPlugin()],
})
