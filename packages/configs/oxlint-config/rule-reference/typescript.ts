// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=error; category=correctness; fixable=💡; version=v1.12.0
  "typescript/await-thenable": "error",
  // default=error; category=correctness; fixable=💡; version=v1.12.0
  "typescript/no-array-delete": "error",
  // default=error; category=correctness; fixable=none; version=v1.12.0
  "typescript/no-base-to-string": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.8
  "typescript/no-duplicate-enum-values": "error",
  // default=error; category=correctness; fixable=🛠️; version=v1.12.0
  "typescript/no-duplicate-type-constituents": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.6
  "typescript/no-extra-non-null-assertion": "error",
  // default=error; category=correctness; fixable=💡; version=v1.11.0
  "typescript/no-floating-promises": "warn",
  // default=error; category=correctness; fixable=none; version=v1.12.0
  "typescript/no-for-in-array": "error",
  // default=error; category=correctness; fixable=none; version=v1.12.0
  "typescript/no-implied-eval": "off",
  // TODO: decide whether to enable. default=error; fixable=🛠️ 💡; version=v1.12.0
  "typescript/no-meaningless-void-operator": "off",
  // default=error; category=correctness; fixable=none; version=v0.0.7
  "typescript/no-misused-new": "error",
  // TODO: decide whether to enable. default=error; fixable=💡; version=v1.12.0
  "typescript/no-misused-spread": "off",
  // default=error; category=correctness; fixable=💡; version=v0.0.6
  "typescript/no-non-null-asserted-optional-chain": "error",
  // default=error; category=correctness; fixable=none; version=v1.12.0
  "typescript/no-redundant-type-constituents": "off",
  // default=error; category=correctness; fixable=none; version=v0.0.7
  "typescript/no-this-alias": "error",
  // TODO: decide whether to enable. default=error; fixable=💡; version=v0.15.13
  "typescript/no-unnecessary-parameter-property-assignment": "off",
  // default=error; category=correctness; fixable=none; version=v0.0.11
  "typescript/no-unsafe-declaration-merging": "error",
  // default=error; category=correctness; fixable=none; version=v1.12.0
  "typescript/no-unsafe-unary-minus": "error",
  // TODO: decide whether to enable. default=error; fixable=none; version=v1.49.0
  "typescript/no-useless-default-assignment": "off",
  // TODO: decide whether to enable. default=error; fixable=🛠️; version=v0.4.4
  "typescript/no-useless-empty-export": "off",
  // default=error; category=correctness; fixable=🛠️; version=v0.8.0
  "typescript/no-wrapper-object-types": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.8
  "typescript/prefer-as-const": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.7.0
  "typescript/prefer-namespace-keyword": "error",
  // TODO: decide whether to enable. default=error; fixable=none; version=v1.12.0
  "typescript/require-array-sort-compare": "off",
  // default=error; category=correctness; fixable=none; version=v1.12.0
  "typescript/restrict-template-expressions": "error",
  // default=error; category=correctness; fixable=none; version=v0.2.0
  "typescript/triple-slash-reference": "error",
  // default=error; category=correctness; fixable=none; version=v1.12.0
  "typescript/unbound-method": "off",
}

const nursery: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.48.0
  "typescript/no-unnecessary-condition": "off",
  // TODO: decide whether to enable. default=off; fixable=⚠️ 🛠 💡; version=v1.39.0
  "typescript/prefer-optional-chain": "off",
}

const pedantic: DummyRuleMap = {
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.8
  "typescript/ban-ts-comment": "warn",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.14
  "typescript/ban-types": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️ 💡; version=v1.12.0
  "typescript/no-confusing-void-expression": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.26.0
  "typescript/no-deprecated": "off",
  // default=off; category=pedantic; fixable=none; version=v1.11.0
  "typescript/no-misused-promises": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.12.0
  "typescript/no-mixed-enums": "off",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/no-unsafe-argument": "warn",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/no-unsafe-assignment": "off",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/no-unsafe-call": "warn",
  // default=off; category=pedantic; fixable=none; version=v0.11.1
  "typescript/no-unsafe-function-type": "error",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/no-unsafe-member-access": "warn",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/no-unsafe-return": "warn",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/only-throw-error": "error",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.3.2
  "typescript/prefer-enum-initializers": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.29.0
  "typescript/prefer-includes": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.33.0
  "typescript/prefer-nullish-coalescing": "off",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/prefer-promise-reject-errors": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.49.0
  "typescript/prefer-readonly-parameter-types": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.11
  "typescript/prefer-ts-expect-error": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.12.0
  "typescript/related-getter-setter-pairs": "off",
  // default=off; category=pedantic; fixable=💡; version=v1.12.0
  "typescript/require-await": "error",
  // default=off; category=pedantic; fixable=none; version=v1.12.0
  "typescript/restrict-plus-operands": "error",
  // TODO: decide whether to enable. default=off; fixable=🛠️ 💡; version=v1.12.0
  "typescript/return-await": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v1.25.0
  "typescript/strict-boolean-expressions": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.8
  "typescript/strict-void-return": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v1.12.0
  "typescript/switch-exhaustiveness-check": "off",
}

