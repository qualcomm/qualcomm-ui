import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import type {CssBuilderConfig} from "@qualcomm-ui/css-utils"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  fileGroups: [
    {
      cssFiles: ["src/styles/dragonwing-dark.css"],
      outFileName: "dragonwing-dark.min.css",
    },
    {
      cssFiles: ["src/styles/dragonwing-light.css"],
      outFileName: "dragonwing-light.min.css",
    },
    {
      cssFiles: ["src/styles/qualcomm-dark.css"],
      outFileName: "qualcomm-dark.min.css",
    },
    {
      cssFiles: ["src/styles/qualcomm-light.css"],
      outFileName: "qualcomm-light.min.css",
    },
    {
      cssFiles: ["src/styles/snapdragon-dark.css"],
      outFileName: "snapdragon-dark.min.css",
    },
    {
      cssFiles: ["src/styles/snapdragon-light.css"],
      outFileName: "snapdragon-light.min.css",
    },
    {
      cssFiles: ["src/**/qds-*.css"],
      emitIndividualCssFiles: true,
      ignore: ["src/styles/**/*"],
      outFileName: "components.min.css",
    },
  ],
  outDir: resolve(__dirname, "dist"),
  watchOptions: {
    include: ["./src"],
  },
} satisfies CssBuilderConfig
