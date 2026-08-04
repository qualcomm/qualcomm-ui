// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=off; category=correctness; fixable=⚠️ 🛠 💡; version=v0.12.0
  "react/exhaustive-deps": "error",
  // default=off; category=correctness; fixable=💡; version=v0.16.9
  "react/forward-ref-uses-ref": "error",
  // default=off; category=correctness; fixable=none; version=v0.0.14
  "react/jsx-key": "error",
  // default=off; category=correctness; fixable=none; version=v0.0.14
  "react/jsx-no-duplicate-props": "error",
  // default=off; category=correctness; fixable=none; version=v0.1.1
  "react/jsx-no-undef": "off",
  // default=off; category=correctness; fixable=🛠️; version=v0.7.2
  "react/jsx-props-no-spread-multi": "error",
  // default=off; category=correctness; fixable=none; version=v0.0.14
  "react/no-children-prop": "error",
  // default=off; category=correctness; fixable=none; version=v0.9.6
  "react/no-danger-with-children": "error",
  // default=off; category=correctness; fixable=none; version=v1.36.0
  "react/no-did-mount-set-state": "error",
  // default=off; category=correctness; fixable=none; version=v1.62.0
  "react/no-did-update-set-state": "error",
  // default=off; category=correctness; fixable=none; version=v0.2.0
  "react/no-direct-mutation-state": "error",
  // default=off; category=correctness; fixable=none; version=v0.0.15
  "react/no-find-dom-node": "off",
  // default=off; category=correctness; fixable=none; version=v0.0.19
  "react/no-is-mounted": "error",
  // default=off; category=correctness; fixable=none; version=v0.0.15
  "react/no-render-return-value": "error",
  // default=off; category=correctness; fixable=none; version=v0.0.15
  "react/no-string-refs": "off",
  // default=off; category=correctness; fixable=none; version=v1.37.0
  "react/no-this-in-sfc": "error",
  // default=off; category=correctness; fixable=none; version=v1.35.0
  "react/no-unsafe": "error",
  // default=off; category=correctness; fixable=none; version=v1.37.0
  "react/no-will-update-set-state": "error",
  // default=off; category=correctness; fixable=none; version=v0.2.11
  "react/void-dom-elements-no-children": "error",
}

const nursery: DummyRuleMap = {
  // default=off; category=nursery; fixable=none; version=v0.2.0
  "react/require-render-return": "off",
}

const pedantic: DummyRuleMap = {
  // default=off; category=pedantic; fixable=none; version=v0.2.15
  "react/checked-requires-onchange-or-readonly": "off",
  // default=off; category=pedantic; fixable=none; version=v1.42.0
  "react/display-name": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.2.5
  "react/jsx-no-target-blank": "error",
  // default=off; category=pedantic; fixable=💡; version=v0.0.14
  "react/jsx-no-useless-fragment": "off",
  // default=off; category=pedantic; fixable=🚧; version=v0.0.15
  "react/no-unescaped-entities": "error",
  // default=off; category=pedantic; fixable=none; version=v0.3.3
  "react/rules-of-hooks": "error",
}

const perf: DummyRuleMap = {
  // default=off; category=perf; fixable=none; version=v1.48.0
  "react/jsx-no-constructed-context-values": "off",
  // default=off; category=perf; fixable=none; version=v0.13.0
  "react/no-array-index-key": "warn",
  // default=off; category=perf; fixable=none; version=v1.66.0
  "react/no-object-type-as-default-prop": "off",
}

const restriction: DummyRuleMap = {
  // default=off; category=restriction; fixable=none; version=v0.1.1
  "react/button-has-type": "warn",
  // default=off; category=restriction; fixable=none; version=v1.62.0
  "react/forbid-component-props": "off",
  // default=off; category=restriction; fixable=none; version=v1.24.0
  "react/forbid-dom-props": "off",
  // default=off; category=restriction; fixable=none; version=v0.16.11
  "react/forbid-elements": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.15.14
  "react/jsx-filename-extension": "off",
  // default=off; category=restriction; fixable=none; version=v1.53.0
  "react/no-clone-element": "off",
  // default=off; category=restriction; fixable=none; version=v0.0.14
  "react/no-danger": "off",
  // default=off; category=restriction; fixable=none; version=v1.43.0
  "react/no-multi-comp": "off",
  // default=off; category=restriction; fixable=none; version=v1.53.0
  "react/no-react-children": "off",
  // default=off; category=restriction; fixable=🚧; version=v0.2.0
  "react/no-unknown-property": "off",
  // default=off; category=restriction; fixable=none; version=v1.23.0
  "react/only-export-components": "off",
  // default=off; category=restriction; fixable=none; version=v1.59.0
  "react/prefer-function-component": "warn",
}

const style: DummyRuleMap = {
  // default=off; category=style; fixable=🚧; version=v1.59.0
  "react/hook-use-state": "off",
  // default=off; category=style; fixable=🛠️; version=v0.7.0
  "react/jsx-boolean-value": "error",
  // default=off; category=style; fixable=🛠️; version=v0.7.0
  "react/jsx-curly-brace-presence": "error",
  // default=off; category=style; fixable=🛠️; version=v1.12.0
  "react/jsx-fragments": "off",
  // default=off; category=style; fixable=none; version=v1.13.0
  "react/jsx-handler-names": "off",
  // default=off; category=style; fixable=none; version=v1.36.0
  "react/jsx-max-depth": "off",
  // default=off; category=style; fixable=none; version=v1.19.0
  "react/jsx-pascal-case": "error",
  // default=off; category=style; fixable=none; version=v1.33.0
  "react/jsx-props-no-spreading": "off",
  // default=off; category=style; fixable=none; version=v1.33.0
  "react/no-redundant-should-component-update": "error",
  // default=off; category=style; fixable=none; version=v0.5.2
  "react/no-set-state": "off",
  // default=off; category=style; fixable=none; version=v0.5.0
  "react/prefer-es6-class": "off",
  // default=off; category=style; fixable=🛠️; version=v0.9.3
  "react/self-closing-comp": "error",
  // default=off; category=style; fixable=none; version=v1.26.0
  "react/state-in-constructor": "off",
}

const suspicious: DummyRuleMap = {
  // default=off; category=suspicious; fixable=🚧; version=v0.10.0
  "react/iframe-missing-sandbox": "off",
  // default=off; category=suspicious; fixable=none; version=v0.0.14
  "react/jsx-no-comment-textnodes": "error",
  // default=off; category=suspicious; fixable=🚧; version=v0.13.2
  "react/jsx-no-script-url": "error",
  // default=off; category=suspicious; fixable=none; version=v0.15.13
  "react/no-namespace": "error",
  // default=off; category=suspicious; fixable=none; version=v1.66.0
  "react/no-unstable-nested-components": "off",
  // default=off; category=suspicious; fixable=none; version=v0.0.20
  "react/react-in-jsx-scope": "off",
  // default=off; category=suspicious; fixable=none; version=v0.11.0
  "react/style-prop-object": "error",
}

export const reactRules: DummyRuleMap = {
  ...correctness,
  ...nursery,
  ...pedantic,
  ...perf,
  ...restriction,
  ...style,
  ...suspicious,
}
