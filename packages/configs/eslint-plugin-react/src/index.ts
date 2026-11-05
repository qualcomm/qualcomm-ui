// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ESLint, Linter} from "eslint"

import {config, plugin, rules} from "./plugin.js"

interface QuiEslintPluginReact {
  config: Linter.Config[]
  plugin: ESLint.Plugin
  rules: ESLint.Plugin["rules"]
}

const defaultExport: QuiEslintPluginReact = {
  config,
  plugin,
  rules,
}

export default defaultExport
