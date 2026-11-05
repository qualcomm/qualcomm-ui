// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.2.18
  "jsdoc/check-property-names": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.3.2
  "jsdoc/check-tag-names": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.3.2
  "jsdoc/implements-on-classes": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.3.2
  "jsdoc/no-defaults": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.2.18
  "jsdoc/require-property": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.18
  "jsdoc/require-property-description": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.18
  "jsdoc/require-property-name": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.18
  "jsdoc/require-property-type": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.3.2
  "jsdoc/require-yields": "off",
}

const pedantic: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.4.3
  "jsdoc/require-param": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.4.4
  "jsdoc/require-param-description": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.3
  "jsdoc/require-param-name": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.4.4
  "jsdoc/require-param-type": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.4.0
  "jsdoc/require-returns": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.0
  "jsdoc/require-returns-description": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.4.3
  "jsdoc/require-returns-type": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.65.0
  "jsdoc/require-throws-type": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.65.0
  "jsdoc/require-yields-type": "off",
}

const restriction: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v0.2.16
  "jsdoc/check-access": "off",
  // TODO: decide whether to enable. default=off; fixable=🚧; version=v0.2.16
  "jsdoc/empty-tags": "off",
}

const style: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.65.0
  "jsdoc/require-throws-description": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.68.0
  "jsdoc/require-yields-description": "off",
}

export const jsdocRules: DummyRuleMap = {
  ...correctness,
  ...pedantic,
  ...restriction,
  ...style,
}
