// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ESLint, Linter} from "eslint"

import {config, plugin, rules} from "./plugin.js"

interface QuiEslintPluginAngular {
  config: Linter.Config[]
  plugin: ESLint.Plugin
  rules: ESLint.Plugin["rules"]
}

const defaultExport: QuiEslintPluginAngular = {
  config,
  plugin,
  rules: rules as unknown as QuiEslintPluginAngular["rules"],
}

export default defaultExport
