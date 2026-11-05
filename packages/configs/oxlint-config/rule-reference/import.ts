// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=off; category=correctness; fixable=none; version=v0.0.13
  "import/default": "off",
  // default=off; category=correctness; fixable=none; version=v0.2.11
  "import/namespace": "off",
}

const nursery: DummyRuleMap = {
  // default=off; category=nursery; fixable=none; version=v0.0.21
  "import/export": "error",
  // default=off; category=nursery; fixable=none; version=v0.0.13
  "import/named": "error",
}

const pedantic: DummyRuleMap = {
  // default=off; category=pedantic; fixable=none; version=v0.5.0
  "import/max-dependencies": "off",
}

const restriction: DummyRuleMap = {
  // default=off; category=restriction; fixable=none; version=v1.2.0
  "import/extensions": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.16
  "import/no-amd": "error",
  // default=off; category=restriction; fixable=none; version=v0.11.0
  "import/no-commonjs": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.13
  "import/no-cycle": "off",
  // default=off; category=restriction; fixable=none; version=v0.2.14
  "import/no-default-export": "off",
  // default=off; category=restriction; fixable=none; version=v0.9.3
  "import/no-dynamic-require": "error",
  // default=off; category=restriction; fixable=none; version=v1.43.0
  "import/no-relative-parent-imports": "off",
  // default=off; category=restriction; fixable=none; version=v0.7.0
  "import/no-webpack-loader-syntax": "off",
  // default=off; category=restriction; fixable=none; version=v0.11.1
  "import/unambiguous": "off",
}

const style: DummyRuleMap = {
  // default=off; category=style; fixable=🛠️; version=v0.16.11
  "import/consistent-type-specifier-style": "off",
  // default=off; category=style; fixable=none; version=v0.15.14
  "import/exports-last": "off",
  // default=off; category=style; fixable=🚧; version=v0.11.1
  "import/first": "error",
  // default=off; category=style; fixable=none; version=v0.16.6
  "import/group-exports": "off",
  // default=off; category=style; fixable=🛠️; version=v1.66.0
  "import/newline-after-import": "error",
  // default=off; category=style; fixable=none; version=v0.15.14
  "import/no-anonymous-default-export": "off",
  // default=off; category=style; fixable=none; version=v0.2.11
  "import/no-duplicates": "off",
  // default=off; category=style; fixable=none; version=v0.15.13
  "import/no-mutable-exports": "error",
  // default=off; category=style; fixable=none; version=v0.15.3
  "import/no-named-default": "off",
  // default=off; category=style; fixable=none; version=v1.19.0
  "import/no-named-export": "off",
  // default=off; category=style; fixable=🚧; version=v0.12.0
  "import/no-namespace": "off",
  // default=off; category=style; fixable=none; version=v1.43.0
  "import/no-nodejs-modules": "off",
  // default=off; category=style; fixable=none; version=v1.4.0
  "import/prefer-default-export": "off",
}

const suspicious: DummyRuleMap = {
  // default=off; category=suspicious; fixable=🚧; version=v0.15.13
  "import/no-absolute-path": "error",
  // default=off; category=suspicious; fixable=🛠️; version=v0.16.1
  "import/no-empty-named-blocks": "error",
  // default=off; category=suspicious; fixable=none; version=v0.2.3
  "import/no-named-as-default": "error",
  // default=off; category=suspicious; fixable=none; version=v0.2.1
  "import/no-named-as-default-member": "error",
  // default=off; category=suspicious; fixable=none; version=v0.0.13
  "import/no-self-import": "error",
  // default=off; category=suspicious; fixable=none; version=v0.16.11
  "import/no-unassigned-import": "off",
}

export const importRules: DummyRuleMap = {
  ...correctness,
  ...nursery,
  ...pedantic,
  ...restriction,
  ...style,
  ...suspicious,
}
