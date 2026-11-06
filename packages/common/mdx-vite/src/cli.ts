// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {addFixLinksCommand} from "./docs-plugin/fix-links.js"
import {addGeneratePageMapCommand} from "./docs-plugin/generate-page-map.js"
import {addLintCommand} from "./docs-plugin/lint-pages.js"

function setupCli() {
  program.name("qui-docs")

  addGeneratePageMapCommand()
  addFixLinksCommand()
  addLintCommand()

  program.parse()
}

setupCli()
