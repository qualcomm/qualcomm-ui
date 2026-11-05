// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.39.0
  "vitest/consistent-each-for": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.12
  "vitest/expect-expect": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v1.39.0
  "vitest/hoisted-apis-on-top": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.12
  "vitest/no-conditional-expect": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.8.0
  "vitest/no-conditional-tests": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.7
  "vitest/no-disabled-tests": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.0.8
  "vitest/no-focused-tests": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.13
  "vitest/no-standalone-expect": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.59.0
  "vitest/prefer-snapshot-hint": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.58.0
  "vitest/require-awaited-expect-poll": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.8.0
  "vitest/require-local-test-context-for-concurrent-snapshots": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.58.0
  "vitest/require-mock-type-parameters": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.9
  "vitest/require-to-throw-message": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.8
  "vitest/valid-describe-callback": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.0.14
  "vitest/valid-expect": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.60.0
  "vitest/valid-expect-in-promise": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.0.14
  "vitest/valid-title": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.37.0
  "vitest/warn-todo": "off",
}

const pedantic: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.8.0
  "vitest/no-conditional-in-test": "off",
}

const restriction: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.58.0
  "vitest/require-test-timeout": "off",
}

const style: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.36.0
  "vitest/consistent-test-filename": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.5.3
  "vitest/consistent-test-it": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.37.0
  "vitest/consistent-vitest-vi": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.18
  "vitest/max-expects": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.4
  "vitest/max-nested-describe": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.0.12
  "vitest/no-alias-methods": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.0
  "vitest/no-duplicate-hooks": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.16
  "vitest/no-hooks": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.14
  "vitest/no-identical-title": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.7.0
  "vitest/no-import-node-test": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.49.0
  "vitest/no-importing-vitest-globals": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.13
  "vitest/no-interpolation-in-snapshots": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.3
  "vitest/no-large-snapshots": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.13
  "vitest/no-mocks-import": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.3
  "vitest/no-restricted-matchers": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.3
  "vitest/no-restricted-vi-methods": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.0.7
  "vitest/no-test-prefixes": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.0
  "vitest/no-test-return-statement": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.39.0
  "vitest/no-unneeded-async-expect-function": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.66.0
  "vitest/padding-around-after-all-blocks": "off",
  // TODO: decide whether to enable. default=off; fixable=⚠️ 🛠️; version=v1.58.0
  "vitest/prefer-called-exactly-once-with": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.39.0
  "vitest/prefer-called-once": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.35.0
  "vitest/prefer-called-times": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.5
  "vitest/prefer-called-with": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.15
  "vitest/prefer-comparison-matcher": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.39.0
  "vitest/prefer-describe-function-title": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.9.0
  "vitest/prefer-each": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.2.9
  "vitest/prefer-equality-matcher": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v1.62.0
  "vitest/prefer-expect-assertions": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.14
  "vitest/prefer-expect-resolves": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.44.0
  "vitest/prefer-expect-type-of": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.6.0
  "vitest/prefer-hooks-in-order": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.2
  "vitest/prefer-hooks-on-top": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.49.0
  "vitest/prefer-import-in-mock": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.59.0
  "vitest/prefer-importing-vitest-globals": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.15.9
  "vitest/prefer-lowercase-title": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.16
  "vitest/prefer-mock-promise-shorthand": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.49.0
  "vitest/prefer-mock-return-shorthand": "off",
  // TODO: decide whether to enable. default=off; fixable=💡; version=v0.2.14
  "vitest/prefer-spy-on": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.57.0
  "vitest/prefer-strict-boolean-matchers": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.13
  "vitest/prefer-strict-equal": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.14
  "vitest/prefer-to-be": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.7.1
  "vitest/prefer-to-be-falsy": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.9.2
  "vitest/prefer-to-be-object": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.7.1
  "vitest/prefer-to-be-truthy": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.14
  "vitest/prefer-to-contain": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v1.34.0
  "vitest/prefer-to-have-been-called-times": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.2.13
  "vitest/prefer-to-have-length": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.0.16
  "vitest/prefer-todo": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.3.2
  "vitest/require-hook": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.2
  "vitest/require-top-level-describe": "off",
}

const suspicious: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.0.8
  "vitest/no-commented-out-tests": "off",
}

export const vitestRules: DummyRuleMap = {
  ...correctness,
  ...pedantic,
  ...restriction,
  ...style,
  ...suspicious,
}
