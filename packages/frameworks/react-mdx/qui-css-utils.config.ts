import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import type {CssBuilderConfig} from "@qualcomm-ui/css-utils"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  fileGroups: [
    {
      cssFiles: ["./src/**/*.css"],
      outFileName: "all.min.css",
    },
  ],
  outDir: resolve(__dirname, "dist"),
  watchOptions: {
    include: ["./src"],
  },
} satisfies CssBuilderConfig
