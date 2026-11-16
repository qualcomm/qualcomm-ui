import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import type {CssBuilderConfig} from "@qualcomm-ui/css-utils"

const packageDirectory = dirname(fileURLToPath(import.meta.url))

export default {
  fileGroups: [
    {cssFiles: ["src/styles/tokens.css"], outFileName: "tokens.min.css"},
    {cssFiles: ["src/styles/preview.css"], outFileName: "preview.min.css"},
    {
      cssFiles: [
        "src/styles/tokens.css",
        "src/styles/host.css",
        "src/styles/typography.css",
        "src/**/vscode-*.css",
      ],
      outFileName: "components.min.css",
    },
  ],
  outDir: resolve(packageDirectory, "dist"),
  watchOptions: {include: ["./src"]},
} satisfies CssBuilderConfig
