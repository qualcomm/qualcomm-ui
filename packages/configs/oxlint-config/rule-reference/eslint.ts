// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/constructor-super": "error",
  // default=error; category=correctness; fixable=⚠️ 🛠️; version=v0.0.3
  "eslint/for-direction": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/getter-return": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-async-promise-executor": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-caller": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-class-assign": "error",
  // default=error; category=correctness; fixable=🛠️ 💡; version=v0.0.3
  "eslint/no-compare-neg-zero": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.5
  "eslint/no-cond-assign": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-const-assign": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-constant-binary-expression": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-constant-condition": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.7
  "eslint/no-control-regex": "off",
  // default=error; category=correctness; fixable=💡; version=v0.0.3
  "eslint/no-debugger": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.4
  "eslint/no-delete-var": "warn",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-dupe-class-members": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.5
  "eslint/no-dupe-else-if": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-dupe-keys": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-duplicate-case": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.7
  "eslint/no-empty-character-class": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-empty-pattern": "error",
  // default=error; category=correctness; fixable=💡; version=v0.0.19
  "eslint/no-empty-static-block": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-eval": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.4
  "eslint/no-ex-assign": "error",
  // default=error; category=correctness; fixable=🛠️ 💡; version=v0.0.8
  "eslint/no-extra-boolean-cast": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-func-assign": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.7
  "eslint/no-global-assign": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.5
  "eslint/no-import-assign": "error",
  // default=error; category=correctness; fixable=none; version=v0.9.4
  "eslint/no-invalid-regexp": "error",
  // default=error; category=correctness; fixable=none; version=v0.1.1
  "eslint/no-irregular-whitespace": "error",
  // default=error; category=correctness; fixable=💡; version=v0.2.15
  "eslint/no-iterator": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.7
  "eslint/no-loss-of-precision": "error",
  // default=error; category=correctness; fixable=💡; version=v1.17.0
  "eslint/no-misleading-character-class": "error",
  // default=error; category=correctness; fixable=none; version=v0.3.3
  "eslint/no-new-native-nonconstructor": "error",
  // default=error; category=correctness; fixable=💡; version=v0.2.10
  "eslint/no-nonoctal-decimal-escape": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.7
  "eslint/no-obj-calls": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.5
  "eslint/no-self-assign": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-setter-return": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "eslint/no-shadow-restricted-names": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.4
  "eslint/no-sparse-arrays": "error",
  // default=error; category=correctness; fixable=none; version=v0.2.6
  "eslint/no-this-before-super": "error",
  // default=error; category=correctness; fixable=none; version=v1.10.0
  "eslint/no-unassigned-vars": "error",
  // default=error; category=correctness; fixable=none; version=v0.4.4
  "eslint/no-unreachable": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.5
  "eslint/no-unsafe-finally": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.3
  "eslint/no-unsafe-negation": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.5
  "eslint/no-unsafe-optional-chaining": "error",
  // default=error; category=correctness; fixable=none; version=v0.14.0
  "eslint/no-unused-expressions": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.3
  "eslint/no-unused-labels": "error",
  // default=error; category=correctness; fixable=none; version=v0.1.1
  "eslint/no-unused-private-class-members": "error",
  // default=error; category=correctness; fixable=⚠️ 🛠 💡; version=v0.7.0
  "eslint/no-unused-vars": "error",
  // default=error; category=correctness; fixable=none; version=v0.16.10
  "eslint/no-useless-backreference": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.5
  "eslint/no-useless-catch": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.5
  "eslint/no-useless-escape": "warn",
  // default=error; category=correctness; fixable=🛠️; version=v0.2.14
  "eslint/no-useless-rename": "error",
  // default=error; category=correctness; fixable=none; version=v0.2.14
  "eslint/no-with": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.4
  "eslint/require-yield": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.3
  "eslint/use-isnan": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.3
  "eslint/valid-typeof": "error",
}

const nursery: DummyRuleMap = {
  // default=off; category=nursery; fixable=none; version=v1.59.0
  "eslint/no-restricted-exports": "off",
  // default=off; category=nursery; fixable=none; version=v0.0.8
  "eslint/no-undef": "off",
  // default=off; category=nursery; fixable=none; version=v1.59.0
  "eslint/no-useless-assignment": "off",
}

