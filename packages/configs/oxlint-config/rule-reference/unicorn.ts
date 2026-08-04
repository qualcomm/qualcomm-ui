// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=error; category=correctness; fixable=💡; version=v0.2.18
  "unicorn/no-await-in-promise-methods": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.15
  "unicorn/no-empty-file": "off",
  // default=error; category=correctness; fixable=none; version=v0.15.12
  "unicorn/no-invalid-fetch-options": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.16
  "unicorn/no-invalid-remove-event-listener": "error",
  // default=error; category=correctness; fixable=⚠️ 💡; version=v0.0.16
  "unicorn/no-new-array": "off",
  // default=error; category=correctness; fixable=🛠️; version=v0.2.18
  "unicorn/no-single-promise-in-promise-methods": "off",
  // default=error; category=correctness; fixable=none; version=v0.0.13
  "unicorn/no-thenable": "off",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.12
  "unicorn/no-unnecessary-await": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.16
  "unicorn/no-useless-fallback-in-spread": "off",
  // default=error; category=correctness; fixable=🚧; version=v0.0.19
  "unicorn/no-useless-length-check": "error",
  // default=error; category=correctness; fixable=⚠️ 🛠️; version=v0.0.19
  "unicorn/no-useless-spread": "off",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.19
  "unicorn/prefer-set-size": "error",
  // default=error; category=correctness; fixable=🛠️; version=v0.0.18
  "unicorn/prefer-string-starts-ends-with": "off",
}

const nursery: DummyRuleMap = {
  // default=off; category=nursery; fixable=🛠️ 💡; version=v1.59.0
  "unicorn/no-useless-iterator-to-array": "off",
}

const pedantic: DummyRuleMap = {
  // default=off; category=pedantic; fixable=🛠️; version=v0.16.9
  "unicorn/consistent-assert": "off",
  // default=off; category=pedantic; fixable=💡; version=v0.10.1
  "unicorn/consistent-empty-array-spread": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.19
  "unicorn/escape-case": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.19
  "unicorn/explicit-length-check": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.16
  "unicorn/new-for-builtins": "off",
  // default=off; category=pedantic; fixable=🚧; version=v1.19.0
  "unicorn/no-array-callback-reference": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.18
  "unicorn/no-hex-escape": "off",
  // default=off; category=pedantic; fixable=🚧; version=v1.35.0
  "unicorn/no-immediate-mutation": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.8
  "unicorn/no-instanceof-array": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.18
  "unicorn/no-lonely-if": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.18
  "unicorn/no-negated-condition": "off",
  // default=off; category=pedantic; fixable=💡; version=v0.5.3
  "unicorn/no-negation-in-equality-check": "off",
  // default=off; category=pedantic; fixable=💡; version=v0.0.16
  "unicorn/no-new-buffer": "off",
  // default=off; category=pedantic; fixable=none; version=v0.0.16
  "unicorn/no-object-as-default-parameter": "off",
  // default=off; category=pedantic; fixable=⚠️ 🛠️; version=v0.0.16
  "unicorn/no-static-only-class": "error",
  // default=off; category=pedantic; fixable=none; version=v0.0.18
  "unicorn/no-this-assignment": "off",
  // default=off; category=pedantic; fixable=🛠️ 💡; version=v0.0.18
  "unicorn/no-typeof-undefined": "off",
  // default=off; category=pedantic; fixable=💡; version=v0.16.12
  "unicorn/no-unnecessary-array-flat-depth": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v1.20.0
  "unicorn/no-unnecessary-array-splice-count": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.16.10
  "unicorn/no-unnecessary-slice-end": "off",
  // default=off; category=pedantic; fixable=none; version=v0.0.19
  "unicorn/no-unreadable-iife": "error",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.18
  "unicorn/no-useless-promise-resolve-reject": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.18
  "unicorn/no-useless-switch-case": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.6.1
  "unicorn/no-useless-undefined": "off",
  // default=off; category=pedantic; fixable=⚠️ 🛠️; version=v0.0.20
  "unicorn/prefer-array-flat": "off",
  // default=off; category=pedantic; fixable=💡; version=v0.0.18
  "unicorn/prefer-array-some": "off",
  // default=off; category=pedantic; fixable=⚠️ 🛠️; version=v1.20.0
  "unicorn/prefer-at": "warn",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.16
  "unicorn/prefer-blob-reading-methods": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.16
  "unicorn/prefer-code-point": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.16
  "unicorn/prefer-date-now": "warn",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.18
  "unicorn/prefer-dom-node-append": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.18
  "unicorn/prefer-dom-node-dataset": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.18
  "unicorn/prefer-dom-node-remove": "off",
  // default=off; category=pedantic; fixable=none; version=v0.0.18
  "unicorn/prefer-event-target": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v1.59.0
  "unicorn/prefer-import-meta-properties": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.10.1
  "unicorn/prefer-math-min-max": "off",
  // default=off; category=pedantic; fixable=💡; version=v0.0.18
  "unicorn/prefer-math-trunc": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.19
  "unicorn/prefer-native-coercion-functions": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.21
  "unicorn/prefer-prototype-methods": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.15
  "unicorn/prefer-query-selector": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.16
  "unicorn/prefer-regexp-test": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.18
  "unicorn/prefer-string-replace-all": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.18
  "unicorn/prefer-string-slice": "off",
  // default=off; category=pedantic; fixable=🚧; version=v1.20.0
  "unicorn/prefer-top-level-await": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.16
  "unicorn/prefer-type-error": "off",
  // default=off; category=pedantic; fixable=🛠️; version=v0.0.15
  "unicorn/require-number-to-fixed-digits-argument": "off",
}

