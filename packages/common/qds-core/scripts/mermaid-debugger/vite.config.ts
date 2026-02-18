import {resolve} from "node:path"
import {defineConfig} from "vite"

export default defineConfig({
  resolve: {
    alias: {
      "@qualcomm-ui/qds-core": resolve(import.meta.dirname, "../../src"),
    },
  },
})
