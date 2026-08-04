// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "oxfmt"

export default defineConfig({
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: false,
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "ignore",
  insertFinalNewline: true,
  // TODO: enable when https://github.com/oxc-project/oxc/issues/21549 is fixed
  jsdoc: false,
  jsxSingleQuote: false,
  objectWrap: "preserve",
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  semi: false,
  singleAttributePerLine: false,
  singleQuote: false,
  sortImports: {
    customGroups: [
      {
        elementNamePattern: ["react", "react-dom", "react-dom/*"],
        groupName: "react",
        selector: "external",
      },
      {
        elementNamePattern: ["@qualcomm-ui/**"],
        groupName: "qualcomm-ui",
        selector: "external",
      },
      {
        elementNamePattern: ["~*/**"],
        groupName: "internal",
        selector: "internal",
      },
    ],
    groups: [
      "react",
      {newlinesBetween: true},
      ["builtin", "external"],
      {newlinesBetween: true},
      "qualcomm-ui",
      "internal",
      "parent",
      ["sibling", "index"],
      "unknown",
      "style",
      "side_effect_style",
    ],
    ignoreCase: false,
    internalPattern: ["~"],
    newlinesBetween: true,
    order: "asc",
    sortSideEffects: false,
  },
  sortPackageJson: true,
  sortTailwindcss: true,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  vueIndentScriptAndStyle: false,
})