const pedantic: DummyRuleMap = {
  // default=off; category=pedantic; fixable=none; version=v1.33.0
  "eslint/accessor-pairs": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.3
  "eslint/array-callback-return": "off",
  // default=off; category=pedantic; fixable=⚠️ 🛠️; version=v0.0.3
  "eslint/eqeqeq": "error",
  // default=off; category=pedantic; fixable=none; version=v0.3.4
  "eslint/max-classes-per-file": "off",
  // default=off; category=pedantic; fixable=none; version=v0.15.12
  "eslint/max-depth": "off",
  // default=off; category=pedantic; fixable=none; version=v0.2.14
  "eslint/max-lines": "off",
  // default=off; category=pedantic; fixable=none; version=v0.15.12
  "eslint/max-lines-per-function": "off",
  // default=off; category=pedantic; fixable=none; version=v0.15.12
  "eslint/max-nested-callbacks": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.3
  "eslint/no-array-constructor": "error",
  // default=off; category=pedantic; fixable=💡; version=v0.0.4
  "eslint/no-case-declarations": "off",
  // default=off; category=pedantic; fixable=none; version=v0.4.3
  "eslint/no-constructor-return": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.9.10
  "eslint/no-else-return": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.14
  "eslint/no-fallthrough": "off",
  // default=off; category=pedantic; fixable=none; version=v1.34.0
  "eslint/no-inline-comments": "off",
  // default=off; category=pedantic; fixable=none; version=v0.0.5
  "eslint/no-inner-declarations": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.16.0
  "eslint/no-lonely-if": "off",
  // default=off; category=pedantic; fixable=none; version=v1.33.0
  "eslint/no-loop-func": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.18
  "eslint/no-negated-condition": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.2.10
  "eslint/no-new-wrappers": "error",
  // default=off; category=pedantic; fixable=🚧; version=v0.13.2
  "eslint/no-object-constructor": "error",
  // default=off; category=pedantic; fixable=🚧; version=v1.33.0
  "eslint/no-promise-executor-return": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.5
  "eslint/no-prototype-builtins": "off",
  // default=off; category=pedantic; fixable=none; version=v0.0.13
  "eslint/no-redeclare": "error",
  // default=off; category=pedantic; fixable=none; version=v0.0.3
  "eslint/no-self-compare": "error",
  // default=off; category=pedantic; fixable=💡; version=v0.9.10
  "eslint/no-throw-literal": "off",
  // default=off; category=pedantic; fixable=🚧; version=v1.32.0
  "eslint/no-useless-return": "off",
  // default=off; category=pedantic; fixable=none; version=v1.24.0
  "eslint/no-warning-comments": "off",
  // default=off; category=pedantic; fixable=⚠️ 🛠️; version=v0.3.3
  "eslint/radix": "off",
  // default=off; category=pedantic; fixable=⚠️ 🛠️; version=v0.4.2
  "eslint/require-await": "off",
  // default=off; category=pedantic; fixable=🚧; version=v1.63.0
  "eslint/require-unicode-regexp": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.9.3
  "eslint/sort-vars": "off",
  // default=off; category=pedantic; fixable=none; version=v0.4.0
  "eslint/symbol-description": "off",
}

const perf: DummyRuleMap = {
  // default=off; category=perf; fixable=none; version=v0.3.2
  "eslint/no-await-in-loop": "off",
  // default=off; category=perf; fixable=none; version=v0.15.9
  "eslint/no-useless-call": "off",
}

const restriction: DummyRuleMap = {
  // default=off; category=restriction; fixable=none; version=v1.16.0
  "eslint/class-methods-use-this": "off",
  // default=off; category=restriction; fixable=none; version=v1.37.0
  "eslint/complexity": "off",
  // default=off; category=restriction; fixable=none; version=v0.4.0
  "eslint/default-case": "off",
  // default=off; category=restriction; fixable=none; version=v0.9.3
  "eslint/no-alert": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.3
  "eslint/no-bitwise": "off",
  // default=off; category=restriction; fixable=💡; version=v0.0.13
  "eslint/no-console": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.4.2
  "eslint/no-div-regex": "off",
  // default=off; category=restriction; fixable=💡; version=v0.0.3
  "eslint/no-empty": "off",
  // default=off; category=restriction; fixable=💡; version=v0.3.3
  "eslint/no-empty-function": "off",
  // default=off; category=restriction; fixable=⚠️ 🛠️; version=v0.2.14
  "eslint/no-eq-null": "off",
  // default=off; category=restriction; fixable=none; version=v1.65.0
  "eslint/no-implicit-globals": "off",
  // default=off; category=restriction; fixable=none; version=v1.20.0
  "eslint/no-param-reassign": "off",
  // default=off; category=restriction; fixable=💡; version=v0.9.5
  "eslint/no-plusplus": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.2.14
  "eslint/no-proto": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.0.18
  "eslint/no-regex-spaces": "off",
  // default=off; category=restriction; fixable=none; version=v0.4.0
  "eslint/no-restricted-globals": "off",
  // default=off; category=restriction; fixable=none; version=v0.15.0
  "eslint/no-restricted-imports": "off",
  // default=off; category=restriction; fixable=none; version=v1.63.0
  "eslint/no-restricted-properties": "off",
  // default=off; category=restriction; fixable=none; version=v1.33.0
  "eslint/no-sequences": "off",
  // default=off; category=restriction; fixable=none; version=v0.5.3
  "eslint/no-undefined": "off",
  // default=off; category=restriction; fixable=none; version=v1.49.0
  "eslint/no-use-before-define": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.1.1
  "eslint/no-var": "off",
  // default=off; category=restriction; fixable=💡; version=v0.2.5
  "eslint/no-void": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.3.3
  "eslint/unicode-bom": "off",
}