const restriction: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.4
  "typescript/explicit-function-return-type": "off",
  // default=off; category=restriction; fixable=🛠️ 💡; version=v1.61.0
  "typescript/explicit-member-accessibility": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.9.0
  "typescript/explicit-module-boundary-types": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.5.2
  "typescript/no-dynamic-delete": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.12.0
  "typescript/no-empty-object-type": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.0.13
  "typescript/no-explicit-any": "warn",
  // default=off; category=restriction; fixable=🛠️; version=v0.5.0
  "typescript/no-import-type-side-effects": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.47.0
  "typescript/no-invalid-void-type": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.8
  "typescript/no-namespace": "error",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.5.0
  "typescript/no-non-null-asserted-nullish-coalescing": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.5.0
  "typescript/no-non-null-assertion": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.13.0
  "typescript/no-require-imports": "error",
  // TODO: decide whether to enable. default=off; fixable=🛠️ 💡; version=v1.31.0
  "typescript/no-restricted-types": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.7
  "typescript/no-var-requires": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v1.12.0
  "typescript/non-nullable-type-assertion-style": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.3.2
  "typescript/prefer-literal-enum-member": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.12.0
  "typescript/promise-function-async": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v1.12.0
  "typescript/use-unknown-in-catch-callback-variable": "off",
}

const style: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.7
  "typescript/adjacent-overload-signatures": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.8
  "typescript/array-type": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.9
  "typescript/ban-tslint-comment": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v1.47.0
  "typescript/class-literal-property-style": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.14.0
  "typescript/consistent-generic-constructors": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.4.2
  "typescript/consistent-indexed-object-style": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️ 💡; version=v1.44.0
  "typescript/consistent-type-assertions": "off",
  // TODO: decide whether to enable. default=off; fixable=⚠️ 🛠️; version=v0.2.17
  "typescript/consistent-type-definitions": "off",
  // default=off; category=style; fixable=none; version=v0.0.8
  "typescript/consistent-type-exports": "error",
  // default=off; category=style; fixable=🛠️; version=v0.5.2
  "typescript/consistent-type-imports": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.49.0
  "typescript/dot-notation": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v1.68.0
  "typescript/method-signature-style": "off",
  // default=off; category=style; fixable=🚧; version=v0.0.6
  "typescript/no-empty-interface": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.14.0
  "typescript/no-inferrable-types": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.49.0
  "typescript/no-unnecessary-qualifier": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.48.0
  "typescript/parameter-properties": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.49.0
  "typescript/prefer-find": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.2.16
  "typescript/prefer-for-of": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.11
  "typescript/prefer-function-type": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.8
  "typescript/prefer-readonly": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.12.0
  "typescript/prefer-reduce-type-parameter": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.49.0
  "typescript/prefer-regexp-exec": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.12.0
  "typescript/prefer-return-this-type": "off",
  // TODO: decide whether to enable. default=error; fixable=none; version=v0.0.8
  "typescript/prefer-string-starts-ends-with": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.48.0
  "typescript/unified-signatures": "off",
}

const suspicious: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.8
  "typescript/consistent-return": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.6.1
  "typescript/no-confusing-non-null-assertion": "off",
  // TODO: decide whether to enable. default=off; fixable=⚠️ 💡; version=v0.7.0
  "typescript/no-extraneous-class": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v1.12.0
  "typescript/no-unnecessary-boolean-literal-compare": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.12.0
  "typescript/no-unnecessary-template-expression": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.12.0
  "typescript/no-unnecessary-type-arguments": "off",
  // default=off; category=suspicious; fixable=🛠️; version=v1.12.0
  "typescript/no-unnecessary-type-assertion": "error",
  // default=off; category=suspicious; fixable=🚧; version=v0.0.6
  "typescript/no-unnecessary-type-constraint": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.49.0
  "typescript/no-unnecessary-type-conversion": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.49.0
  "typescript/no-unnecessary-type-parameters": "off",
  // default=off; category=suspicious; fixable=💡; version=v1.12.0
  "typescript/no-unsafe-enum-comparison": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.12.0
  "typescript/no-unsafe-type-assertion": "off",
}

export const typescriptRules: DummyRuleMap = {
  ...correctness,
  ...nursery,
  ...pedantic,
  ...restriction,
  ...style,
  ...suspicious,
}
