import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import type {CssBuilderConfig} from "../src"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  fileGroups: [
    {
      cssFiles: ["files/dialog.css"],
      outFileName: "dialog.min.css",
    },
    {
      cssFiles: ["files/button*.css"],
      emitIndividualCssFiles: true,
      outFileName: "button.min.css",
    },
  ],
  name: "@qualcomm-ui/qds-core",
  outDir: resolve(__dirname, "dist"),
} satisfies CssBuilderConfig
