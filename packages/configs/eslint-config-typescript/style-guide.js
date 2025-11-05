// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import stylistic from "@stylistic/eslint-plugin"
import {defineConfig} from "eslint/config"
import commentLength from "eslint-plugin-comment-length"
import importPlugin from "eslint-plugin-import"
import perfectionist from "eslint-plugin-perfectionist"
import prettierPlugin from "eslint-plugin-prettier"
import unusedImportsPlugin from "eslint-plugin-unused-imports"

export default defineConfig({
  name: "qui-style-guide",
  plugins: {
    "@stylistic": stylistic,
    "comment-length": commentLength,
    import: importPlugin,
    perfectionist,
    prettier: prettierPlugin,
    "unused-imports": unusedImportsPlugin,
  },
  rules: {
    ...commentLength.configs["flat/recommended"].rules,
    "@stylistic/spaced-comment": ["error", "always", {block: {balanced: true}}],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "explicit",
        overrides: {
          accessors: "no-public",
          constructors: "off",
          methods: "no-public",
          parameterProperties: "off",
          properties: "no-public",
        },
      },
    ],
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-extra-semi": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-var-requires": "off",
    "comment-length/limit-multi-line-comments": [
      "warn",
      {
        ignoreUrls: true,
        maxLength: 85,
      },
    ],
    "comment-length/limit-single-line-comments": [
      "warn",
      {
        ignoreUrls: true,
        maxLength: 85,
      },
    ],
    curly: "error",
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
    "import/newline-after-import": ["error", {count: 1}],
    "import/no-cycle": [0],
    "import/no-duplicates": ["error", {"prefer-inline": true}],
    "import/order": [
      "error",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: [
          ["builtin", "external"],
          ["internal"],
          ["parent"],
          ["sibling", "index"],
          ["unknown"],
        ],
        "newlines-between": "always",
        pathGroups: [
          {
            group: "external",
            pattern: "react",
            position: "before",
          },
          {
            group: "external",
            pattern: "@qualcomm-ui/**",
            position: "after",
          },
          {
            group: "internal",
            pattern: "~**",
          },
          {
            group: "internal",
            pattern: "~**/*",
          },
          {
            group: "internal",
            pattern: "~**/**",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
      },
    ],
    "multiline-comment-style": ["off"],
    "no-array-constructor": "error",
    "no-case-declarations": "off",
    "no-const-assign": "error",
    "no-duplicate-imports": "off",
    "no-inner-declarations": "off",
    "no-invalid-this": "off",
    "no-prototype-builtins": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@qualcomm-ui/*/src/**/*"],
            message:
              "Relative imports from src directories are not allowed. Please ensure that the targeted dependency is exported properly from its module",
          },
          {
            group: ["@qualcomm-ui/*/src"],
            message: 'Remove "src" (import directly)',
          },
        ],
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        message: "Use `private` instead",
        selector:
          ":matches(PropertyDefinition, MethodDefinition) > PrivateIdentifier.key",
      },
    ],
    "no-undef": "off",
    "no-unused-vars": "off",
    "no-useless-concat": "error",
    "no-useless-escape": "warn",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-const": "error",
    "prefer-template": ["error"],
    "prettier/prettier": "error",
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^",
        vars: "all",
        varsIgnorePattern: "^_",
      },
    ],
  },
})