const perf: DummyRuleMap = {
  // default=off; category=perf; fixable=🚧; version=v0.16.12
  "unicorn/prefer-array-find": "error",
  // default=off; category=perf; fixable=🛠️; version=v0.0.14
  "unicorn/prefer-array-flat-map": "off",
  // default=off; category=perf; fixable=⚠️ 🛠️; version=v0.13.2
  "unicorn/prefer-set-has": "off",
}

const restriction: DummyRuleMap = {
  // default=off; category=restriction; fixable=none; version=v1.67.0
  "unicorn/import-style": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.18
  "unicorn/no-abusive-eslint-disable": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.3.3
  "unicorn/no-anonymous-default-export": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.0.19
  "unicorn/no-array-for-each": "warn",
  // default=off; category=restriction; fixable=none; version=v0.0.19
  "unicorn/no-array-reduce": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.18
  "unicorn/no-document-cookie": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.7.0
  "unicorn/no-length-as-slice-end": "off",
  // default=off; category=restriction; fixable=none; version=v0.4.2
  "unicorn/no-magic-array-flat-depth": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.2.9
  "unicorn/no-process-exit": "off",
  // default=off; category=restriction; fixable=💡; version=v1.20.0
  "unicorn/no-useless-error-capture-stack-trace": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.1.1
  "unicorn/prefer-modern-math-apis": "off",
  // default=off; category=restriction; fixable=🚧; version=v1.50.0
  "unicorn/prefer-module": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.0.19
  "unicorn/prefer-node-protocol": "error",
  // default=off; category=restriction; fixable=⚠️ 🛠️; version=v0.0.19
  "unicorn/prefer-number-properties": "off",
}

