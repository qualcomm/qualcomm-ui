// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"
import jsdoc from "eslint-plugin-jsdoc"

export default defineConfig({
  name: "qui-jsdoc",
  plugins: {jsdoc},
  rules: {
    "jsdoc/check-alignment": "error",
    "jsdoc/check-indentation": "warn",
    "jsdoc/check-tag-names": [
      "error",
      {
        definedTags: [
          "custom",
          "docLink",
          "group",
          "option",
          "tag",
          "alpha",
          "beta",
          "betaDocumentation",
          "decorator",
          "defaultValue",
          "deprecated",
          "eventProperty",
          "example",
          "experimental",
          "inheritDoc",
          "internal",
          "internalRemarks",
          "label",
          "link",
          "override",
          "packageDocumentation",
          "param",
          "preapproved",
          "privateRemarks",
          "public",
          "readonly",
          "remarks",
          "returns",
          "sealed",
          "see",
          "throws",
          "typeParam",
          "virtual",
        ],
      },
    ],
    "jsdoc/no-blank-block-descriptions": "error",
    "jsdoc/no-multi-asterisks": "error",
    "jsdoc/require-asterisk-prefix": "error",
    "jsdoc/require-jsdoc": "off",
    "jsdoc/tag-lines": [
      "error",
      "always",
      {
        count: 0,
        endLines: 0,
        startLines: 1,
      },
    ],
  },
})
