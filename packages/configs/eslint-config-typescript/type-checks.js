// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"

import {typescriptLanguageOptions, typescriptPlugins} from "./base.js"

/**
 * This configuration is based on
 * https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/recommended-type-checked.ts
 *
 * There are some key differences, primarily regarding rules involving `any`. We
 * set most of these to either warn or off: - Interop with untyped JS is a real
 * pain point where `any` is pragmatic. - Type gymnastics that satisfy the
 * compiler but obscure intent can be worse than `any` - The ceremony of unknown
 * + guards can be disproportionate to the actual risk. - External libraries
 * that use `any` can cause issues with our own types.
 */
export default defineConfig({
  languageOptions: typescriptLanguageOptions,
  name: "qui-typechecked-recommended",
  plugins: {...typescriptPlugins},
  rules: {
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-ts-comment": "warn", // Allow use of @ts-ignore, but warn
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-array-delete": "error",
    "@typescript-eslint/no-base-to-string": "error",
    "@typescript-eslint/no-duplicate-enum-values": "error",
    "@typescript-eslint/no-duplicate-type-constituents": "error",
    /**
     * Empty interfaces may be provided for module augmentation.
     * Empty object types may also be used as defaults in generics.
     */
    "@typescript-eslint/no-empty-object-type": "off",
    /* See above rational, re: `any` */
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-implied-eval": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    /**
     * Some projects choose to occasionally intentionally include a redundant
     * type constituent for documentation purposes. Like our icon, which is a
     * union of: `"xs" | "sm" | "md" | "lg" | "xl" | string | number`
     */
    "@typescript-eslint/no-redundant-type-constituents": "off",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    /* See above rational, re: `any` */
    "@typescript-eslint/no-unsafe-argument": "warn",
    /* See above rational, re: `any` */
    "@typescript-eslint/no-unsafe-assignment": "off",
    /* See above rational, re: `any` */
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-declaration-merging": "error",
    "@typescript-eslint/no-unsafe-enum-comparison": "error",
    "@typescript-eslint/no-unsafe-function-type": "error",
    /* See above rational, re: `any` */
    "@typescript-eslint/no-unsafe-member-access": "warn",
    /* See above rational, re: `any` */
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-unary-minus": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    /* This is handled via the `unused-imports` plugin */
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-wrapper-object-types": "error",
    "@typescript-eslint/only-throw-error": [
      "error",
      {
        // allow throwing built-in Response and react-router redirects.
        allow: [
          {from: "lib", name: "Response"},
          {from: "package", name: "redirect", package: "react-router"},
        ],
      },
    ],
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/prefer-promise-reject-errors": [
      "error",
      {
        allowThrowingUnknown: true,
      },
    ],
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "@typescript-eslint/restrict-template-expressions": "error",
    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/unbound-method": "off",
    "no-array-constructor": "off",
    "no-implied-eval": "off",
    "no-throw-literal": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "prefer-promise-reject-errors": "off",
    "require-await": "off",
  },
})