const style: DummyRuleMap = {
  // default=off; category=style; fixable=🛠️; version=v1.4.0
  "eslint/arrow-body-style": "off",
  // default=off; category=style; fixable=🛠️; version=v1.34.0
  "eslint/capitalized-comments": "off",
  // default=off; category=style; fixable=🛠️; version=v0.15.13
  "eslint/curly": "error",
  // default=off; category=style; fixable=none; version=v0.0.16
  "eslint/default-case-last": "off",
  // default=off; category=style; fixable=none; version=v0.2.15
  "eslint/default-param-last": "off",
  // default=off; category=style; fixable=none; version=v1.62.0
  "eslint/func-name-matching": "off",
  // default=off; category=style; fixable=🛠️ 💡; version=v0.7.0
  "eslint/func-names": "off",
  // default=off; category=style; fixable=🚧; version=v0.15.11
  "eslint/func-style": "off",
  // default=off; category=style; fixable=🚧; version=v0.15.12
  "eslint/grouped-accessor-pairs": "off",
  // default=off; category=style; fixable=none; version=v0.2.14
  "eslint/guard-for-in": "off",
  // default=off; category=style; fixable=none; version=v1.4.0
  "eslint/id-length": "off",
  // default=off; category=style; fixable=none; version=v1.66.0
  "eslint/id-match": "off",
  // default=off; category=style; fixable=none; version=v0.15.11
  "eslint/init-declarations": "off",
  // default=off; category=style; fixable=🚧; version=v1.63.0
  "eslint/logical-assignment-operators": "off",
  // default=off; category=style; fixable=none; version=v0.2.14
  "eslint/max-params": "off",
  // default=off; category=style; fixable=none; version=v1.35.0
  "eslint/max-statements": "off",
  // default=off; category=style; fixable=🚧; version=v0.15.5
  "eslint/new-cap": "off",
  // default=off; category=style; fixable=none; version=v0.2.14
  "eslint/no-continue": "off",
  // default=off; category=style; fixable=🚧; version=v0.13.2
  "eslint/no-duplicate-imports": "off",
  // default=off; category=style; fixable=🛠️; version=v0.15.4
  "eslint/no-extra-label": "off",
  // default=off; category=style; fixable=🛠️; version=v1.33.0
  "eslint/no-implicit-coercion": "off",
  // default=off; category=style; fixable=none; version=v0.6.0
  "eslint/no-label-var": "off",
  // default=off; category=style; fixable=none; version=v0.15.4
  "eslint/no-labels": "off",
  // default=off; category=style; fixable=none; version=v0.15.6
  "eslint/no-lone-blocks": "off",
  // default=off; category=style; fixable=🚧; version=v0.9.3
  "eslint/no-magic-numbers": "off",
  // default=off; category=style; fixable=none; version=v0.15.4
  "eslint/no-multi-assign": "off",
  // default=off; category=style; fixable=none; version=v0.5.3
  "eslint/no-multi-str": "off",
  // default=off; category=style; fixable=none; version=v0.15.4
  "eslint/no-nested-ternary": "off",
  // default=off; category=style; fixable=none; version=v0.9.2
  "eslint/no-new-func": "off",
  // default=off; category=style; fixable=none; version=v0.9.10
  "eslint/no-return-assign": "off",
  // default=off; category=style; fixable=none; version=v0.2.15
  "eslint/no-script-url": "off",
  // default=off; category=style; fixable=none; version=v0.2.14
  "eslint/no-template-curly-in-string": "off",
  // default=off; category=style; fixable=none; version=v0.2.14
  "eslint/no-ternary": "off",
  // default=off; category=style; fixable=🛠️; version=v1.16.0
  "eslint/no-useless-computed-key": "off",
  // default=off; category=style; fixable=🛠️; version=v1.59.0
  "eslint/object-shorthand": "error",
  // default=off; category=style; fixable=⚠️ 🛠️; version=v0.15.13
  "eslint/operator-assignment": "off",
  // default=off; category=style; fixable=🛠️; version=v1.65.0
  "eslint/prefer-arrow-callback": "off",
  // default=off; category=style; fixable=🛠️; version=v1.43.0
  "eslint/prefer-const": "error",
  // default=off; category=style; fixable=🛠️; version=v1.10.0
  "eslint/prefer-destructuring": "off",
  // default=off; category=style; fixable=🛠️; version=v0.4.0
  "eslint/prefer-exponentiation-operator": "off",
  // default=off; category=style; fixable=none; version=v1.68.0
  "eslint/prefer-named-capture-group": "off",
  // default=off; category=style; fixable=🛠️; version=v0.7.0
  "eslint/prefer-numeric-literals": "off",
  // default=off; category=style; fixable=🛠️; version=v0.11.0
  "eslint/prefer-object-has-own": "error",
  // default=off; category=style; fixable=🛠️; version=v0.15.9
  "eslint/prefer-object-spread": "off",
  // default=off; category=style; fixable=none; version=v0.15.7
  "eslint/prefer-promise-reject-errors": "off",
  // default=off; category=style; fixable=🚧; version=v1.64.0
  "eslint/prefer-regex-literals": "off",
  // default=off; category=style; fixable=none; version=v0.15.4
  "eslint/prefer-rest-params": "off",
  // default=off; category=style; fixable=none; version=v0.0.17
  "eslint/prefer-spread": "error",
  // default=off; category=style; fixable=🛠️; version=v1.12.0
  "eslint/prefer-template": "error",
  // default=off; category=style; fixable=🛠️; version=v0.4.4
  "eslint/sort-imports": "off",
  // default=off; category=style; fixable=🛠️; version=v0.9.4
  "eslint/sort-keys": "off",
  // default=off; category=style; fixable=none; version=v0.15.4
  "eslint/vars-on-top": "off",
  // default=off; category=style; fixable=🛠️; version=v0.14.1
  "eslint/yoda": "off",
}