const style: DummyRuleMap = {
  // default=off; category=style; fixable=🛠️; version=v0.0.14
  "unicorn/catch-error-name": "off",
  // default=off; category=style; fixable=🛠️; version=v0.15.13
  "unicorn/consistent-date-clone": "off",
  // default=off; category=style; fixable=🛠️; version=v0.12.0
  "unicorn/consistent-existence-index-check": "off",
  // default=off; category=style; fixable=🛠️; version=v1.60.0
  "unicorn/consistent-template-literal-escape": "off",
  // default=off; category=style; fixable=🚧; version=v1.57.0
  "unicorn/custom-error-definition": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.18
  "unicorn/empty-brace-spaces": "off",
  // default=off; category=style; fixable=none; version=v0.0.14
  "unicorn/error-message": "off",
  // default=off; category=style; fixable=none; version=v0.0.14
  "unicorn/filename-case": "off",
  // default=off; category=style; fixable=🚧; version=v0.16.12
  "unicorn/no-array-method-this-argument": "off",
  // default=off; category=style; fixable=⚠️ 🛠️; version=v0.0.19
  "unicorn/no-await-expression-member": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.14
  "unicorn/no-console-spaces": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.18
  "unicorn/no-nested-ternary": "off",
  // default=off; category=style; fixable=⚠️ 🛠️; version=v0.0.21
  "unicorn/no-null": "off",
  // default=off; category=style; fixable=🚧; version=v0.0.19
  "unicorn/no-unreadable-array-destructuring": "off",
  // default=off; category=style; fixable=💡; version=v1.28.0
  "unicorn/no-useless-collection-argument": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.18
  "unicorn/no-zero-fractions": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.18
  "unicorn/number-literal-case": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.19
  "unicorn/numeric-separators-style": "off",
  // default=off; category=style; fixable=🚧; version=v0.16.12
  "unicorn/prefer-array-index-of": "off",
  // default=off; category=style; fixable=🛠️; version=v1.30.0
  "unicorn/prefer-bigint-literals": "off",
  // default=off; category=style; fixable=🛠️ 💡; version=v1.20.0
  "unicorn/prefer-class-fields": "off",
  // default=off; category=style; fixable=🛠️; version=v1.20.0
  "unicorn/prefer-classlist-toggle": "off",
  // default=off; category=style; fixable=🛠️; version=v1.33.0
  "unicorn/prefer-default-parameters": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.21
  "unicorn/prefer-dom-node-text-content": "off",
  // default=off; category=style; fixable=💡; version=v0.16.12
  "unicorn/prefer-global-this": "off",
  // default=off; category=style; fixable=💡; version=v0.0.18
  "unicorn/prefer-includes": "off",
  // default=off; category=style; fixable=🛠️; version=v1.33.0
  "unicorn/prefer-keyboard-event-key": "off",
  // default=off; category=style; fixable=💡; version=v0.0.15
  "unicorn/prefer-logical-operator-over-ternary": "off",
  // default=off; category=style; fixable=💡; version=v0.0.20
  "unicorn/prefer-modern-dom-apis": "off",
  // default=off; category=style; fixable=🛠️; version=v0.13.2
  "unicorn/prefer-negative-index": "off",
  // default=off; category=style; fixable=🚧; version=v0.16.12
  "unicorn/prefer-object-from-entries": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.17
  "unicorn/prefer-optional-catch-binding": "off",
  // default=off; category=style; fixable=💡; version=v0.0.19
  "unicorn/prefer-reflect-apply": "off",
  // default=off; category=style; fixable=💡; version=v1.29.0
  "unicorn/prefer-response-static-json": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.17
  "unicorn/prefer-spread": "off",
  // default=off; category=style; fixable=🛠️; version=v0.12.0
  "unicorn/prefer-string-raw": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.16
  "unicorn/prefer-string-trim-start-end": "error",
  // default=off; category=style; fixable=💡; version=v0.9.0
  "unicorn/prefer-structured-clone": "off",
  // default=off; category=style; fixable=🚧; version=v1.50.0
  "unicorn/prefer-ternary": "off",
  // default=off; category=style; fixable=🛠️ 💡; version=v1.44.0
  "unicorn/relative-url-style": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.19
  "unicorn/require-array-join-separator": "off",
  // default=off; category=style; fixable=💡; version=v1.35.0
  "unicorn/require-module-attributes": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.15
  "unicorn/switch-case-braces": "off",
  // default=off; category=style; fixable=🚧; version=v1.59.0
  "unicorn/switch-case-break-position": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.15
  "unicorn/text-encoding-identifier-case": "off",
  // default=off; category=style; fixable=🛠️; version=v0.0.14
  "unicorn/throw-new-error": "off",
}

const suspicious: DummyRuleMap = {
  // default=off; category=suspicious; fixable=🚧; version=v0.8.0
  "unicorn/consistent-function-scoping": "off",
  // default=off; category=suspicious; fixable=none; version=v0.16.5
  "unicorn/no-accessor-recursion": "off",
  // default=off; category=suspicious; fixable=🛠️; version=v1.15.0
  "unicorn/no-array-reverse": "off",
  // default=off; category=suspicious; fixable=🛠️; version=v1.15.0
  "unicorn/no-array-sort": "off",
  // default=off; category=suspicious; fixable=💡; version=v0.16.12
  "unicorn/no-instanceof-builtins": "off",
  // default=off; category=suspicious; fixable=🚧; version=v0.0.16
  "unicorn/prefer-add-event-listener": "off",
  // default=off; category=suspicious; fixable=🛠️; version=v1.20.0
  "unicorn/require-module-specifiers": "off",
  // default=off; category=suspicious; fixable=💡; version=v0.15.15
  "unicorn/require-post-message-target-origin": "off",
}

export const unicornRules: DummyRuleMap = {
  ...correctness,
  ...nursery,
  ...pedantic,
  ...perf,
  ...restriction,
  ...style,
  ...suspicious,
}
