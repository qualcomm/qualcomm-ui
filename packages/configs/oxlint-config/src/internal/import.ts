// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  "import/default": "off",
  "import/namespace": "off",
}

const nursery: DummyRuleMap = {
  "import/export": "error",
  "import/named": "error",
}

const pedantic: DummyRuleMap = {
  "import/max-dependencies": "off",
}

const restriction: DummyRuleMap = {
  "import/extensions": "off",
  "import/no-amd": "error",
  "import/no-commonjs": "off",
  "import/no-cycle": "off",
  "import/no-default-export": "off",
  "import/no-dynamic-require": "error",
  "import/no-relative-parent-imports": "off",
  "import/no-webpack-loader-syntax": "off",
  "import/unambiguous": "off",
}

const suspicious: DummyRuleMap = {
  "import/no-absolute-path": "error",
  "import/no-empty-named-blocks": "error",
  "import/no-named-as-default": "error",
  "import/no-named-as-default-member": "error",
  "import/no-self-import": "error",
  "import/no-unassigned-import": "off",
}

const style: DummyRuleMap = {
  "import/consistent-type-specifier-style": "off", // we handle this in the TypeScript config
  "import/exports-last": "off",
  "import/first": "error",
  "import/group-exports": "off",
  "import/newline-after-import": "error",
  "import/no-anonymous-default-export": "off",
  // TODO: re-enable when autofix is available:
  //  https://oxc.rs/docs/guide/usage/linter/rules/import/no-duplicates.html
  "import/no-duplicates": ["off", {preferInline: true}],
  "import/no-mutable-exports": "error",
  "import/no-named-default": "off",
  "import/no-named-export": "off",
  "import/no-namespace": "off",
  "import/no-nodejs-modules": "off",
  "import/prefer-default-export": "off",
}

export const importRules: DummyRuleMap = {
  ...correctness,
  ...nursery,
  ...pedantic,
  ...style,
  ...restriction,
  ...suspicious,
}
