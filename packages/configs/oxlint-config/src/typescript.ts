// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap, OxlintConfig} from "oxlint"

export const typescriptPlugins: NonNullable<OxlintConfig["plugins"]> = [
  "typescript",
  "import",
  "promise",
  "node",
]

export const typescriptRules: DummyRuleMap = {
  "typescript/await-thenable": "error",
  "typescript/ban-ts-comment": "warn",
  "typescript/consistent-type-exports": [
    "error",
    {fixMixedExportsWithInlineTypeSpecifier: true},
  ],
  "typescript/consistent-type-imports": [
    "error",
    {fixStyle: "inline-type-imports"},
  ],
  "typescript/explicit-member-accessibility": [
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
  "typescript/no-array-delete": "error",
  "typescript/no-base-to-string": "error",
  "typescript/no-duplicate-enum-values": "error",
  "typescript/no-duplicate-type-constituents": "error",
  "typescript/no-empty-interface": "off",
  "typescript/no-empty-object-type": "off",
  "typescript/no-explicit-any": "warn",
  "typescript/no-extra-non-null-assertion": "error",
  "typescript/no-floating-promises": "warn",
  "typescript/no-for-in-array": "error",
  "typescript/no-implied-eval": "off",
  "typescript/no-import-type-side-effects": "error",
  "typescript/no-misused-new": "error",
  "typescript/no-misused-promises": "error",
  "typescript/no-namespace": "error",
  "typescript/no-non-null-asserted-optional-chain": "error",
  "typescript/no-redundant-type-constituents": "off",
  "typescript/no-require-imports": "error",
  "typescript/no-this-alias": "error",
  "typescript/no-unnecessary-type-assertion": "error",
  "typescript/no-unnecessary-type-constraint": "error",
  "typescript/no-unsafe-argument": "warn",
  "typescript/no-unsafe-assignment": "off",
  "typescript/no-unsafe-call": "warn",
  "typescript/no-unsafe-declaration-merging": "error",
  "typescript/no-unsafe-enum-comparison": "error",
  "typescript/no-unsafe-function-type": "error",
  "typescript/no-unsafe-member-access": "warn",
  "typescript/no-unsafe-return": "warn",
  "typescript/no-unsafe-unary-minus": "error",
  "typescript/no-var-requires": "off",
  "typescript/no-wrapper-object-types": "error",
  "typescript/only-throw-error": [
    "error",
    {
      allow: [
        {from: "lib", name: "Response"},
        {from: "package", name: "redirect", package: "react-router"},
      ],
    },
  ],
  "typescript/prefer-as-const": "error",
  "typescript/prefer-namespace-keyword": "error",
  "typescript/prefer-promise-reject-errors": [
    "error",
    {
      allowThrowingUnknown: true,
    },
  ],
  "typescript/require-await": "error",
  "typescript/restrict-plus-operands": "error",
  "typescript/restrict-template-expressions": "error",
  "typescript/triple-slash-reference": "error",
  "typescript/unbound-method": "off",
}
