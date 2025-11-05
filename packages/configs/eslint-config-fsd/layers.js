// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"
import boundaries from "eslint-plugin-boundaries"

import {getLowerLayers, getUpperLayers, layers} from "./utils.js"

const getNotSharedLayersRules = () =>
  getUpperLayers("shared").map((layer) => ({
    allow: getLowerLayers(layer).map((layer) => layer),
    from: layer,
  }))

const sliceLessLayerRules = [
  {
    allow: "shared",
    from: "shared",
  },
  {
    allow: "data",
    from: "data",
  },
  {
    allow: "app",
    from: "app",
  },
]

const getLayersBoundariesElements = () =>
  layers.map((layer) => ({
    capture: ["slices"],
    mode: "folder",
    pattern: `${layer}/!(_*){,/*}`,
    type: `${layer}`,
  }))

export default defineConfig({
  extends: [boundaries.configs.recommended],
  plugins: {
    boundaries,
  },
  rules: {
    "boundaries/element-types": [
      2,
      {
        default: "disallow",
        message:
          '"${file.type}" is not allowed to import "${dependency.type}" | See rules: https://feature-sliced.design/docs/reference/layers/overview ',
        rules: [...getNotSharedLayersRules(), ...sliceLessLayerRules],
      },
    ],
  },
  settings: {
    "boundaries/elements": [...getLayersBoundariesElements()],
  },
})
