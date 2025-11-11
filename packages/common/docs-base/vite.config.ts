import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig} from "vite"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = dirname(__filename) // get the name of the directory

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["highlight.js", "ts-key-enum"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "highlight.js": "hljs",
          "ts-key-enum": "tskeyenum",
        },
      },
    },
  },
})
