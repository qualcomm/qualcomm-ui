// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap, OxlintConfig} from "oxlint"

import {jsxA11yRules} from "./internal/jsx-a11y.js"

export const reactPlugins: NonNullable<OxlintConfig["plugins"]> = [
  "react",
  "jsx-a11y",
  "react-perf",
]

const correctness: DummyRuleMap = {
  "react/exhaustive-deps": [
    "error",
    {
      additionalHooks: "useSafeLayoutEffect",
    },
  ],
  "react/forward-ref-uses-ref": "error",
  "react/jsx-key": "error",
  "react/jsx-no-duplicate-props": "error",
  "react/jsx-no-undef": "off", // handled by TypeScript
  "react/jsx-props-no-spread-multi": "error",
  "react/no-children-prop": "error",
  "react/no-danger-with-children": "error",
  "react/no-did-mount-set-state": "error",
  "react/no-did-update-set-state": "error",
  "react/no-direct-mutation-state": "error",
  "react/no-find-dom-node": "off", // removed in React 19, no longer relevant
  "react/no-is-mounted": "error",
  "react/no-render-return-value": "error",
  "react/no-string-refs": "off", // removed in React 19, no longer relevant
  "react/no-this-in-sfc": "error",
  "react/no-unsafe": "error",
  "react/no-will-update-set-state": "error",
  "react/void-dom-elements-no-children": "error",
}

const styleRules: DummyRuleMap = {
  "react/hook-use-state": "off",
  "react/jsx-boolean-value": "error",
  "react/jsx-curly-brace-presence": [
    "error",
    {children: "never", propElementValues: "always", props: "never"},
  ],
  "react/jsx-fragments": "off",
  "react/jsx-handler-names": "off",
  "react/jsx-max-depth": "off",
  "react/jsx-pascal-case": [
    "error",
    {
      allowNamespace: true,
    },
  ],
  "react/jsx-props-no-spreading": "off",
  "react/no-redundant-should-component-update": "error",
  "react/no-set-state": "off",
  "react/prefer-es6-class": "off",
  "react/self-closing-comp": ["error", {html: false}],
  "react/state-in-constructor": "off",
}

const suspicious: DummyRuleMap = {
  "react/iframe-missing-sandbox": "off",
  "react/jsx-no-comment-textnodes": "error",
  "react/jsx-no-script-url": "error",
  "react/no-namespace": "error",
  // TODO: enable if this ever can exclude components in useMemo.
  "react/no-unstable-nested-components": "off",
  "react/react-in-jsx-scope": "off", // no longer required in React 17+
  "react/style-prop-object": "error",
}

const pedantic: DummyRuleMap = {
  "react/checked-requires-onchange-or-readonly": "off",
  "react/display-name": "off",
  "react/jsx-no-target-blank": "error", // protects against a security vulnerability
  "react/jsx-no-useless-fragment": "off",
  "react/no-unescaped-entities": "error",
  "react/rules-of-hooks": "error",
}

const restriction: DummyRuleMap = {
  "react/button-has-type": "warn",
  "react/forbid-component-props": "off",
  "react/forbid-dom-props": "off",
  "react/forbid-elements": "off",
  "react/jsx-filename-extension": "off",
  "react/no-clone-element": "off",
  "react/no-danger": "off",
  "react/no-multi-comp": "off",
  "react/no-react-children": "off",
  "react/no-unknown-property": "off",
  "react/only-export-components": "off",
  "react/prefer-function-component": "warn",
}

const perf: DummyRuleMap = {
  "react-perf/jsx-no-jsx-as-prop": "off", // mitigated by React Compiler
  "react-perf/jsx-no-new-array-as-prop": "off", // mitigated by React Compiler
  "react-perf/jsx-no-new-function-as-prop": "off", // mitigated by React Compiler
  "react-perf/jsx-no-new-object-as-prop": "off", // mitigated by React Compiler
  "react/jsx-no-constructed-context-values": "off", // mitigated by React Compiler
  "react/no-array-index-key": "warn",
  "react/no-object-type-as-default-prop": "off", // mitigated by React Compiler
}

const nursery: DummyRuleMap = {
  "react/require-render-return": "off",
}

export const reactRules: DummyRuleMap = {
  ...correctness,
  ...styleRules,
  ...pedantic,
  ...restriction,
  ...suspicious,
  ...perf,
  ...nursery,
  ...jsxA11yRules,
}
