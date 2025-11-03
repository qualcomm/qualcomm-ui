import {defineConfig} from "eslint/config"
import importPlugin from "eslint-plugin-import"

import {getUpperLayers, segments} from "./utils.js"

const FS_SLICED_LAYERS_REG = getUpperLayers("data").join("|")
const FS_SEGMENTS_REG = [
  ...segments,
  ...segments.map((seg) => `${seg}.*`),
].join("|")

export default defineConfig({
  plugins: {
    import: importPlugin,
  },
  rules: {
    "import/no-internal-modules": [
      "error",
      {
        allow: [
          /**
           * Allow not segments import from slices
           *
           * @example
           * 'entities/form/ui' // Fail
           * 'entities/form' // Pass
           */
          `**/*(${FS_SLICED_LAYERS_REG})/!(${FS_SEGMENTS_REG})`,

          /**
           * Allow slices with structure grouping
           *
           * @example
           * 'features/auth/form' // Pass
           */
          `**/*(${FS_SLICED_LAYERS_REG})/!(${FS_SEGMENTS_REG})/!(${FS_SEGMENTS_REG})`,

          /**
           * Allow not segments import in shared segments
           *
           * @example
           * 'shared/ui/button' // Pass
           */
          `**/*shared/*(${FS_SEGMENTS_REG})/!(${FS_SEGMENTS_REG})`,

          /**
           * Allow import from segments in shared
           *
           * @example
           * 'shared/tool-config' // Pass
           */
          `**/*shared/*`,

          /**
           * Allow deeply nested assets
           */
          `**/*assets/**`,

          /**
           * Allow deeply nested data
           */
          `**/*data/**`,

          /** allow global modules */
          `**/node_modules/**`,

          /**
           * Used for allow import local modules
           *
           * @example
           * './model/something' // Pass
           */
          `./**`,
        ],
      },
    ],
  },
})
