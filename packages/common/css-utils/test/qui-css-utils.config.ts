import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import type {CssBuilderConfig} from "../src"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  fileGroups: [
    {
      cssFiles: ["files/*.css"],
      outFileName: "all-test.css",
      outputMode: "all",
    },
  ],
  logMode: "all",
  outDir: resolve(__dirname, "dist"),
} satisfies CssBuilderConfig
