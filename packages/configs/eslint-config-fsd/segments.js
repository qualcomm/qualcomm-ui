import {defineConfig} from "eslint/config"
import importPlugin from "eslint-plugin-import"

import {getLowerSegments, getUpperLayers, segments} from "./utils.js"

const layers = getUpperLayers("data")

export default defineConfig({
  plugins: {
    import: importPlugin,
  },
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        zones: layers.flatMap((layer) =>
          segments.flatMap((segment) =>
            getLowerSegments(segment).flatMap((restrictedSegment) => ({
              from: `**/${layer}/*/${segment}/**`,
              message: `Do not import ${segment} from the ${restrictedSegment} directory. ${restrictedSegment} must not have a dependency on ${segment}. `,
              target: `**/${layer}/*/${restrictedSegment}/**`,
            })),
          ),
        ),
      },
    ],
  },
})
