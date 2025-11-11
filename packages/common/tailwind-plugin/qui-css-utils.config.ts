import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import type {CssBuilderConfig} from "@qualcomm-ui/css-utils"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  fileGroups: [
    {
      cssFiles: ["src/qui.css"],
      outFileName: "qui.css",
    },
    {
      cssFiles: ["src/qui-strict.css"],
      outFileName: "qui-strict.css",
    },
    {
      cssFiles: ["src/qui-legacy.css"],
      outFileName: "qui-legacy.css",
    },
  ],
  outDir: resolve(__dirname, "dist"),
  watchOptions: {
    include: ["./src"],
  },
} satisfies CssBuilderConfig
