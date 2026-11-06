// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {addFixLinksCommand} from "./docs-plugin/fix-links.js"
import {addGeneratePageMapCommand} from "./docs-plugin/generate-page-map.js"

function setupCli() {
  addGeneratePageMapCommand()
  addFixLinksCommand()

  program.parse()
}

setupCli()