const suspicious: DummyRuleMap = {
  // default=off; category=suspicious; fixable=none; version=v0.16.9
  "eslint/block-scoped-var": "error",
  // default=off; category=suspicious; fixable=none; version=v0.9.7
  "eslint/no-extend-native": "error",
  // default=off; category=suspicious; fixable=🚧; version=v1.1.0
  "eslint/no-extra-bind": "error",
  // default=error; category=suspicious; fixable=none; version=v1.66.0
  "eslint/no-implied-eval": "error",
  // default=off; category=suspicious; fixable=none; version=v0.4.0
  "eslint/no-new": "off",
  // default=off; category=suspicious; fixable=none; version=v1.48.0
  "eslint/no-shadow": "off",
  // default=off; category=suspicious; fixable=none; version=v1.62.0
  "eslint/no-underscore-dangle": "off",
  // default=off; category=suspicious; fixable=⚠️ 🛠️; version=v0.9.7
  "eslint/no-unexpected-multiline": "off",
  // default=off; category=suspicious; fixable=none; version=v1.48.0
  "eslint/no-unmodified-loop-condition": "off",
  // default=off; category=suspicious; fixable=⚠️ 🛠️; version=v0.15.12
  "eslint/no-unneeded-ternary": "off",
  // default=off; category=suspicious; fixable=🚧; version=v0.4.2
  "eslint/no-useless-concat": "error",
  // default=off; category=suspicious; fixable=💡; version=v0.4.4
  "eslint/no-useless-constructor": "off",
  // default=off; category=suspicious; fixable=🛠️; version=v1.16.0
  "eslint/preserve-caught-error": "off",
}

export const eslintRules: DummyRuleMap = {
  ...correctness,
  ...nursery,
  ...pedantic,
  ...perf,
  ...restriction,
  ...style,
  ...suspicious,
}
