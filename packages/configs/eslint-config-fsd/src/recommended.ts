// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import boundaries from "eslint-plugin-boundaries"
import {defineConfig, type Config} from "eslint/config"

import {
  getLowerSegments,
  getUpperLayers,
  layers,
  segments,
} from "./utils.js"

const getLayerPolicies = () => [
  ...layers.slice(1).map((layer) => ({
    disallow: {
      to: {
        element: {
          type: getUpperLayers(layer),
        },
      },
    },
    from: {
      element: {
        type: layer,
      },
    },
  })),
  ...["pages", "widgets", "features", "entities"].map((layer) => ({
    disallow: {
      to: {
        element: {
          type: layer,
        },
      },
    },
    from: {
      element: {
        type: layer,
      },
    },
  })),
]

const getSegmentPolicies = () =>
  segments.flatMap((segment) =>
    getLowerSegments(segment).map((restrictedSegment) => ({
      disallow: {
        dependency: {
          relationship: {
            from: "internal",
            to: "internal",
          },
        },
        to: {
          file: {
            categories: segment,
          },
        },
      },
      from: {
        element: {
          type: getUpperLayers("data"),
        },
        file: {
          categories: restrictedSegment,
        },
      },
    })),
  )

const elements = layers.map((layer) => ({
  capture: ["slice"],
  pattern: `${layer}/!(_*){,/*}`,
  type: layer,
}))

const files = [
  ...segments.map((segment) => ({
    category: segment,
    pattern: `**/${segment}/**`,
  })),
  {
    category: "model-file",
    pattern: "**/*.model.ts",
  },
  {
    category: "tsx",
    pattern: "**/*.tsx",
  },
  {
    category: "state-file",
    pattern: "**/*.state.ts",
  },
  {
    category: "api-file",
    pattern: "**/*.api.ts",
  },
]

const config: Config[] = defineConfig({
  extends: [boundaries.configs.recommended],
  plugins: {
    boundaries,
  },
  rules: {
    "boundaries/dependencies": [
      "error",
      {
        checkInternals: true,
        default: "allow",
        policies: [
          ...getLayerPolicies(),
          {
            allow: {
              dependency: {
                relationship: {
                  from: "internal",
                  to: "internal",
                },
              },
            },
          },
          ...getSegmentPolicies(),
          {
            disallow: [
              {
                to: {
                  file: {
                    categories: ["tsx", "state-file", "api-file"],
                  },
                },
              },
              {
                dependency: {
                  relationship: {
                    from: "internal",
                    to: "internal",
                  },
                },
                to: {
                  file: {
                    categories: "ui",
                  },
                },
              },
            ],
            from: {
              file: {
                categories: "model-file",
              },
            },
          },
        ],
      },
    ],
  },
  settings: {
    "boundaries/elements": elements,
    "boundaries/files": files,
    "boundaries/legacy-warnings": false,
  },
})

export default config
